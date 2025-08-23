import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import { ShopContext } from '../../components/Context/ShopContext';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { fetchUserRole, role, userShop } = useContext(ShopContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:4000/api/role/login', {
                email,
                password,
            });

            localStorage.setItem('token', response.data.token);

            if (response.data.isBanned) {
                alert('Ваш магазин заблокирован');
                return; // Stop further actions if the shop is banned
            }

            await fetchUserRole(email);
            console.log(role)
            if (role === 'admin' || role === 'superadmin') {
                console.log('Пользователь - Администратор');
            } else if (role === 'shop' && userShop) {
                console.log(`Пользователь - Владелец магазина. Название магазина: ${userShop.shopName}`);
            }

            onLogin();
            role === 'admin' ? navigate('/shoplist') : navigate('/flowerlist');
        } catch (error) {
            // Show error message from backend if login fails
            if (error.response && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                console.error('Ошибка входа:', error);
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Вход</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Войти</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
