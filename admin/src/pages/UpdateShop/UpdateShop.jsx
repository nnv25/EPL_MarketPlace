import './UpdateShop.css';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { ShopContext } from '../../components/Context/ShopContext';
import { toast } from 'react-toastify';
import InputMask from 'react-input-mask';

const UpdateShop = () => {
  const { url, selectedShop, shops } = useContext(ShopContext);
  const [shopData, setShopData] = useState({
    name: '',
    work_time: { weekdays: '', saturday: '', sunday: '' },
    address: '',
    phone: '',
    delivery: false,
    /*delivery_price: '',*/
    payment_form: '',
    image: ''
  });

  useEffect(() => {
    if (selectedShop) {
      const shop = shops.find(shop => shop._id === selectedShop);
      if (shop) {
        setShopData({
          name: shop.name || '',
          work_time: shop.work_time || { weekdays: '', saturday: '', sunday: '' },
          address: shop.address || '',
          phone: shop.phone || '',
          delivery: shop.delivery || false,
          /*delivery_price: shop.delivery_price || '',*/
          payment_form: shop.payment_form || '',
          image: shop.image || ''
        });
      }
    }
  }, [selectedShop, shops]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setShopData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleWorkTimeChange = (e) => {
    const { name, value } = e.target;
    setShopData(prevData => ({
      ...prevData,
      work_time: {
        ...prevData.work_time,
        [name]: value,
      },
    }));
  };

  const handleFileChange = (e) => {
    setShopData(prevData => ({
      ...prevData,
      image: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const workTimeRegex = /^(\d{2}:\d{2}-\d{2}:\d{2}|выходной)$/;
  
    // Проверка обязательных полей
    if (!shopData.name.trim()) {
      toast.error('Название магазина не может быть пустым');
      return;
    }
  
    if (!shopData.work_time.weekdays.trim() || !shopData.work_time.saturday.trim() || !shopData.work_time.sunday.trim()) {
      toast.error('Часы работы не могут быть пустыми');
      return;
    }
  
    if (!shopData.address.trim()) {
      toast.error('Адрес не может быть пустым');
      return;
    }
  
    /*if (shopData.delivery && (!shopData.delivery_price || shopData.delivery_price <= 0)) {
      toast.error('Цена доставки должна быть положительным числом');
      return;
    }*/
  
    if (!shopData.payment_form.trim()) {
      toast.error('Форма оплаты не может быть пустой');
      return;
    }

    const invalidWorkTime = Object.values(shopData.work_time).some(time => !workTimeRegex.test(time));
    if (invalidWorkTime) {
      toast.error("Неверный формат времени. Используйте следующий формат '10:00-19:00' или 'выходной'");
      return;
    }
  
    // Отправка данных на сервер
    try {
      const formData = new FormData();
      formData.append('id', selectedShop);
      for (const key in shopData) {
        if (key === 'image' && shopData[key]) {
          formData.append('image', shopData[key]);
        } else if (key === 'work_time') {
          formData.append('work_time.weekdays', shopData.work_time.weekdays);
          formData.append('work_time.saturday', shopData.work_time.saturday);
          formData.append('work_time.sunday', shopData.work_time.sunday);
        } else {
          const value = key === 'delivery' ? shopData[key].toString() : shopData[key];
          formData.append(key, value);
        }
      }
  
      const response = await axios.put(`${url}/api/shop/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      if (response.data.success) {
        toast.success('Магазин успешно обновлен');
      } else {
        toast.error('Ошибка при обновлении магазина');
      }
    } catch (error) {
      console.error('Ошибка при обновлении магазина:', error);
      toast.error('Произошла ошибка при обновлении магазина');
    }
  };

  return (
    <div className="shop-details">
      {selectedShop ? (
        <form onSubmit={handleSubmit} className="shop-details-form">
          <div className="form-group">
            <label className='shop-update-text'>1.Название магазина</label>
            <input
              type="text"
              name="name"
              value={shopData.name}
              onChange={handleChange}
              readOnly
            />
            <p className='details-text'>Данный пункт может быть отредактирован только при обращении в службу поддержки приложения</p>
          </div>

          <div className="form-group">
            <label className='shop-update-text'>2.Часы работы</label>
            <div className='work-time-block'>
              <input
                type="text"
                name="weekdays"
                value={shopData.work_time.weekdays}
                onChange={handleWorkTimeChange}
                placeholder="Будние дни"
              />
              <input
                type="text"
                name="saturday"
                value={shopData.work_time.saturday}
                onChange={handleWorkTimeChange}
                placeholder="Суббота"
              />
              <input
                type="text"
                name="sunday"
                value={shopData.work_time.sunday}
                onChange={handleWorkTimeChange}
                placeholder="Воскресенье"
              />
            </div>
          </div>

          <div className="form-group">
            <label className='shop-update-text'>3.Адрес</label>
            <input
              type="text"
              name="address"
              value={shopData.address}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className='shop-update-text'>4.Телефон</label>
            <InputMask
              type="tel"
              name="phone"
              value={shopData.phone}
              onChange={handleChange}
              mask="+7(999)999-99-99"
          />
          </div>
          <div className="form-group">
            <label className='shop-update-text'>5.Доставка</label>
            <select
              name="delivery"
              value={shopData.delivery}
              onChange={handleChange}
            >
              <option value={false}>Нет</option>
              <option value={true}>Да</option>
            </select>
          </div>

          {/*shopData.delivery && (
            <div className="form-group">
              <label className='shop-update-text'>6.Цена доставки</label>
              <input
                type="number"
                name="delivery_price"
                value={shopData.delivery_price}
                onChange={handleChange}
              />
            </div>
          )*/}

          <div className="form-group">
            <label className='shop-update-text'>6.Форма оплаты</label>
            <input
              type="text"
              name="payment_form"
              value={shopData.payment_form}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className='shop-update-text'>7.Логотип магазина</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <button type="submit" className="btn save-btn">
            Сохранить изменения
          </button>
          <p className='details-text'>Для того, чтобы изменения вступили в силу, после их сохранения и отобразились на текущей странице, необходимо перезагрузить страницу</p>
        </form>
      ) : (
        <p>Выберите магазин из списка</p>
      )}
    </div>
  );
};

export default UpdateShop;