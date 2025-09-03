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
            <img className='sidebar-img' src={assets.shop_add} alt="" />
            <p className='option-txt'>Добавить магазин</p>
          </NavLink>
        )}
        <NavLink to="/addflower" className="sidebar-option">
          <img className='sidebar-img' src={assets.item_add} alt="" />
          <p className='option-txt'>Добавить товар</p>
        </NavLink>
        <NavLink to="/updateshop" className="sidebar-option">
          <img className='sidebar-img' src={assets.edit_icon} alt="" />
          <p className='option-txt'>Редактировать информацию о магазине</p>
        </NavLink>
        {!selectedShop && (
          <NavLink to="/shoplist" className="sidebar-option">
            <img className='sidebar-img' src={assets.shop_icon} alt="" />
            <p className='option-txt'>Список магазинов</p>
          </NavLink>
        )}
        <NavLink to="/flowerlist" className="sidebar-option">
          <img className='sidebar-img' src={assets.item_icon} alt="" />
          <p>Список товаров</p>
        </NavLink>
        <NavLink to="/orders" className="sidebar-option">
          <img className='sidebar-img' src={assets.order_icon2} alt="" />
          <p className='option-txt'>Список заказов</p>
        </NavLink>
        <NavLink to="/ratinglist" className="sidebar-option">
          <img className='sidebar-img' src={assets.review_icon} alt="" />
          <p className='option-txt'>Список отзывов</p>
        </NavLink>
        {!selectedShop && (
          <NavLink to="/administrator" className="sidebar-option">
            <img className='sidebar-img' src={assets.moderator_icon} alt="" />
            <p className='option-txt'>Добавление модераторов</p>
          </NavLink>
        )}
        {!selectedShop && (
          <NavLink to="/userlist" className="sidebar-option">
            <img className='sidebar-img' src={assets.user_icon} alt="" />
            <p className='option-txt'>Список пользователей</p>
          </NavLink>
        )}
        <NavLink to="/balance" className="sidebar-option">
          <img className='sidebar-img' src={assets.balance_icon} alt="" />
          <p className='option-txt'>Пополнение баланса</p>
        </NavLink>
        {!selectedShop && (
          <NavLink to="/balance-update" className="sidebar-option">
            <img className='sidebar-img' src={assets.balance_edit_icon} alt="" />
            <p className='option-txt'>Исправление баланса магазина</p>
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
