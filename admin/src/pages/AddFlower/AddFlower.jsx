import { useContext, useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import './AddFlower.css';
import { ShopContext } from '../../components/Context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';

const AddFlower = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const { selectedShop, shops } = useContext(ShopContext);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    shop: selectedShop
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  useEffect(() => {
    setData(prevData => ({ ...prevData, shop: selectedShop })); // Update shop when selectedShop changes
  }, [selectedShop]);

  // Функция для обработки выбранных файлов
  /*const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    const totalFiles = [...uploadedFiles, ...newFiles];
    
    if (totalFiles.length > 3) {
      alert('Можно загрузить не более трех изображений');
      return;
    }
    setUploadedFiles(totalFiles);
  };*/
  const handleFileChange = async (event) => {
    const newFiles = Array.from(event.target.files);
    const compressedFiles = await Promise.all(newFiles.map(async (file) => {
      if (file.size > 2 * 1024 * 1024) {
        return await imageCompression(file, { maxSizeMB: 2, maxWidthOrHeight: 1600 });
      }
      return file;
    }));
    
    const totalFiles = [...uploadedFiles, ...compressedFiles];
    if (totalFiles.length > 3) {
      alert('Можно загрузить не более трех изображений');
      return;
    }
    setUploadedFiles(totalFiles);
  };

  // Функция для удаления файла по индексу
  const handleRemoveFile = (index) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);
  };

  const selectedShopName = shops.find(shop => shop._id === selectedShop)?.name;

  // Функция для отправки данных на сервер
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!selectedShop) {
      alert('Пожалуйста, выберите магазин.');
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("shopId", selectedShop);

    // Добавляем файлы в FormData
    uploadedFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await axios.post("http://localhost:4000/api/flower/add", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.data.success) {
        // Очистить форму или сделать что-то еще после успешного добавления
        setUploadedFiles([]);
        setData({
          name: "",
          description: "",
          price: "",
          shop: selectedShop
        });
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Ошибка при отправке данных:", error);
      alert("Произошла ошибка при добавлении цветка.");
    }
  };

  return (
    <div className='add'>
      <form className='flex-col' onSubmit={handleSubmit}>
        <div className="add-img-upload flex-col">
          <p className='add-text'>Добавить фото</p>
          <label htmlFor="image">
            <img src={assets.upload_area} alt="" />
          </label>
          <input type="file" id='image' hidden required onChange={handleFileChange} multiple />
        </div>
        <div className="uploaded-images">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="uploaded-image-container" style={{ position: "relative", display: "inline-block", margin: "10px" }}>
              <img src={URL.createObjectURL(file)} alt={`Uploaded ${index + 1}`} className="uploaded-image" />
              <span 
                className="remove-image" 
                onClick={() => handleRemoveFile(index)}
              >
                ×
              </span>
            </div>
          ))}
        </div>
        <div className="add-product-name flex-col">
          <p className='add-text'>Наименование товара</p>
          <input className='input-product' onChange={onChangeHandler} value={data.name} maxLength="40" type="text" name='name' placeholder="Введите наименование товара" required />
        </div>
        <div className="add-product-description flex-col">
          <p className='add-text'>Описание товара</p>
          <textarea className='input-product' onChange={onChangeHandler} value={data.description} maxLength="200" name="description" rows="6" placeholder="Введите описание товара" required></textarea>
        </div>
        <div className="add-shop">
          <div className="add-category flex-col">
            <p className='add-text'>Наименование магазина</p>
            <p className='add-text'>{selectedShopName ? `Выбранный магазин: ${selectedShopName}` : 'Выберите магазин в навбаре'}</p>
          </div>
        </div>
        <div className="add-price flex-col">
          <p className='add-text'>Цена товара</p>
          <input className='input-product' type="number" onChange={onChangeHandler} value={data.price} name="price" placeholder='Введите цену товара' required />
        </div>
        <button type='submit' className='add-btn'>Добавить</button>
      </form>
    </div>
  );
}

export default AddFlower;