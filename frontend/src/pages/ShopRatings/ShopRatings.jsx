
import { useContext, useEffect, useState } from 'react';
import './ShopRatings.css';
import { StoreContext } from '../../components/Context/StoreContext';
import { useParams, Link } from 'react-router-dom';
import PageSelector from '../../components/PageSelector/PageSelector'; // Импортируйте новый компонент
import { assets } from '../../assets/assets_flowers';

const Shop = () => {
    const { url, limited_shop_list, fetchFlowersListWithPagination, flowerPagination, listRatings, fetchRatingsList, totalRatings,  } = useContext(StoreContext);
    const { shopId } = useParams();
    const { currentPage = 1, totalPages = 1 } = flowerPagination || {};
    const limit = 15;
    const shop = limited_shop_list.find((e) => e._id === shopId);
    if (!shop) {
        return <div>Отзывы магазина не найдены</div>;
    }

    // Загружаем цветы при первом рендере и при изменении shopId или currentPage
    useEffect(() => {
        const fetchData = async () => {
            await fetchRatingsList(shopId, currentPage, limit);
        };

        fetchData();
    }, [shopId, currentPage, limit]);

    // Функция для изменения страницы
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            fetchFlowersListWithPagination(shopId, newPage);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
      };

    return (
        <div>
            <div>
                <Link to={`/shop/${shopId}`}><button className="rating-back-button">Вернутся в магазин</button></Link>
            </div>
            <div className='rating-window'>
                <div>
                    <p className="shop-raiting"><img src={assets.Star} alt="Рейтинг" className="star-logo-img" />{shop.averageRating} ({totalRatings})</p>
                </div>
                <h3 className='raiting-h3'>Отзывы о магазине: "{shop.name}"</h3>
                {listRatings.map((item, index) => (
                <div key={index} className="rating rating-item-grid ">
                    <div className=''>
                        <div className='rating-name flex'>
                            <p className="description">{item.userId.name}</p>
                            <p className='rating-user-comment'>{formatDate(item.createdAt)} г.</p>
                        </div>
                        <div className='flex'>
                            <p className="rating-number"><img src={assets.Star} alt="Рейтинг" className="rating-star" /></p>
                            <p>{item.rating}</p>
                            <p className='rating-user-comment'>{item.comment}</p>
                        </div>
                        
                    </div>
                    <div className=''>
                        <div className='rating-name rating-shop-answer'>
                            <p>Ответ магазина:</p>
                        </div>
                        <div className='rating-shop-answer-content'>
                            <p>{item.storeComment}</p>
                        </div>
                    </div>
                </div>
                ))}
            </div>
            <PageSelector
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange} 
            />
        </div>
    );
};

export default Shop;
