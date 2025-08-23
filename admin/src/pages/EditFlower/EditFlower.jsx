import './EditFlower.css';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { assets } from '../../assets/assets';
import { ShopContext } from '../../components/Context/ShopContext';
import { toast } from 'react-toastify';
import InputMask from 'react-input-mask';
import { useParams, Link } from 'react-router-dom';
import imageCompression from 'browser-image-compression';

const EditFlower = () => {
  const { url, selectedShop, shops } = useContext(ShopContext);
  const { flowerId } = useParams();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [flowerData, setflowerData] = useState({
    name: '',
    description: '',
    price: '',
    date: '',
  });

  const fetchList = async () => {
    try {
        const flower = await axios.get(`${url}/api/flower/flowers/${flowerId}/${selectedShop}`);
        if (flower.data.success) {
          // Convert the MongoDB date to local date format
          const originalDate = flower.data.data.date 
            ? new Date(flower.data.data.date).toISOString().split('T')[0] 
            : '';
          
          setflowerData({
            name: flower.data.data.name || '',
            description: flower.data.data.description || '',
            price: flower.data.data.price || '',
            date: originalDate || ''
          });
          
          // Check if images exist and are in an array or single string
          const imageData = flower.data.data.images;
          const images = Array.isArray(imageData) 
            ? imageData 
            : (imageData ? [imageData] : []);
          
          // Store existing image filenames 
          setExistingImages(images);
          
          // Reset uploaded files
          setUploadedFiles([]);
        } else {
            toast.error("Ошибка при загрузке магазинов");
        }
    } catch (error) {
        toast.error("Ошибка при загрузке магазинов");
        console.error("Ошибка при загрузке магазинов:", error);
    }
  };

  useEffect(() => {
    fetchList();
  }, [flowerId, selectedShop]);

  const currentDate = new Date();
  const date = currentDate.setDate(currentDate.getDate());
  const defaultValue = new Date(date).toISOString().split('T')[0];

  // Функция для удаления файла по индексу
  const handleRemoveFile = (index, isExisting = false) => {
    if (isExisting) {
      // Remove from existing images
      const updatedExistingImages = existingImages.filter((_, i) => i !== index);
      setExistingImages(updatedExistingImages);
    } else {
      // Remove from newly uploaded files
      const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
      setUploadedFiles(updatedFiles);
    }
  };

  const handleFileChange = async (event) => {
    const newFiles = Array.from(event.target.files);
    const compressedFiles = await Promise.all(newFiles.map(async (file) => {
      if (file.size > 2 * 1024 * 1024) {
        return await imageCompression(file, { maxSizeMB: 2, maxWidthOrHeight: 1600 });
      }
      return file;
    }));
    
    // Combine existing images, newly uploaded files, and new compressed files
    const totalFiles = [...existingImages, ...uploadedFiles, ...compressedFiles];
    if (totalFiles.length > 3) {
      alert('Можно загрузить не более трех изображений');
      return;
    }
    
    // Separate existing images and new files
    setExistingImages(totalFiles.filter(file => typeof file === 'string'));
    setUploadedFiles(totalFiles.filter(file => typeof file !== 'string'));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setflowerData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Проверка на заполненность полей
    if (!flowerData.name.trim() || !flowerData.description.trim()) {
      toast.error("Все поля должны быть заполнены.");
      return;
    }
  
    // Проверка на наличие хотя бы одного изображения
    if (!existingImages.length && !uploadedFiles.length) {
      toast.error("Добавьте хотя бы одну фотографию.");
      return;
    }
  
    if (!selectedShop) {
      alert('Пожалуйста, выберите магазин.');
      return;
    }
  
    const formData = new FormData();
    formData.append("name", flowerData.name);
    formData.append("description", flowerData.description);
    formData.append("price", flowerData.price);
  
    // Используем defaultValue для даты
    const mongoDBDateFormat = new Date(defaultValue).toISOString();
    formData.append("date", mongoDBDateFormat);
    formData.append("shopId", selectedShop);
  
    // Добавляем существующие изображения
    if (existingImages && existingImages.length > 0) {
      existingImages.forEach((imageName) => {
        formData.append("existingImages", imageName);
      });
    }
  
    // Добавляем новые файлы
    if (uploadedFiles && uploadedFiles.length > 0) {
      uploadedFiles.forEach((file) => {
        formData.append("images", file);
      });
    }
  
    try {
      const response = await axios.put(`${url}/api/flower/flowers/${flowerId}/${selectedShop}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Ошибка при отправке данных:", error);
      alert("Произошла ошибка при добавлении цветка.");
    }
  };

  return (
    <div className="shop-details">
      <form onSubmit={handleSubmit} className="shop-details-form">
        <div className="form-group">
          <label className='shop-update-text'>1. Редактировать название </label>
          <input
            type="text"
            name="name"
            value={flowerData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className='shop-update-text'>2. Редактировать описание</label>
          <input
            type="text"
            name="description"
            value={flowerData.description}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className='shop-update-text'>3. Редактировать цену</label>
          <InputMask
            type="number"
            name="price"
            value={flowerData.price}
            onChange={handleChange}
          />
        </div>
        <div className="add-img-upload flex-col">
          <p className='add-text'>5.Изменить фото</p>
          <label htmlFor="image">
            <img src={assets.upload_area} alt="" />
          </label>
          <input type="file" id='image' hidden onChange={handleFileChange} multiple />
        </div>
        <div className="uploaded-images">
          {/* Existing images */}
          {existingImages && existingImages.map((filename, index) => (
            <div key={`existing-${index}`} className="uploaded-image-container" style={{ position: "relative", display: "inline-block", margin: "10px" }}>
              <img 
                src={`${url}/flower-images/${filename}`} 
                alt={`Existing ${index + 1}`} 
                className="uploaded-image" 
                style={{ maxWidth: '200px', maxHeight: '200px' }} 
              />
              <span 
                className="remove-image" 
                onClick={() => handleRemoveFile(index, true)}
              >
                ×
              </span>
            </div>
          ))}

          {/* Newly uploaded files */}
          {uploadedFiles && uploadedFiles.map((file, index) => (
            <div key={`new-${index}`} className="uploaded-image-container" style={{ position: "relative", display: "inline-block", margin: "10px" }}>
              <img 
                src={URL.createObjectURL(file)} 
                alt={`Uploaded ${index + 1}`} 
                className="uploaded-image" 
                style={{ maxWidth: '200px', maxHeight: '200px' }} 
              />
              <span 
                className="remove-image" 
                onClick={() => handleRemoveFile(index)}
              >
                ×
              </span>
            </div>
          ))}
        </div>

        <button type="submit" className="btn save-btn">
          Сохранить изменения
        </button>
        <p className='details-text'>Для того, чтобы изменения вступили в силу, после их сохранения и отобразились на текущей странице, необходимо перезагрузить страницу</p>
      </form>
    </div>
  );
};

export default EditFlower;