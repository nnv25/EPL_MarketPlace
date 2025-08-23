import { useContext, useState } from "react"; // Импорт хука useState
import { assets } from "../../assets/assets_flowers"; // Импорт ресурсов
import "./Navbar.css"; // Импорт стилей
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../Context/StoreContext";

const Navbar = () => {
  const [menu, setMenu] = useState("Главная"); // Состояние для текущего меню

  const {getTotalCartAmount, token, setToken, setShowLogin } = useContext(StoreContext)

  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/")
  }

  return (
    <div className="navbar">
      <div className="navbar_top">
        <div className="navbar_top__left">
          <Link to='/'><img src={assets.logo_epl} alt="Логотип" className="logo" /></Link>
        </div>
        <div className="navbar_top__right">
          <div className="navbar-search-icon">
            <Link to='/cart'><img className="basket-icon" src={assets.basket_icon1} alt="Корзина" /></Link>
            <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
          </div>
          <div className="navbar-top__login">
            {!token ? <div className="login_block"><button className="login-btn" onClick={() => setShowLogin(true)}>ВОЙТИ</button> <img className="login-icon" src={assets.login_icon} alt="" /> </div>
            : <div className="navbar-profile">
              <img src={assets.profile_icon} alt="" />
              <ul className="nav-profile-dropdown">
                <li onClick={() => navigate('/myorders')}><img src={assets.bag_icon} alt="" /><p>Заказы</p></li>
                <hr />
                <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Выйти</p></li>
              </ul>
            </div>}
          </div>
        </div>
      </div> 
    </div>
  );
};

export default Navbar; // Экспорт компонента
