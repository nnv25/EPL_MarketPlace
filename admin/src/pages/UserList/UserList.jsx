import { useContext, useEffect, useState } from 'react';
import './UserList.css';
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
            const response = await axios.get(`${url}/api/user/list?page=${page}&limit=10`);
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

    const banUser = async (email, isBanned) => {
        try {
            const response = await axios.post(`${url}/api/user/ban-user`, { email: email, isBanned: isBanned });
            if (response.data.success) {
                toast.success(response.data.message);
                fetchList(currentPage); // Обновляем список на текущей странице
            } else {
                toast.error("Ошибка при блокировке пользователя");
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
            <p>Все пользователи</p>
            <div className="list-table-format-shop title">
                <b>Имя</b>
                <b>Почта</b>
                <b>Номер</b>
                <b>Количество заказов</b>
                <b>Верифицирован</b>
                <b>Дата регистрации</b>
                <b>Забанить</b>
            </div>
            {list.map((item, index) => {
                return (
                    <div key={index} className='list-table-format-shop'>
                        <p>{item.name}</p>
                        <p>{item.email}</p>
                        <p>{item.phone}</p>
                        <p>{item.numberOfOrders}</p>
                        <p>{item.isVerified ? 'Verified' : 'Not Verified'}</p>
                        <p>{item.createdAt}</p>
                        <input
                            type="checkbox"
                            checked={item.isBanned}
                            onChange={() => banUser(item.email, !item.isBanned)}
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