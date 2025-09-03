import './Navbar.css';
import { assets } from '../../assets/assets';
import ShopDropDown from '../ShopDropDown/ShopDropDown';
import { useContext } from 'react';
import { ShopContext } from '../Context/ShopContext';
import BalanceInformation from '../BalanceInformation/BalanceInformation';

const Navbar = ({ onLogout }) => {
	const { selectedShop, setSelectedShop, shops, role } = useContext(ShopContext); // Получаем роль из контекста

	const handleShopChange = (shopId) => {
		setSelectedShop(shopId);
	};

	const handleResetShop = () => {
		setSelectedShop(null); // Сбрасываем выбор магазина
	};

	return (
		<div className="navbar">
			<img className="epl-logo" src={assets.epl_logo} alt="Логотип" />
			{/* Проверяем, является ли пользователь админом. Если нет, отображаем список магазинов */}
			{role == 'admin' && (
				<div className='navbar-menu__container'>
					<ShopDropDown
						shops={shops}
						selectedShop={selectedShop}
						onShopChange={handleShopChange}
					/>
					{selectedShop && (
						<button onClick={handleResetShop} className="reset-shop-button">
							Сбросить магазин
						</button>
					)}
					<BalanceInformation selectedShop={selectedShop} />
				</div>
			)}
			<div className='exit-container'>
				<button className='exit-shop-button' onClick={onLogout}>
					<img src={assets.logout_icon} alt="Выйти" className="logout-icon" />
				</button>
			</div>
		</div>
	);
};

export default Navbar;