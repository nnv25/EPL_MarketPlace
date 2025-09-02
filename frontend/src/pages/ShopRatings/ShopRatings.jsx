import { useContext, useEffect, useState } from 'react';
import './ShopRatings.css';
import { StoreContext } from '../../components/Context/StoreContext';
import { useParams, Link } from 'react-router-dom';
import PageSelector from '../../components/PageSelector/PageSelector'; // Импортируйте новый компонент
import { assets } from '../../assets/assets_flowers';
import ShopInfo from '../../components/ShopInfo/ShopInfo';

const Shop = () => {
	const { url, limited_shop_list, fetchFlowersListWithPagination, flowerPagination, listRatings, fetchRatingsList, totalRatings, } = useContext(StoreContext);
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
		<div className='overview-container'>
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
				<p className="jewerly-name__txt">ОТЗЫВЫ О МАГАЗИНЕ</p>
			</div>
			<hr className="shop-info-divider" />
			{listRatings.map((item, index) => (
				<div key={index} className="rating rating-item-grid ">
					<div className="raiting-container__left">
						<div className="left-top">
							<div className="author-name">
								<p className="description">{item.userId.name}</p>
							</div>
							<div className="comment-date">
								<p className="user-comment__date">
									{formatDate(item.createdAt)} г.
								</p>
							</div>
						</div>
						<div className="comment-container">
							<div className="comment-block">
								<p className="user-comment">{item.comment}</p>
							</div>
							<div className="raiting-block">
								<p className="raiting-number">Оценка:</p>

								<div className="daimonds-container">
									{Array.from({ length: 5 }, (_, i) => i + 1).map((value) => (
										<img
											key={value}
											src={
												value <= Math.round(item.rating)
													? assets.daimond_filled   // закрашенный
													: assets.daimond_outline  // пустой
											}
											alt="diamond"
											className="daimonds-img"
										/>
									))}
								</div>
							</div>
						</div>
					</div>
					<div className="raiting-container__right">
						<div className="right-top">
							<div className="author-name">
								<p className="description">Ответ магазина</p>
							</div>
							<div className="comment-date">
								<p className="user-comment__date">{item.storeComment}</p>
							</div>
						</div>
					</div>
				</div>
			))}
			<PageSelector
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={handlePageChange}
			/>
		</div>
	);
};

export default Shop;
