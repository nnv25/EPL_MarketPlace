{/*import './Navbar.css';
import { assets } from '../../assets/assets';
import ShopDropDown from '../ShopDropDown/ShopDropDown';
import { useContext } from 'react';
import { ShopContext } from '../Context/ShopContext';

const Navbar = ({ onLogout }) => {
  const { selectedShop, setSelectedShop, shops, } = useContext(ShopContext);

  const handleShopChange = (shopId) => {
    setSelectedShop(shopId);
  };

  const handleResetShop = () => {
    setSelectedShop(null); // Сбрасываем выбор магазина
  };

  return (
    <div className="navbar">
      <img className="logo" src={assets.logo} alt="" />
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
      <img className="profile" src={assets.profile_image} alt="" />
      <button onClick={onLogout}>Выйти</button>
    </div>
  );
};

export default Navbar;*/}
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
      <img className="logo" src={assets.logo} alt="Логотип" />

      {/* Проверяем, является ли пользователь админом. Если нет, отображаем список магазинов */}
      {role == 'admin' && (
        <>
          <ShopDropDown
            shops={shops}
            selectedShop={selectedShop}
            onShopChange={handleShopChange}
          />
          {selectedShop && (
            <div className='shop-information'>
              
              <button onClick={handleResetShop} className="reset-shop-button">
                Сбросить магазин
              </button>
            </div>
          )}
        </>
      )}
      <BalanceInformation selectedShop={selectedShop} />
      <button className='exit-shop-button' onClick={onLogout}>Выйти</button> {/* Используем onLogout */}
    </div>
  );
};

export default Navbar;