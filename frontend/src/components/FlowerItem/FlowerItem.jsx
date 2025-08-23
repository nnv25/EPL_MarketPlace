import { useContext, useRef } from 'react';
import './FlowerItem.css';
import { assets } from "../../assets/assets_flowers";
import { useParams, Link } from 'react-router-dom';
import { StoreContext } from '../Context/StoreContext';


const FlowerItem = ({ _id, name, price, description, images, shop }) => {
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);
  const sliderRef = useRef(null);

  const handleNavigation = (index) => {
    const sliderWidth = sliderRef.current.clientWidth;
    sliderRef.current.scrollLeft = sliderWidth * index;
  };
  return (
    <div className="flower-item">
      <div className="flower-item-img-container">
      <Link to={`/flowers/${_id}/${shop}`}>
        <div className='slider' ref={sliderRef}>
          {images.map((image, index) => (
            <img
              key={index}
              className="flower-item-image"
              src={`${url}/flower-images/${image}`}
              alt={`flower-${index}`}
            />
          ))}
        </div>
        </Link>
        <div className="slider-nav">
          {images.map((_, index) => (
            <span 
              key={index}
              onClick={() => handleNavigation(index)}
              className="slider-dot"
            ></span>
          ))}
        </div>
        {!cartItems[_id]
          ? <img className='add' onClick={() => {addToCart(_id)}} src={assets.add_icon_white} alt="" />
          : <div className='flower-item-counter'>
              <img onClick={() => removeFromCart(_id)} src={assets.remove_icon_red} alt="" />
              <p>{cartItems[_id]}</p>
              <img onClick={() => {addToCart(_id);}} src={assets.add_icon_green} alt="" />
            </div>
        }
      </div>
      <Link to={`/flowers/${_id}/${shop}`}>
      <div className="flower-item-info">
        <div className="flower-item-name-rating">
          <p>{name}</p>
        </div>
        <p className="flower-item-desc">{description}</p>
        <p className="flower-item-price">{price} ₽</p>
      </div>
      </Link>
    </div>
  );
};

export default FlowerItem;