import { useContext, useRef } from "react";
import "./JewerlyItem.css";
import { assets } from "../../assets/assets_flowers";
import { useParams, Link } from "react-router-dom";
import { StoreContext } from "../Context/StoreContext";

const JewerlyItem = ({ _id, name, price, description, images, shop }) => {
  const { cartItems, addToCart, removeFromCart, url } =
    useContext(StoreContext);
  const sliderRef = useRef(null);

  const handleNavigation = (index) => {
    const sliderWidth = sliderRef.current.clientWidth;
    sliderRef.current.scrollLeft = sliderWidth * index;
  };
  
  return (
    <div className="jewerly-item">
      <div className="jewerly-item-img-container">
        <Link to={`/flowers/${_id}/${shop}`}>
          <div className="slider" ref={sliderRef}>
            {images.map((image, index) => (
              <img
                key={index}
                className="jewerly-item-image"
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
        {!cartItems[_id] ? (
          <img
            className="add"
            onClick={() => {
              addToCart(_id);
            }}
            src={assets.add_icon_white}
            alt=""
          />
        ) : (
          <div className="jewerly-item-counter">
            <img
              onClick={() => removeFromCart(_id)}
              src={assets.remove_icon_red}
              alt=""
            />
            <p>{cartItems[_id]}</p>
            <img
              onClick={() => {
                addToCart(_id);
              }}
              src={assets.add_icon_green}
              alt=""
            />
          </div>
        )}
      </div>
      <Link to={`/flowers/${_id}/${shop}`}>
        <div className="jewerly-item-info">
          <div className="jewerly-item-name-rating">
            <p>{name}</p>
          </div>
          <p className="jewerly-item-desc">{description}</p>
          <p className="jewerly-item-price">
            {Number(price).toLocaleString("ru-RU")} ₽
          </p>
        </div>
      </Link>
    </div>
  );
};

export default JewerlyItem;
