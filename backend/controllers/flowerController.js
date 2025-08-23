import flowerModel from "../models/flowerModel.js";
import shopModel from "../models/shopModel.js";
import fs from "fs";
import mongoose from "mongoose";
import path from "path";

//add Flower
const addFlower = async (req, res) => {
    try {
        // Проверяем наличие файлов изображений
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: "Минимум одно фото цветка обязательно для загрузки" });
        }

        // Извлекаем имена файлов изображений
        const image_filenames = req.files.map(file => file.filename);

        // Проверяем, что было загружено не более трех изображений
        if (image_filenames.length > 3) {
            // Удаляем загруженные файлы, если их больше трех
            image_filenames.forEach(filename => fs.unlinkSync(`uploadsFlower/${filename}`));
            return res.status(400).json({ success: false, message: "Можно загрузить не более трех изображений" });
        }

        const flowerData = {
            name: req.body.name,
            description: req.body.description,
            price: parseFloat(req.body.price),
            images: image_filenames, // Поле переименовано в "images"
            shop: req.body.shopId
        };

        // Проверяем существование магазина с указанным ID
        const shop = await shopModel.findById(flowerData.shop);
        if (!shop) {
            // Удаляем загруженные файлы, если магазин не найден
            image_filenames.forEach(filename => fs.unlinkSync(`uploadsFlower/${filename}`));
            return res.status(404).json({ success: false, message: "Магазин не найден" });
        }

        // Создаем новый цветок
        const flower = new flowerModel(flowerData);

        // Сохраняем цветок в базе данных
        await flower.save();
        await shopModel.findByIdAndUpdate(req.body.shopId, { $inc: { numFlowers: 1 } });

        // Возвращаем успешный ответ
        res.json({ success: true, message: "Цветок успешно добавлен в магазин", flower });
    } catch (error) {
        console.error("Ошибка при добавлении цветка:", error);
        res.status(500).json({ success: false, message: "Произошла ошибка при добавлении цветка" });
    }
};

//all flower in this shop
/*const listFlower = async (req, res) => {
    try {
        const flowers = await flowerModel.find({ shop: req.params.shopId }); // Фильтруем по shopId
        res.json({ success: true, data: flowers });
    } catch (error) {
        console.error("Ошибка при получении списка цветов:", error);
        res.status(500).json({ success: false, message: "Произошла ошибка при получении списка цветов" });
    }
};*/


//пагинация 
const listFlowersWithPagination = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Получаем номер страницы из параметров запроса, если не указан, то по умолчанию 1
        const limit = parseInt(req.query.limit) // Получаем количество элементов на странице, по умолчанию 10
        const skip = (page - 1) * limit; // Количество пропущенных элементов

        // Получаем общее количество цветов в магазине
        const totalFlowers = await flowerModel.countDocuments({ shop: req.params.shopId });
        // Получаем цветы с учетом пагинации
        const flowers = await flowerModel
            .find({ shop: req.params.shopId })
            .skip(skip)
            .limit(limit)
            .sort({date:-1})
        // Отправляем ответ с данными и информацией о пагинации
        await shopModel.findByIdAndUpdate(req.params.shopId, { numFlowers: totalFlowers });
        res.json({
            success: true,
            data: flowers,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalFlowers / limit)||1,
                totalFlowers: totalFlowers,
            },
        });
    } catch (error) {
        console.error("Ошибка при получении списка цветов с пагинацией:", error);
        res.status(500).json({ success: false, message: "Произошла ошибка при получении списка цветов" });
    }
};

//flower
const getFlowerById = async (req, res) => {
    try {
        const { id: flowerId, shopId } = req.params; // Получаем ID цветка и ID магазина из параметров запроса

        // Проверяем корректность ID цветка и магазина
        if (!mongoose.Types.ObjectId.isValid(flowerId) || !mongoose.Types.ObjectId.isValid(shopId)) {
            return res.status(400).json({ success: false, message: "Неверный формат идентификатора" });
        }

        // Проверяем, существует ли магазин
        const shopExists = await shopModel.findById(shopId);
        if (!shopExists) {
            return res.status(404).json({ success: false, message: "Магазин не найден" });
        }

        // Проверяем, существует ли цветок
        const flower = await flowerModel.findById(flowerId);
        if (!flower) {
            return res.status(404).json({ success: false, message: "Цветок не найден" });
        }

        // Проверяем, принадлежит ли цветок указанному магазину
        if (flower.shop.toString() !== shopId) {
            return res.status(404).json({ success: false, message: "Цветок не принадлежит указанному магазину" });
        }

        // Если все проверки прошли, возвращаем данные цветка
        res.json({ success: true, data: flower });
    } catch (error) {
        console.error("Ошибка при получении цветка:", error);
        res.status(500).json({ success: false, message: "Произошла ошибка" });
    }
};

//remove flowers
const removeFlower = async (req, res) => {
    try {
        const { id: flowerId, shopId } = req.params; // Получаем ID цветка и ID магазина из параметров запроса

        // Проверяем корректность ID цветка и магазина
        if (!mongoose.Types.ObjectId.isValid(flowerId) || !mongoose.Types.ObjectId.isValid(shopId)) {
            return res.status(400).json({ success: false, message: "Неверный формат идентификатора" });
        }

        // Находим цветок и проверяем, что он принадлежит указанному магазину
        const flower = await flowerModel.findOne({ _id: flowerId, shop: shopId });
        if (!flower) {
            return res.status(404).json({ success: false, message: "Цветок не найден или не принадлежит указанному магазину" });
        }

        // Удаление файлов изображений
        flower.images.forEach(imageFilename => {
            const filePath = path.join("uploadsFlower", imageFilename);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Ошибка при удалении файла ${imageFilename}:`, err);
                }
            });
        });

        // Удаление цветка из базы данных
        await flowerModel.findByIdAndDelete(flowerId);
        await shopModel.findByIdAndUpdate(req.body.shopId, { $inc: { numFlowers: -1 } });
        res.json({ success: true, message: "Цветок и его изображения успешно удалены" });
    } catch (error) {
        console.error("Ошибка при удалении цветка:", error);
        res.status(500).json({ success: false, message: "Произошла ошибка при удалении цветка" });
    }
};

//update
const updateFlower = async (req, res) => {
    try {
       const { id: flowerId, shopId } = req.params;
       if (!mongoose.Types.ObjectId.isValid(flowerId) || !mongoose.Types.ObjectId.isValid(shopId)) {
           return res.status(400).json({ success: false, message: "Неверный формат идентификатора" });
       }
   
       const flower = await flowerModel.findOne({ _id: flowerId, shop: shopId });
       if (!flower) {
           return res.status(404).json({ success: false, message: "Цветок не найден или не принадлежит указанному магазину" });
       }
   
       // Current images
       let image_filenames = flower.images || [];
   
       // Existing images from the request (if any)
       const existingImagesFromRequest = req.body.existingImages 
           ? (Array.isArray(req.body.existingImages) 
               ? req.body.existingImages 
               : [req.body.existingImages])
           : [];
   
       // Identify images to remove (images in the current flower that are not in the request)
       const imagesToRemove = image_filenames.filter(
           img => !existingImagesFromRequest.includes(img)
       );
   
       // Remove specified images from disk
       if (imagesToRemove.length > 0) {
           imagesToRemove.forEach(imageFilename => {
               const filePath = path.join("uploadsFlower", imageFilename);
               if (fs.existsSync(filePath)) {
                   fs.unlink(filePath, (err) => {
                       if (err) {
                           console.error(`Ошибка при удалении файла ${imageFilename}:`, err);
                       }
                   });
               }
           });
       }
   
       // Handle new image uploads
       if (req.files && req.files.length > 0) {
           const totalImages = existingImagesFromRequest.length + req.files.length;
           if (totalImages > 3) {
               // Remove newly uploaded files if total exceeds 3
               req.files.forEach(file => {
                   if (fs.existsSync(`uploadsFlower/${file.filename}`)) {
                       fs.unlinkSync(`uploadsFlower/${file.filename}`);
                   }
               });
               return res.status(400).json({ success: false, message: "Можно загрузить не более трех изображений" });
           }
   
           // Add new image filenames
           const newImageFilenames = req.files.map(file => file.filename);
           image_filenames = [...existingImagesFromRequest, ...newImageFilenames];
       } else {
           // If no new files, use existing images
           image_filenames = existingImagesFromRequest;
       }
   
       // Update flower details
       flower.name = req.body.name || flower.name;
       flower.description = req.body.description || flower.description;
       flower.price = req.body.price ? parseFloat(req.body.price) : flower.price;
       flower.date = req.body.date || flower.date;
       flower.images = image_filenames;
   
       await flower.save();
   
       res.json({ 
           success: true, 
           message: "Информация о цветке успешно обновлена", 
           data: flower 
       });
    } catch (error) {
       console.error("Ошибка при обновлении цветка:", error);
       res.status(500).json({ success: false, message: "Произошла ошибка при обновлении цветка" });
    }
};

export {addFlower, getFlowerById, removeFlower, updateFlower, listFlowersWithPagination};