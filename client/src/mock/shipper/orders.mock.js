export const orders = [
  {
    id: 101,
    code: 'FD-101',
    status: 'available',
    pickup: { name: 'Bánh mì A', lat: 10.77, lng: 106.7 },
    dropoff: { name: 'Khách hàng Q1', lat: 10.78, lng: 106.69 },
    distance: 3.2,
    eta: 12,
    fee: 25000,
    path: [],
  },
  {
    id: 102,
    code: 'FD-102',
    status: 'accepted',
    pickup: { name: 'Phở B', lat: 10.771, lng: 106.705 },
    dropoff: { name: 'Khách hàng Q3', lat: 10.79, lng: 106.71 },
    distance: 4.1,
    eta: 16,
    fee: 30000,
    path: [],
  },
  {
    id: 103,
    code: 'FD-103',
    status: 'completed',
    pickup: { name: 'Cơm C', lat: 10.772, lng: 106.71 },
    dropoff: { name: 'Khách hàng Q5', lat: 10.8, lng: 106.69 },
    distance: 5.6,
    eta: 20,
    fee: 35000,
    path: [],
  },
];


