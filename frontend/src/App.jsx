import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom"; // Импорт компонентов маршрутизации из react-router-dom
import Navbar from "./components/Navbar/Navbar"; // Импорт компонента Navbar
/*import Home from "./pages/Home/Home";*/ // Импорт компонента Home
/*import Cart from "./pages/Cart/Cart";*/ // Импорт компонента Cart
/*import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";*/ // Импорт компонента PlaceOrder
import Question from "./pages/Question/Question"; // Импорт компонента Question
/*import Shop from "./pages/Shop/Shop";*/ // Импорт компонента Shop
/*import ShopRatings from "./pages/ShopRatings/ShopRatings"*/
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import { useContext } from "react"; // Импорт useContext
import { StoreContext } from "./components/Context/StoreContext";
/*import MyOrders from "./pages/MyOrders/MyOrders";*/
/*import FlowerInfo from "./pages/FlowerInfo/FlowerInfo";*/
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from "./components/Spinner/Spinner";

const LazzyHomePage = lazy(()=> import('./pages/Home/Home'))
const LazzyCart = lazy(()=> import('./pages/Cart/Cart'))
const LazzyPlaceOrder = lazy(()=> import('./pages/PlaceOrder/PlaceOrder'))
const LazzyShop = lazy(()=> import('./pages/Shop/Shop'))
const LazzyShopRatings = lazy(()=> import('./pages/ShopRatings/ShopRatings'))
const LazzyMyOrders = lazy(()=> import('./pages/MyOrders/MyOrders'))
const LazzyFlowerInfo = lazy(()=> import('./pages/FlowerInfo/FlowerInfo'))

const App = () => {
  const { showLogin, setShowLogin } = useContext(StoreContext); // Используем showLogin и setShowLogin из контекста

  return (
    <>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />} {/* Если showLogin true, отображаем LoginPopup */}
      <Navbar /> {/* Включение компонента Navbar */}
        <ToastContainer
          autoClose={2500}
          closeOnClick

        />
      <div className="app"> {/* Основной контейнер приложения */}
        <Suspense fallback={<Spinner />}>
          <Routes> {/* Определение маршрутов приложения */}
            <Route path="/" element={<LazzyHomePage />} /> {/* Маршрут для главной страницы */}
            <Route path="/cart" element={<LazzyCart />} /> {/* Маршрут для страницы корзины */}
            <Route path="/order" element={<LazzyPlaceOrder />} /> {/* Маршрут для страницы заказа */}
            <Route path="/question" element={<Question />} /> {/* Маршрут для страницы вопросов */}
            <Route path="/shop/:shopId" element={<LazzyShop />} /> {/* Маршрут для страницы магазина с параметром */}
            <Route path='/myorders' element={<LazzyMyOrders />} />
            <Route path='/shop/:shopId/rating' element={<LazzyShopRatings />} />
            <Route path='/flowers/:flowerId/:shopId' element={<LazzyFlowerInfo />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </>
  );
};

export default App; // Экспорт компонента App

