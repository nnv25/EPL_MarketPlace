import { useContext, useEffect, useState } from 'react';
import './ShopList.css';
import axios from "axios";
import { ShopContext } from '../../components/Context/ShopContext';
import { toast } from 'react-toastify';
import PageSelector from '../../components/PageSelector/PageSelector';

const ShopList = () => {
    const { url } = useContext(ShopContext);
    const [list, setList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Текущая страница
    const [totalPages, setTotalPages] = useState(0); // Общее количество страниц

    const fetchList = async (page = 1) => {
        try {
            const response = await axios.get(`${url}/api/shop/limitListBanned?page=${page}&limit=10`);
            if (response.data.success) {
                setList(response.data.data);
                setTotalPages(response.data.totalPages); // Устанавливаем общее количество страниц
            } else {
                toast.error("Ошибка при загрузке магазинов");
            }
        } catch (error) {
            toast.error("Ошибка при загрузке магазинов");
            console.error("Ошибка при загрузке магазинов:", error);
        }
    };

    const removeShop = async (shopId) => {
        try {
            const response = await axios.post(`${url}/api/shop/remove`, { id: shopId });
            if (response.data.success) {
                toast.success(response.data.message);
                fetchList(currentPage); // Обновляем список на текущей странице
            } else {
                toast.error("Ошибка при удалении магазина");
            }
        } catch (error) {
            toast.error("Ошибка при удалении магазина");
            console.error("Ошибка при удалении магазина:", error);
        }
    };

    const banShop = async (shopId, isBanned) => {
        try {
            const response = await axios.post(`${url}/api/shop/ban-shop`, { id: shopId, isBanned: isBanned });
            if (response.data.success) {
                toast.success(response.data.message);
                fetchList(currentPage); // Обновляем список на текущей странице
            } else {
                toast.error("Ошибка при блокировке магазина");
            }
        } catch (error) {
            toast.error("Ошибка при блокировке магазина");
            console.error("Ошибка при блокировке магазина:", error);
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        fetchList(newPage); // Загружаем магазины для новой страницы
    };

    useEffect(() => {
        fetchList(currentPage);
    }, [currentPage]);

    return (
        <div className='list add flex-col'>
            <p>Все магазины</p>
            <div className="list-table-format-shop title">
                <b>Логотип</b>
                <b>Название</b>
                {/*<b>Рабочее время</b>*/}
                <b>Адрес</b>
                <b>Цена за доставку</b>
                <b>Форма оплаты</b>
                <b>Удалить</b>
                <b>Забанить</b>
            </div>
            {list.map((item, index) => {
                return (
                    <div key={index} className='list-table-format-shop'>
                        <img src={`${url}/images/` + item.image} alt="" />
                        <p>{item.name}</p>
                        {/*<p>{item.work_time}</p>*/}
                        <p>{item.address}</p>
                        <p>{item.delivery_price}</p>
                        <p>{item.payment_form}</p>
                        <p onClick={() => removeShop(item._id)} className='cursor'>X</p>
                        <input className='shop-input'
                            type="checkbox"
                            checked={item.isBanned}
                            onChange={() => banShop(item._id, !item.isBanned)}
                        />
                    </div>
                );
            })}
            <PageSelector 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default ShopList;

