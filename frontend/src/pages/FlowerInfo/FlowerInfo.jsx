import { useContext, useEffect, useRef } from "react";
import "./FlowerInfo.css";
import { StoreContext } from "../../components/Context/StoreContext";
import { useParams, Link } from "react-router-dom";
import { assets } from "../../assets/assets_flowers";
import ShopInfo from "../../components/ShopInfo/ShopInfo";

const Shop = () => {
  const {
    url,
    cartItems,
    addToCart,
    removeFromCart,
    limited_shop_list,
    fetchFlowersById,
    listflowersbyid,
    totalRatings,
  } = useContext(StoreContext);
  const { flowerId, shopId } = useParams();
  const shop = limited_shop_list.find((e) => e._id === shopId);
  if (!shop) {
    return <div>Отзывы магазина не найдены</div>;
  }

  // Загружаем цветы при первом рендере и при изменении shopId или currentPage
  useEffect(() => {
    const fetchData = async () => {
      await fetchFlowersById(flowerId, shopId);
    };

    fetchData();
  }, [flowerId, shopId]);

  const sliderRef = useRef(null);

  const handleNavigation = (index) => {
    const sliderWidth = sliderRef.current.clientWidth;
    sliderRef.current.scrollLeft = sliderWidth * index;
  };

  return (
    <div className="shop-display">
      <div className="shop-info">
        <p className="shop-name">{shop.name}</p>
        <p className="shop-rating">
          <img src={assets.daimond} alt="Рейтинг" className="star-logo-img" />
          {shop.averageRating}({totalRatings})
        </p>
      </div>
      <hr className="shop-info-divider" />
      <ShopInfo shop={shop} url={url} />
      <div className="jewerly-name">
        <Link to={`/shop/${shopId}`}>
          <button className="back-btn">
            <img src={assets.back_btn} alt="" />
          </button>
        </Link>
        <p className="jewerly-name__txt">{listflowersbyid.name}</p>
      </div>
      <hr className="shop-info-divider" />
      <div className="jewerly">
        <div className="jewerly-item-img-container">
          <div className="slider-info" ref={sliderRef}>
            {listflowersbyid.images.map((image, index) => (
              <img
                key={index}
                className="jewerly-info-image"
                src={`${url}/flower-images/${image}`}
                alt={`flower-${index}`}
              />
            ))}
          </div>
          <div className="slider-nav-info">
            {listflowersbyid.images.map((_, index) => (
              <span
                key={index}
                onClick={() => handleNavigation(index)}
                className="slider-dot-info"
              ></span>
            ))}
          </div>
        </div>
        <div className="jewerly-content-info">
          <div className="jewerly-cost__container">
            <p className="jewerly-cost">
              от {Math.floor(listflowersbyid.price).toLocaleString("ru-RU")} ₽
            </p>
          </div>
          {!cartItems[flowerId] ? (
            <button
              className="jewerly-info-add-cart-button"
              onClick={() => {
                addToCart(flowerId);
              }}
              alt=""
            >
              {" "}
              <img className="basket-epl" src={assets.basket_epl} alt="" />
              ДОБАВИТЬ В КОРЗИНУ
            </button>
          ) : (
            <div className="jewerly-info-cart-added">
              <img
                onClick={() => removeFromCart(flowerId)}
                src={assets.remove_icon_black}
                alt=""
                className="jewerly-button__img"
              />
              <p className="info-added-number">{cartItems[flowerId]}</p>
              <img
                onClick={() => {
                  addToCart(flowerId);
                }}
                src={assets.add_icon_black}
                alt=""
                className="jewerly-button__img"
              />
            </div>
          )}
          <p className="jewerly-description">{listflowersbyid.description}</p>
        </div>
      </div>
    </div>
  );
};

export default Shop;
