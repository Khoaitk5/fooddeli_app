import React from "react";

const MAP4D_SDK_URL = (key) =>
  `https://api.map4d.vn/sdk/map/js?version=2.6&key=${encodeURIComponent(key)}`;

function loadMap4d(key) {
  return new Promise((resolve, reject) => {
    if (window.map4d) {
      console.debug("[Map4D] SDK đã có sẵn (cache)");
      return resolve(window.map4d);
    }
    if (!key) return reject(new Error("Thiếu VITE_MAP4D_KEY"));

    // Không chèn trùng script
    const existing = document.querySelector('script[data-map4d-sdk="1"]');
    if (existing) {
      existing.onload = () => resolve(window.map4d);
      existing.onerror = () =>
        reject(new Error("Không tải được Map4D SDK (script cũ)"));
      return;
    }

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

export default function Map4DView({
  height = "50vh",
  initialCenter = { lat: 16.072, lng: 108.227 }, // Đà Nẵng
  zoom = 15,
}) {
  const containerRef = React.useRef(null);
  const mapRef = React.useRef(null);
  const markerRef = React.useRef(null);
  const watchIdRef = React.useRef(null);

  const [debugMsg, setDebugMsg] = React.useState("");
  const key = import.meta?.env?.VITE_MAP4D_KEY;
  console.log("[DEBUG] import.meta.env:", import.meta.env);

  React.useEffect(() => {
    let isUnmounted = false;

    (async () => {
      try {
        console.debug("[Map4D] ENV key =", key);
        if (!key) {
          const m = "Thiếu VITE_MAP4D_KEY trong .env (FE).";
          console.warn("[Map4D]", m);
          setDebugMsg(m);
          return;
        }

        const map4d = await loadMap4d(key);
        if (isUnmounted) return;

        // Khởi tạo map
        console.debug("[Map4D] Init map with:", { initialCenter, zoom });
        mapRef.current = new map4d.Map(containerRef.current, {
          center: initialCenter,
          zoom,
          controls: false,
        });

        // Tạo marker vị trí shipper
        console.debug("[Map4D] Create marker @", initialCenter);
        markerRef.current = new map4d.Marker({
          position: initialCenter,
          icon: "/navigation.png", // 👈 tự động load từ public/navigation.png
          anchor: [0.5, 0.5], // canh giữa icon
          title: "Vị trí của bạn",
        });

        markerRef.current.setMap(mapRef.current);

        // Cập nhật theo vị trí thực
        if (!("geolocation" in navigator)) {
          const m = "Trình duyệt không hỗ trợ Geolocation.";
          console.warn("[Map4D]", m);
          setDebugMsg((d) => d || m);
          return;
        }

        console.debug(
          "[Map4D] Geolocation available. Getting current position..."
        );
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            if (isUnmounted) return;
            const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            console.debug("[Map4D] Current position =", p);
            markerRef.current.setPosition(p);
            mapRef.current.moveCamera({ target: p, zoom });
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

        console.debug("[Map4D] Start watchPosition...");
        watchIdRef.current = navigator.geolocation.watchPosition(
          (pos) => {
            if (isUnmounted) return;
            const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            // console.debug("[Map4D] watchPosition =", p);
            markerRef.current.setPosition(p);
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
      isUnmounted = true;
      if (watchIdRef.current && navigator.geolocation.clearWatch) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        console.debug("[Map4D] Cleared watchPosition:", watchIdRef.current);
      }
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      mapRef.current = null;
    };
  }, [key, initialCenter, zoom]);

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
          bottom: 110px !important; /* đẩy lên 110px, tùy theo độ cao footer */
          right: 10px !important;
          z-index: 150 !important; /* đảm bảo nằm trên map và dưới nút */
        }
      `}</style>
    </div>
  );
}
