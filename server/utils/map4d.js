// Tính khoảng cách giữa 2 tọa độ theo công thức Haversine
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Bán kính Trái đất (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Lọc shop trong bán kính 10 km
export const filterShopsByDistance = (userLocation, shops, radiusKm = 10) => {
  return shops.filter(shop => {
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      shop.lat,
      shop.lng
    );
    return distance <= radiusKm;
  });
};
