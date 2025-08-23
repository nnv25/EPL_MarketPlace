import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; 
export const StoreContext = createContext(null)
import { toast } from 'react-toastify';

const StoreContextProvider = (props) => {
    const { shopId } = useParams();
    const [cartItems, setCartItems] = useState({});
    const url = "http://localhost:4000";
    const [token,setToken] = useState("");
    const [email, setEmail] = useState();
    const [otp, setOTP] = useState();
    const [showLogin, setShowLogin] = useState(false);
    const [limited_shop_list, setLimitedShopList] = useState([]);
    const [limited_banned_shop_list, setLimitedBannedShopList] = useState([]);
    const [limited_flowers_list, setLimitedFlowersList] = useState([]);
    const [flowers_list, setFlowersList] = useState([]);
    const [pagination, setPagination] = useState({});
    const [flowerPagination, setFlowerPagination] = useState({});
    const [totalRatings, setTotalRatings] = useState(0);
    const [listRatings, setRatingsList] = useState([]);
    const [listflowersbyid, setListFlowersById] = useState({ images: [] });
    const [averageRating, setAverageRating] = useState(0);

    const addToCart = async (itemId) => {
        if(!cartItems[itemId]) {
            setCartItems((prev)=>({...prev,[itemId]:1}));
            toast.success("Товар добавлен в корзину!",{
                closeOnClick: true,
                position: "top-right",
            });
        }
        else {
            setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}));
            toast.success("Товар добавлен в корзину!");
        }
        if(token) {
            await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})

        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
        if(token) {
            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}});
            toast.warning("Товар убран из корзины!");
        }
    }

    const clearCart = () => {
        setCartItems({});
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        if (flowers_list.length > 0) { // Проверяем, что список цветов не пуст
            for (const item in cartItems) {
                if (cartItems[item] > 0) {
                    let itemInfo = flowers_list.find((product) => product._id === item);
                    if (itemInfo) { // Проверка на существование товара
                        totalAmount += itemInfo.price * cartItems[item];
                    } else {
                        console.error(`Товар с id ${item} не найден в flowers_list`);
                    }
                }
            }
        }
        return totalAmount;
    };

    const fetchFlowersListWithPagination = async (shopId, page = 1) => {
        try {
            const response = await axios.get(`${url}/api/flower/limitlist/${shopId}?page=${page}&limit=10`); // Динамически вставляем shopId и страницу
            if (response.data.success) {
                setLimitedFlowersList(response.data.data); // Устанавливаем полученные данные
                setFlowerPagination(response.data.pagination); // Устанавливаем данные пагинации
            } else {
                console.error("Ошибка при получении списка цветов:", response.data.message);
            }
        } catch (error) {
            console.error("Ошибка при получении списка цветов:", error);
        }
    };

    const fetchFlowersById = async (flowerId,shopId) => {
        try {
            const response = await axios.get(`${url}/api/flower/flowers/${flowerId}/${shopId}`); // Динамически вставляем shopId и страницу
            if (response.data.success) {
                setListFlowersById(response.data.data);
                console.log(response.data.data)
            } else {
                console.error("Ошибка при получении списка цветов:", response.data.message);
            }
        } catch (error) {
            console.error("Ошибка при получении списка цветов:", error);
        }
    };
    const fetchBannedShopList = async (page = 1, limit) => {
        try {
            const response = await axios.get(`${url}/api/shop/limitlistBanned?page=${page}&limit=${limit}`);
            if (response.data.success) {
                setLimitedBannedShopList(response.data.data); // Set sorted list
            } else {
                console.error("Ошибка при получении списка магазинов:", response.data.message);
            }
        } catch (error) {
            console.error("Ошибка при получении списка магазинов:", error);
        }
    };

    const fetchShopListWithPagination = async (page = 1, limit) => {
        try {
            const response = await axios.get(`${url}/api/shop/limitlist?page=${page}&limit=${limit}`);
            if (response.data.success) {
                // Sort by numberOfOrders first (highest to lowest) and then by averageRating (highest to lowest)
                const sortedShops = response.data.data.sort((a, b) => {
                    if (b.numberOfOrders === a.numberOfOrders) {
                        return b.averageRating - a.averageRating;
                    }
                    return b.numberOfOrders - a.numberOfOrders;
                });
    
                setLimitedShopList(sortedShops); // Set sorted list
                setPagination(response.data.pagination); // Set pagination data
            } else {
                console.error("Ошибка при получении списка магазинов:", response.data.message);
            }
        } catch (error) {
            console.error("Ошибка при получении списка магазинов:", error);
        }
    };
    

    const fetchFlowersList = async (shopId) => {
        try {
            const response = await axios.get(`${url}/api/flower/limitlist/${shopId}`); // Динамически вставляем shopId в URL
            if (response.data.success) {
                setFlowersList(response.data.data); // Устанавливаем полученные данные в состояние
            } else {
                console.error("Ошибка при получении списка цветов:", response.data.message);
            }
        } catch (error) {
            console.error("Ошибка при получении списка цветов:", error);
        }
    };

    const fetchRatingsList = async (shopId, page = 1, limit = 10) => {
        try {
          const response = await axios.get(`${url}/api/rating/limitList/${shopId}?page=${page}&limit=${limit}`);
          if (response.data.success) {
            setRatingsList(response.data.data);
            setTotalRatings(response.data.pagination.totalRatings);
          } else {
            console.error("Ошибка при загрузке цветов: " + response.data.message);
          }
        } catch (error) {
          console.error("Ошибка при загрузке цветов:", error);
        }
    };

    const fetchAverageRating = async (shopId) => {
        try {
          const response = await fetch(`${url}/api/rating/average/${shopId}`);
          const data = await response.json();
          if (response.ok) {
            setAverageRating(data.averageRating); // Устанавливаем средний рейтинг
          } else {
            console.error('Ошибка при получении рейтинга:', data.message);
          }
        } catch (error) {
          console.error('Ошибка при получении рейтинга:', error);
        }
    };
    const getShopNameById = (shopId) => {
        const shop = limited_shop_list.find(shop => shop._id === shopId);
        return shop ? shop.name : "Магазин не найден"; // Если магазин найден, возвращаем его имя, иначе — сообщение
    };

    const getShopById = (shopId) => {
        return limited_banned_shop_list.find(shop => shop._id === shopId);
      };

    const loadCartData = async(token) => {
        const response = await axios.post(url+"/api/cart/get",{},{headers:{token}});
        setCartItems(response.data.cartData);
    }

    useEffect(()=>{
        async function loadData() {
            await fetchShopListWithPagination(1);
            await fetchBannedShopList(1)
            if(localStorage.getItem("token")){
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    },[])

    useEffect(() => {
        if (shopId) {
            fetchFlowersList;  // Передаем shopId в функцию
            fetchShopListWithPagination;
            fetchBannedShopList;
        }
    }, [shopId]);
    
    const contextValue = {
        limited_shop_list,
        limited_flowers_list,
        flowers_list,
        cartItems,
        setCartItems,
        listRatings,
        setRatingsList,
        totalRatings,
        setTotalRatings,
        fetchRatingsList,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        otp,
        setOTP,
        setEmail,
        email,
        showLogin,
        setShowLogin,
        fetchFlowersList,
        getShopNameById,
        getShopById,
        fetchShopListWithPagination,
        pagination,
        fetchFlowersListWithPagination,
        flowerPagination,
        clearCart,
        fetchAverageRating,
        averageRating,
        fetchFlowersById,
        listflowersbyid,
    }

    return(
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider