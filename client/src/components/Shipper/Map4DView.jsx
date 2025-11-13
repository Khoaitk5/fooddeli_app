// src/components/Shipper/Map4DView.jsx
import React from "react";

const MAP4D_SDK_URL = (key) =>
  `https://api.map4d.vn/sdk/map/js?version=2.6&key=${encodeURIComponent(key)}`;

const API_BASE =
  (import.meta?.env?.VITE_API_BASE && String(import.meta.env.VITE_API_BASE)) ||
  "http://localhost:5000"; // Backend của bạn

function loadMap4d(key) {
  return new Promise((resolve, reject) => {
    if (window.map4d) {
      console.debug("[Map4D] SDK đã có sẵn (cache)");
      return resolve(window.map4d);
    }
    if (!key) return reject(new Error("Thiếu VITE_MAP4D_KEY"));

    // Nếu script đã có, đợi map4d xuất hiện
    const existing = document.querySelector('script[data-map4d-sdk="1"]');
    if (existing) {
      const iv = setInterval(() => {
        if (window.map4d) {
          clearInterval(iv);
          resolve(window.map4d);
        }
      }, 50);
      existing.addEventListener(
        "error",
        () => {
          clearInterval(iv);
          reject(new Error("Không tải được Map4D SDK (script cũ)"));
        },
        { once: true }
      );
      setTimeout(() => clearInterval(iv), 10000);
      return;
    }

    // Nạp script mới
    const s = document.createElement("script");
    s.src = MAP4D_SDK_URL(key);
    s.async = true;
    s.defer = true;
    s.setAttribute("data-map4d-sdk", "1");
    s.onload = () => {
      console.debug("[Map4D] SDK loaded:", s.src);
      resolve(window.map4d);
    };
    s.onerror = () =>
      reject(new Error("Không tải được Map4D SDK (network/script error)"));
    document.head.appendChild(s);
    console.debug("[Map4D] Inject script:", s.src);
  });
}

// --- helpers nhỏ ---
const haversine = (a, b) => {
  if (!a || !b) return Infinity;
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad((b.lat ?? b.latitude) - (a.lat ?? a.latitude));
  const dLon = toRad(
    (b.lng ?? b.lon ?? b.longitude) - (a.lng ?? a.lon ?? a.longitude)
  );
  const lat1 = toRad(a.lat ?? a.latitude);
  const lat2 = toRad(b.lat ?? b.latitude);
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return R * c; // mét
};

const formatDistance = (m) => {
  if (m == null || isNaN(m)) return "—";
  const v = Number(m);
  return v < 1000 ? `${Math.round(v)} m` : `${(v / 1000).toFixed(2)} km`;
};
const formatDuration = (sec) => {
  if (sec == null || isNaN(sec)) return "—";
  const s = Math.max(0, Math.round(Number(sec)));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m === 0 ? `${r} giây` : `${m} phút${r ? ` ${r} giây` : ""}`;
};

// --- decode Google/Map4D polyline string -> [{lat,lng}]
function decodePolyline(str) {
  let index = 0,
    lat = 0,
    lng = 0,
    coordinates = [];
  while (index < str.length) {
    let b,
      shift = 0,
      result = 0;
    do {
      b = str.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = (result & 1) ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = str.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = (result & 1) ? ~(result >> 1) : result >> 1;
    lng += dlng;

    coordinates.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return coordinates;
}

// Cố gắng "bóc" polyline & metrics từ mọi kiểu response có thể có của Map4D
function extractRoute(data) {
  // Trả về { path: [{lat,lng}], distanceMeters, durationSeconds }
  const out = { path: [], distanceMeters: null, durationSeconds: null };
  if (!data) return out;

  // Map4D v2 thường ở data.result.routes[0]
  const r0 =
    data?.result?.routes?.[0] ||
    data?.routes?.[0] ||
    data?.paths?.[0] ||
    data?.route?.[0];
  if (!r0) return out;

  // 1) Ưu tiên overviewPolyline (encoded string)
  if (typeof r0.overviewPolyline === "string" && r0.overviewPolyline.length) {
    out.path = decodePolyline(r0.overviewPolyline);
  } else {
    // 2) Fallback: gom path từ steps/legs (nếu có)
    let path = [];
    if (Array.isArray(r0?.legs)) {
      for (const leg of r0.legs) {
        if (Array.isArray(leg?.steps)) {
          for (const st of leg.steps) {
                       if (typeof st?.polyline === "string" && st.polyline) {
             path.push(...decodePolyline(st.polyline));
             continue;
           }
            if (Array.isArray(st?.path)) path.push(...st.path);
            else if (Array.isArray(st?.points)) path.push(...st.points);
          }
        }
      }
    } else if (Array.isArray(r0?.path)) {
      path = r0.path;
    }
    out.path = path
      .map((p) => {
        if (!p) return null;
        const lat = p.lat ?? p.latitude;
        const lng = p.lng ?? p.lon ?? p.longitude;
        return typeof lat === "number" && typeof lng === "number"
          ? { lat, lng }
          : null;
      })
      .filter(Boolean);
  }

  // Distance / duration: lấy value nếu là object
  const d = r0.distance ?? r0.total_distance ?? r0.summary?.distance;
  const t = r0.duration ?? r0.total_duration ?? r0.summary?.duration;

  if (typeof d === "number") out.distanceMeters = d;
  else if (d && typeof d.value === "number") out.distanceMeters = d.value;

  if (typeof t === "number") out.durationSeconds = t;
  else if (t && typeof t.value === "number") out.durationSeconds = t.value;

  // Sum từ legs nếu cần
  if ((!out.distanceMeters || !out.durationSeconds) && Array.isArray(r0.legs)) {
    let dm = 0,
      ts = 0;
    for (const leg of r0.legs) {
      const ld =
        typeof leg?.distance === "number"
          ? leg.distance
          : leg?.distance?.value;
      const lt =
        typeof leg?.duration === "number"
          ? leg.duration
          : leg?.duration?.value;
      if (typeof ld === "number") dm += ld;
      if (typeof lt === "number") ts += lt;
    }
    if (!out.distanceMeters) out.distanceMeters = dm || null;
    if (!out.durationSeconds) out.durationSeconds = ts || null;
  }

  return out;
}

export default function Map4DView({
  height = "50vh",
  initialCenter = { lat: 16.072, lng: 108.227 }, // Đà Nẵng
  zoom = 15,
  hideControls = false,
  followUser = false,
  // Điều hướng trong-app
  navRequest = null, // { start: true, target: 'shop'|'customer', dest: {lat, lon|lng}, orderId }
  onNavDone = () => {},
}) {
  const containerRef = React.useRef(null);
  const mapRef = React.useRef(null);
  const markerRef = React.useRef(null);
  const routePolylineRef = React.useRef(null);

  const watchIdRef = React.useRef(null);
  const currentPosRef = React.useRef(null);
  const lastRouteOriginRef = React.useRef(null);
  const currentDestRef = React.useRef(null);

  const [debugMsg, setDebugMsg] = React.useState("");
  const [navInfo, setNavInfo] = React.useState({
    navigating: false,
    eta: null,
    remain: null,
  });

  const key = import.meta?.env?.VITE_MAP4D_KEY;

  // Khởi tạo map + marker + theo dõi vị trí
  React.useEffect(() => {
    let isUnmounted = false;

    (async () => {
      try {
        if (!key) {
          const m = "Thiếu VITE_MAP4D_KEY trong .env (FE).";
          console.warn("[Map4D]", m);
          setDebugMsg(m);
          return;
        }
        const map4d = await loadMap4d(key);
        if (isUnmounted) return;
        await new Promise((r) => requestAnimationFrame(r));
        if (isUnmounted || !containerRef.current) return;

        mapRef.current = new map4d.Map(containerRef.current, {
          center: initialCenter,
          zoom,
          controls: !hideControls,
        });

        // Marker vị trí shipper
        markerRef.current = new map4d.Marker({
          position: initialCenter,
          icon: "/navigation.png",
          anchor: [0.5, 0.5],
          title: "Vị trí của bạn",
        });
        markerRef.current.setMap(mapRef.current);

        // Lấy vị trí hiện tại 1 lần
        if (!("geolocation" in navigator)) {
          const m = "Trình duyệt không hỗ trợ Geolocation.";
          console.warn("[Map4D]", m);
          setDebugMsg((d) => d || m);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            if (isUnmounted) return;
            const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            currentPosRef.current = p;
            if (markerRef.current) markerRef.current.setPosition(p);
            if (mapRef.current) mapRef.current.moveCamera({ target: p, zoom });
          },
          (err) => {
            const m = `Geolocation getCurrentPosition error: ${
              err?.message || err
            }`;
            console.warn("[Map4D]", m);
            setDebugMsg((d) => d || m);
          },
          { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
        );

        // Theo dõi vị trí liên tục
        watchIdRef.current = navigator.geolocation.watchPosition(
          async (pos) => {
            if (isUnmounted) return;
            const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            currentPosRef.current = p;
            if (markerRef.current) markerRef.current.setPosition(p);

            if (followUser && !navInfo.navigating) {
              mapRef.current?.moveCamera({ target: p });
            }

            // Nếu đang điều hướng → cân nhắc re-route
            if (navInfo.navigating && currentDestRef.current) {
              const origin = { lat: p.lat, lon: p.lng };
              const lastOrigin = lastRouteOriginRef.current;
              const traveled = lastOrigin
                ? haversine(
                    { lat: lastOrigin.lat, lng: lastOrigin.lon },
                    p
                  )
                : Infinity;

              // Re-route nếu đi lệch quá 50m HOẶC đã đi hơn 150m
              const off = lastOrigin
                ? haversine(
                    { lat: lastOrigin.lat, lng: lastOrigin.lon },
                    origin
                  )
                : Infinity;
              if (off > 50 || traveled > 150) {
                await drawRoute(origin, currentDestRef.current, /*fit=*/ false);
              }
            }
          },
          (err) => {
            const m = `Geolocation watchPosition error: ${err?.message || err}`;
            console.warn("[Map4D]", m);
            setDebugMsg((d) => d || m);
          },
          { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
        );
      } catch (e) {
        console.error("[Map4D] Init failed:", e);
        setDebugMsg(e?.message || "Không tải được Map4D.");
      }
    })();

    return () => {
      if (watchIdRef.current && navigator.geolocation.clearWatch) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        console.debug("[Map4D] Cleared watchPosition:", watchIdRef.current);
      }
      if (routePolylineRef.current) {
        try {
          routePolylineRef.current.setMap(null);
        } catch {}
        routePolylineRef.current = null;
      }
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      if (mapRef.current?.destroy) {
        try {
          mapRef.current.destroy();
        } catch {}
      }
      mapRef.current = null;
    };
  }, [key, initialCenter, zoom, hideControls, followUser, navInfo.navigating]);

  // Lắng nghe yêu cầu điều hướng (Home truyền vào)
  React.useEffect(() => {
    const req = navRequest;
    console.debug("[Map4D] navRequest nhận:", req);
    if (
      !req?.start ||
      !req?.dest?.lat ||
      (req?.dest?.lon == null && req?.dest?.lng == null)
    )
      return;

    const start = async () => {
      // Origin = vị trí hiện tại
      let origin;
      if (currentPosRef.current) {
        origin = {
          lat: currentPosRef.current.lat,
          lon: currentPosRef.current.lng,
        };
      } else {
        origin = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) =>
              resolve({
                lat: pos.coords.latitude,
                lon: pos.coords.longitude,
              }),
            (err) => reject(err),
            { enableHighAccuracy: true, maximumAge: 3000, timeout: 8000 }
          );
        }).catch(() => null);
      }

      if (!origin) {
        setDebugMsg(
          (d) => d || "Không lấy được vị trí hiện tại để bắt đầu điều hướng."
        );
        return;
      }

      const dest = {
        lat: req.dest.lat,
        lon: req.dest.lon ?? req.dest.lng,
      };
      await drawRoute(origin, dest, /*fit=*/ true);
      currentDestRef.current = dest;
      setNavInfo((s) => ({ ...s, navigating: true }));
    };

    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navRequest?.start, navRequest?.dest?.lat, navRequest?.dest?.lon, navRequest?.dest?.lng]);

  // Gọi BE và vẽ polyline
  async function drawRoute(origin, dest, fit) {
    try {
      // Xóa polyline cũ
      if (routePolylineRef.current) {
        try {
          routePolylineRef.current.setMap(null);
        } catch {}
        routePolylineRef.current = null;
      }

      // Gọi BE map4d/route
      const url = `${API_BASE}/api/map4d/route?origin=${origin.lat},${origin.lon}&destination=${dest.lat},${dest.lon}&mode=car`;
      const res = await fetch(url, { credentials: "include" });
      const text = await res.text(); // đọc raw để debug
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          `Route API trả về không phải JSON (status ${res.status}). Body: ${text.slice(
            0,
            200
          )}`
        );
      }
      if (!res.ok) {
        throw new Error(data?.message || `Route API lỗi ${res.status}`);
      }

      const { path, distanceMeters, durationSeconds } = extractRoute(data);
      if (!path || path.length < 2) {
        setDebugMsg("Không dựng được tuyến đường (path rỗng).");
        return;
      }

      lastRouteOriginRef.current = origin;

      // Vẽ polyline
      const mf = window.map4d;
      const mfPath = path.map((p) => new mf.LatLng(p.lat, p.lng));
       routePolylineRef.current = new mf.Polyline({
   path: mfPath,
   strokeColor: "#1976d2",
   strokeWidth: 6,          // 👈 Map4D v2
   strokeOpacity: 1,
 });
      routePolylineRef.current.setMap(mapRef.current);

      // Fit bounds (lần đầu)
      if (fit && mfPath.length) {
        try {
          // Một số phiên bản có Bounds, một số có LatLngBounds
          const BoundsClass = mf.Bounds || mf.LatLngBounds;
          const bounds = new BoundsClass();
          if (bounds.extend) {
            mfPath.forEach((pt) => bounds.extend(pt));
          } else if (bounds.union) {
            // fallback
            mfPath.forEach((pt) => bounds.union(pt));
          }
          const fitOptions =
            typeof mapRef.current?.fitBounds === "function" ? { padding: 40 } : undefined;
          mapRef.current?.fitBounds(bounds, fitOptions);
        } catch (e) {
          // bỏ qua nếu SDK không hỗ trợ
        }
      }

      setNavInfo((s) => ({
        ...s,
        eta:
          durationSeconds != null ? formatDuration(durationSeconds) : s.eta,
        remain:
          distanceMeters != null ? formatDistance(distanceMeters) : s.remain,
      }));
    } catch (e) {
      console.warn("[Map4D] drawRoute error:", e);
      setDebugMsg((d) => d || (e?.message || "Không thể vẽ tuyến đường."));
    }
  }

  // Dừng điều hướng
  const stopNavigation = React.useCallback(() => {
    if (routePolylineRef.current) {
      try {
        routePolylineRef.current.setMap(null);
      } catch {}
      routePolylineRef.current = null;
    }
    currentDestRef.current = null;
    lastRouteOriginRef.current = null;
    setNavInfo({ navigating: false, eta: null, remain: null });
    onNavDone?.();
  }, [onNavDone]);

  return (
    <div style={{ position: "relative", width: "100%", height }}>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 12,
          overflow: "hidden",
          background: "#eef2f7",
          position: "relative",
          zIndex: 1,
        }}
      />

      {/* Overlay điều hướng */}
      {navInfo.navigating && (
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            right: 12,
            zIndex: 3,
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <div
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div style={{ fontSize: 13, color: "#334155", fontWeight: 700 }}>
              Đang chỉ đường…
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ fontSize: 12, color: "#64748b" }}>
                Còn lại:&nbsp;
                <b style={{ color: "#0f172a" }}>{navInfo.remain ?? "—"}</b>
              </div>
              <div style={{ fontSize: 12, color: "#64748b" }}>
                ~<b style={{ color: "#0f172a" }}>{navInfo.eta ?? "—"}</b>
              </div>
            </div>
            <button
              onClick={stopNavigation}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid rgba(239,68,68,0.3)",
                background:
                  "linear-gradient(135deg, rgba(239,68,68,0.95), rgba(220,38,38,0.95))",
                color: "#fff",
                fontSize: 12,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Dừng
            </button>
          </div>
        </div>
      )}

      {!!debugMsg && (
        <div
          style={{
            position: "absolute",
            left: 12,
            bottom: 12,
            right: 12,
            zIndex: 2,
            padding: "10px 12px",
            borderRadius: 8,
            fontSize: 12,
            lineHeight: 1.4,
            background: "rgba(255, 0, 0, 0.08)",
            color: "#b91c1c",
            border: "1px solid rgba(185, 28, 28, 0.35)",
            backdropFilter: "blur(4px)",
          }}
        >
          <b>Map debug:</b> {debugMsg}
        </div>
      )}

      <style>{`
        /* Dời control của Map4D lên cao hơn để tránh bị che */
        .map4d-control, .mf-control, .map4d-control-wrapper {
          bottom: 110px !important;
          right: 10px !important;
          z-index: 150 !important;
        }
      `}</style>
    </div>
  );
}
