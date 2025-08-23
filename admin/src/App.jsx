import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import ShopProvider from './components/Context/ShopContext';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AddShop from './pages/AddShop/AddShop';
import AddFlower from './pages/AddFlower/AddFlower';
import UpdateShop from './pages/UpdateShop/UpdateShop';
import FlowerList from './pages/FlowerList/FlowerList';
import Orders from './pages/Orders/Orders';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShopList from './pages/ShopList/ShopList';
import Login from './pages/Login/Login';
import ProtectedRoute from './components/ProtectedRoute'; // Импортируем компонент для защиты маршрутов
import Administrator from './pages/Administrator/Administrator';
import UserList from './pages/UserList/UserList';
import RatingList from './pages/RatingList/RatingList';
import Balance from './pages/Balance/Balance';
import BalanceUpdate from './pages/BalanceUpdate/BalanceUpdate';
import EditFlower from './pages/EditFlower/EditFlower';
import OrderDetails from './components/OrderDetails/OrderDetails';
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Проверяем наличие токена при загрузке
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/'); // Перенаправляем на страницу логина
  };

  return (
    <ShopProvider>
      <ToastContainer />
      <Navbar onLogout={handleLogout} />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          {/* Открытый маршрут для входа */}
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          
          {/* Защищённые маршруты */}
          <Route 
            path="/addshop" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AddShop />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/addflower" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AddFlower />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/updateshop" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <UpdateShop />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/shoplist" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ShopList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/flowerlist" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <FlowerList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Orders />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ratinglist" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <RatingList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/administrator" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Administrator />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/userlist" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <UserList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/balance" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Balance />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/balance-update" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <BalanceUpdate />
              </ProtectedRoute>
            } 
          />
        <Route path="/flowerlist/:flowerId"
          element={<EditFlower />}
        />
        <Route path="/order-details/:orderId" 
          element={<OrderDetails/>} 
        />
      </Routes>
      </div>
    </ShopProvider>
  );
};

export default App;
