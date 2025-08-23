import React from 'react';
import './ShopDropDown.css';

const ShopDropDown = ({ shops, selectedShop, onShopChange }) => {
  return (
    <select 
      className="shop-dropdown" 
      value={selectedShop || ''} 
      onChange={(e) => onShopChange(e.target.value)}
    >
      <option value="" disabled>Выберите магазин</option>
      {shops.map((shop) => (
        <option key={shop._id} value={shop._id}>
          {shop.name}
        </option>
      ))}
    </select>
  );
};

export default ShopDropDown;