import ratingModel from "../models/ratingModel.js";
import shopModel from "../models/shopModel.js"; 
import jwt from 'jsonwebtoken'; 

const addRating = async (req, res) => {
    const { shopId, rating, comment, orderId } = req.body;

    try {
        // Извлечение токена из заголовка Authorization
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.id;

        // Проверка, что магазин существует
        const shop = await shopModel.findById(shopId);
        if (!shop) {
            return res.status(404).json({ message: 'Магазин не найден' });
        }

        // Проверка, что рейтинг находится в допустимом диапазоне
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Рейтинг должен быть от 1 до 5' });
        }

        // Проверка, оставлял ли пользователь уже оценку для данного заказа
        const existingRating = await ratingModel.findOne({ userId, orderId });
        if (existingRating) {
            return res.status(400).json({ message: 'Вы уже оставили отзыв для этого заказа.' });
        }

        // Создание нового рейтинга
        const newRating = new ratingModel({
            shopId,
            userId,
            orderId, // сохраняем orderId
            rating,
            comment
        });

        // Сохранение рейтинга
        await newRating.save();

        // Обновление среднего рейтинга магазина
        const ratings = await ratingModel.find({ shopId });
        const totalRatings = ratings.reduce((acc, cur) => acc + cur.rating, 0);
        const avgRating = totalRatings / ratings.length;

        // Сохранение обновленного среднего рейтинга в магазине
        shop.averageRating = avgRating;
        await shop.save();

        res.status(201).json({ message: 'Рейтинг добавлен', rating: newRating });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка при добавлении рейтинга' });
    }
};

const getAverageRating = async (req, res) => {
    const { shopId } = req.params; // Получаем shopId из параметров запроса

    try {
        // Проверка, что магазин существует
        const shop = await shopModel.find({shopId: shopId });
        if (!shop) {
            return res.status(404).json({ message: 'Магазин не найден' });
        }

        // Получение всех оценок для данного магазина
        const ratings = await ratingModel.find({shopId: shopId });

        // Если нет оценок, возвращаем 0
        if (ratings.length === 0) {
            return res.status(200).json({ averageRating: 0 });
        }

        // Вычисление среднего рейтинга
        const totalRatings = ratings.reduce((acc, cur) => acc + cur.rating, 0);
        const avgRating = (totalRatings / ratings.length).toFixed(1); // Округляем до одного знака после запятой

        // Возвращаем средний рейтинг
        res.status(200).json({ success: true,averageRating: parseFloat(avgRating) }); // Преобразуем в число
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка при получении среднего рейтинга' });
    }
};




//пагинация 
const limitListRating = async (req, res) => {
    const {shopId} = req.params; // Получаем shopId из параметров запроса
    const page = parseInt(req.query.page) || 1; // Получаем номер страницы из параметров запроса, если не указан, то по умолчанию 1
    const limit = parseInt(req.query.limit) // Получаем количество элементов на странице, по умолчанию 10
    const skip = (page - 1) * limit; // Количество пропущенных элементов
    try {
        // Получаем цветы с учетом пагинации
        const ratings = await ratingModel.find({ shopId: shopId })
            .populate({ path: 'userId', select: 'name -_id' })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);
        // Получаем общее количество отзывов для этого магазина
        const totalRatings = await ratingModel.countDocuments({ shopId: shopId });
        res.json({
            success: true,
            data: ratings,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalRatings / limit)||1,
                totalRatings: totalRatings,
            },
        });
    } catch (error) {
        console.error("Ошибка при получении списка отзывов с пагинацией:", error);
        res.status(500).json({ success: false, message: "Произошла ошибка при получении списка отзывов" });
    }
};

const listRatingById = async (req, res) => {
    const {ratingId} = req.params; // Получаем ratingId из параметров запроса
    const page = parseInt(req.query.page) || 1; // Получаем номер страницы из параметров запроса, если не указан, то по умолчанию 1
    const limit = parseInt(req.query.limit); // Получаем количество элементов на странице, по умолчанию 10
    const skip = (page - 1) * limit; // Количество пропущенных элементов

    try {
        // Получаем цветы с учетом пагинации
        const ratings = await ratingModel.find({ _id: ratingId})
        .populate({ path: 'userId', select: 'name -_id' });
        // Получаем общее количество отзывов для этого магазина
        
        // Отправляем результат с дополнительной информацией о пагинации
        res.json({
            success: true,
            data: ratings,
        });
    } catch (error) {
        console.error("Ошибка при получении списка отзывов:", error);
        res.status(500).json({ success: false, message: "Произошла ошибка при получении списка отзывов" });
    }
};



const updateStoreComment = async (req, res) => {
    const { ratingId } = req.params;
    const { storeComment } = req.body;
    try {
        const updatedRating = await ratingModel.findOneAndUpdate(
            {_id: ratingId},
            { storeComment },
            { new: true }
        );
        if (!updatedRating) {
            return res.status(404).json({ message: 'Отзыв не найден' });
        }

        res.status(200).json({ message: 'Комментарий добавлен', data: updatedRating });
    } catch (error) {
        console.error("Ошибка при обновлении storeComment:", error);
        res.status(500).json({ message: 'Ошибка при обновлении storeComment' });
    }
};

export { addRating, getAverageRating, limitListRating, listRatingById, updateStoreComment };