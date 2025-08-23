import { useContext, useEffect, useRef } from 'react';
import './FlowerInfo.css';
import { StoreContext } from '../../components/Context/StoreContext';
import { useParams, Link } from 'react-router-dom';
import { assets } from '../../assets/assets_flowers';

const Shop = () => {
    const { url, cartItems, addToCart, removeFromCart, limited_shop_list, fetchFlowersById, listflowersbyid } = useContext(StoreContext);
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
        <div className="flower-display">
            <div className="flower-display-top">
                <div className="flower-display-logo">
                    <Link to={`/shop/${shopId}`}><img className="shop-logo" src={`${url}/images/${shop.image}`} alt={shop.name} /></Link>
                </div>
                <div className='flower-display-shop'>
                    <div className="shop-info">
                        <p className='shop-name'>{shop.name}</p>
                        <p className="shop-raiting"><img src={assets.Star} alt="Рейтинг" className="star-logo-img" />{shop.averageRating}</p>
                    </div>
                    <p className="shop-work">
                        <img className="time-icon" src={assets.time} alt="" />:
                        {` Понедельник-Пятница: ${shop.work_time.weekdays}`}<br />
                        {`Суббота: ${shop.work_time.saturday}`}<br />
                        {`Воскресенье: ${shop.work_time.sunday}`}
                    </p>
                    <p className='shop-address'>{shop.address}</p>
                </div>
            </div>
            <hr className='shop-info-divider' />
            <div>
            </div>
            <div className=''>
                <div className="flower">
                    <div className='flex flower-item-grid flower-content'>
                        <div className="flower-item-img-container">
                            <div className='slider-info' ref={sliderRef}>
                                <Link to={`/shop/${shopId}`}><button className="flower-back-button">&lt;</button></Link>

                                {listflowersbyid.images.map((image, index) => (
                                    <img
                                        key={index}
                                        className="flower-info-image"
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
                        <div className='flower-content-info'>
                            <p className="flower-name">{listflowersbyid.name}</p>
                            <p className='flower-description'>{listflowersbyid.description}</p>
                            <p className='flower-cost'>{listflowersbyid.price} ₽</p>
                            {!cartItems[flowerId]
                                ? <button className='flower-info-add-cart-button' onClick={() => { addToCart(flowerId) }} alt="" >Добавить в корзину</button>
                                : <div className='flower-info-cart-added'>
                                    <img onClick={() => removeFromCart(flowerId)} src={assets.remove_icon_red} alt="" />
                                    <p className='info-added-number'>{cartItems[flowerId]}</p>
                                    <img onClick={() => { addToCart(flowerId); }} src={assets.add_icon_green} alt="" />
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
