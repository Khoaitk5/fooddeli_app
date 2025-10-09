import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RestaurantDetail from '../../components/role-specific/Customer/RestaurantDetail';

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock restaurant data - in real app this would come from API
  const restaurantData = {
    name: "KFC Việt Nam",
    image: "/KFC_logo.png",
    rating: 4.5,
    distance: "2.1 km",
    time: "25-30 phút",
    promotion: "Giảm 30k cho đơn từ 150k",
    tags: ["Gà rán", "Burger", "Combo"],
  };

  const handleClose = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <RestaurantDetail
      {...restaurantData}
      onClose={handleClose}
    />
  );
};

export default RestaurantDetailPage;