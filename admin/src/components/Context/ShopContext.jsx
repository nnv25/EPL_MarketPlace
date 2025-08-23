import axios from "axios";
import { createContext, useEffect, useState } from "react";

// Создаем контекст
export const ShopContext = createContext();

// Создаем провайдер
const ShopProvider = ({ children }) => {
    // Инициализация состояния selectedShop из localStorage
    const [selectedShop, setSelectedShop] = useState(() => {
        return localStorage.getItem('selectedShop') || ''; // Чтение значения из localStorage
    });
    const [shops, setShops] = useState([]);

    const [role, setRole] = useState('');  // Для хранения роли пользователя
    const [userShop, setUserShop] = useState(null);  // Для хранения информации о магазине (название и т.д.)

    // Функция для получения роли пользователя и данных магазина (если роль shop)
    const fetchUserRole = async (email) => {
        try {
            const response = await axios.post(`http://localhost:4000/api/role/auth/${email}`);
            const data = response.data;
    
            if (data.role) {
                setRole(data.role); // Устанавливаем роль пользователя
    
                // Если пользователь — владелец магазина, сохраняем данные о магазине
                if (data.role === 'shop' && data.shopId) {
                    setUserShop({
                        shopId: data.shopId,  // ID магазина
                        shopName: data.message.split('Название магазина: ')[1],  // Получаем название магазина из сообщения
                    });
    
                    // Сохраняем ID магазина как выбранный магазин
                    setSelectedShop(data.shopId);
                }
            }
        } catch (error) {
            console.error("Ошибка при получении роли пользователя:", error);
        }
    };

    // Загрузка списка магазинов при монтировании
    useEffect(() => {
        const fetchShops = async () => {
            try {
                const response = await axios.get("http://localhost:4000/api/shop/limitListBanned");
                const data = response.data;
                if (data.success) {
                    setShops(data.data);
                } else {
                    console.error("Ошибка при загрузке списка магазинов:", data.message);
                }
            } catch (error) {
                console.error("Ошибка при загрузке магазинов:", error);
            }
        };
        fetchShops();
    }, []);

    // Обновляем localStorage при изменении selectedShop
    useEffect(() => {
        if (selectedShop) {
            localStorage.setItem('selectedShop', selectedShop);
        }
    }, [selectedShop]);

    const url = "http://localhost:4000"

    const contextValue = {
        selectedShop,
        setSelectedShop,
        shops,
        url,
        role,        // Доступ к роли пользователя
        userShop,    // Доступ к информации о магазине (shopId и shopName)
        fetchUserRole,  // Функция для вызова в компонентах
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {children}
        </ShopContext.Provider>
    );
};

export default ShopProvider;