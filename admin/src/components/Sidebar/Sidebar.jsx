import './Sidebar.css';
import { assets } from '../../assets/assets';
import { useContext } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const { selectedShop } = useContext(ShopContext); // Доступ к контексту

  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        {!selectedShop && (
          <NavLink to="/addshop" className="sidebar-option">
            <img className='sidebar-img' src={assets.door_enter} alt="" />
            <p>Добавить магазин</p>
          </NavLink>
        )}
        <NavLink to="/addflower" className="sidebar-option">
          <img className='sidebar-img' src={assets.add_icon} alt="" />
          <p>Добавить товар</p>
        </NavLink>
        <NavLink to="/updateshop" className="sidebar-option">
          <img className='sidebar-img' src={assets.edit} alt="" />
          <p>Редактировать информацию о магазине</p>
        </NavLink>
        {!selectedShop && (
          <NavLink to="/shoplist" className="sidebar-option">
            <img className='sidebar-img' src={assets.shop_list} alt="" />
            <p>Список магазинов</p>
          </NavLink>
        )}
        <NavLink to="/flowerlist" className="sidebar-option">
          <img className='sidebar-img' src={assets.flower_list} alt="" />
          <p>Список товаров</p>
        </NavLink>
        <NavLink to="/orders" className="sidebar-option">
          <img className='sidebar-img' src={assets.cart} alt="" />
          <p>Список заказов</p>
        </NavLink>
        <NavLink to="/ratinglist" className="sidebar-option">
          <img className='sidebar-img' src={assets.Star} alt="" />
          <p>Список отзывов</p>
        </NavLink>
        {!selectedShop && (
          <NavLink to="/administrator" className="sidebar-option">
            <img className='sidebar-img' src={assets.add_moderator} alt="" />
            <p>Добавление модераторов</p>
          </NavLink>
        )}
        {!selectedShop && (
          <NavLink to="/userlist" className="sidebar-option">
            <img className='sidebar-img' src={assets.user_multiple} alt="" />
            <p>Список пользователей</p>
          </NavLink>
        )}
        <NavLink to="/balance" className="sidebar-option">
          <img className='sidebar-img' src={assets.balance} alt="" />
          <p>Пополнение баланса</p>
        </NavLink>
        {!selectedShop && (
          <NavLink to="/balance-update" className="sidebar-option">
            <img className='sidebar-img' src={assets.balance} alt="" />
            <p>Исправление баланса магазина</p>
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
