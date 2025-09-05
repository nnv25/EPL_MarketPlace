import shopModel from "../models/shopModel.js";
import fs from "fs"
import mongoose from "mongoose"; 
import { v4 as uuidv4 } from "uuid";
import axios from "axios"

//add shop
const addShop = async (req, res) => {
    // Проверяем наличие файла изображения
    if (!req.file) {
        return res.status(400).json({ success: false, message: "Фото магазина обязательно для загрузки" });
    }

    // Извлекаем информацию из запроса
    const image_filename = req.file.filename; // Получаем имя файла изображения

    const shopData = {
        name: req.body.name,
        work_time: {
            weekdays: req.body.work_time.weekdays, // Рабочие дни (понед. по пятницу)
            saturday: req.body.work_time.saturday, // Суббота
            sunday: req.body.work_time.sunday, // Воскресенье
        },
        address: req.body.address,
        phone: req.body.phone,
        delivery: req.body.delivery === 'true', // Преобразуем строку в булево значение
        payment_form: req.body.payment_form,
        image: image_filename, // Устанавливаем имя файла изображения
        isBanned: false,
    };

    // Добавляем цену доставки, если доставка включена
    /*if (shopData.delivery) {
        if (req.body.delivery_price) {
            shopData.delivery_price = parseFloat(req.body.delivery_price); // Преобразуем строку в число
        } else {
            // Если доставка включена, но цена не указана, возвращаем ошибку
            return res.status(400).json({ success: false, message: "Цена доставки обязательна, если доставка включена" });
        }
    }*/

    const shop = new shopModel(shopData);

    try {
        await shop.save();
        res.json({ success: true, message: "Магазин создан" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Произошла ошибка" });
    }
};

const listShop = async (req, res) => {

    try {
        // Получаем магазины с учетом пагинации
        const shops = await shopModel.find({isBanned: false})
        // Получаем общее количество магазинов
        const totalShops = await shopModel.countDocuments({isBanned: false});
        // Отправляем результат с дополнительной информацией о пагинации
        res.json({
            success: true,
            data: shops,
            totalShops // Общее количество магазинов
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Произошла ошибка" });
    }
};

const limitListShop = async (req, res) => {
    try {
      // Получаем номер страницы из запроса, по умолчанию 1
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit); // Количество магазинов на одной странице
      const skip = (page - 1) * limit;
  
      // Получаем количество всех магазинов
      const totalShops = await shopModel.countDocuments({isBanned: false});
  
      // Находим магазины с учётом пагинации
      const shops = await shopModel.find({isBanned: false}).skip(skip).limit(limit);
  
      // Отправляем данные с информацией о пагинации
      res.json({
        success: true,
        data: shops,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalShops / limit)||1,
          totalShops: totalShops,
        },
      });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Произошла ошибка" });
    }
};

const limitListBannedShop = async (req, res) => {
    try {
      // Получаем номер страницы из запроса, по умолчанию 1
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit); // Количество магазинов на одной странице
      const skip = (page - 1) * limit;
  
      // Получаем количество всех магазинов
      const totalShops = await shopModel.countDocuments({});
    
      // Находим магазины с учётом пагинации
      const shops = await shopModel.find({}).skip(skip).limit(limit);
  
      // Отправляем данные с информацией о пагинации
      res.json({
        success: true,
        data: shops,
        currentPage: page,
        totalPages: Math.ceil(totalShops / limit)||1,
        totalShops: totalShops,
      });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Произошла ошибка" });
    }
};

//shop
const getShopById = async (req, res) => {
    try {
        const shops = await shopModel.findById(req.body.id); // Исправлено на правильное получение ID
        if (!shops) {
            return res.json({ success: false, message: "Магазин не найден" });
        }
        res.json({ success: true, data: shops });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Произошла ошибка" });
    }
}

//remove shop
const removeShop = async (req, res) => {
    try {
        const shops = await shopModel.findById(req.body.id);
        fs.unlink(`uploads/${shops.image}`,()=>{})
        await shopModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message:"Магазин удален"});
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Произошла ошибка" });
    }
}

const banShop = async (req, res) => {
    const {id, isBanned} = req.body;
    try {
        const shops = await shopModel.findById(id);
        shops.isBanned = req.body.isBanned;
        await shops.save();

        return res.json({ success: true, message: shops.isBanned ? "Магазин заблокирован" : "Магазин разблокирован" });
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Произошла ошибка" });
    }
}

const updateShop = async (req, res) => {
    const { id } = req.body;
    const updatedData = {};

    if (req.body.name) updatedData.name = req.body.name;
    if (req.body.address) updatedData.address = req.body.address;
    if (req.body.phone) updatedData.phone = req.body.phone;
    if (req.body.delivery !== undefined) updatedData.delivery = req.body.delivery === 'true';
    if ('payment_form' in req.body) {
        let paymentForm = req.body.payment_form;

        // Если пришёл один пункт — будет строка
        if (!Array.isArray(paymentForm)) {
            paymentForm = [paymentForm];
        }

        // Перезаписываем целиком массив
        updatedData.payment_form = paymentForm;
    } else {
        // Если поле вообще не пришло, то очищаем (если так нужно)
        updatedData.payment_form = [];
    }
    if (req.body['work_time.weekdays'] || req.body['work_time.saturday'] || req.body['work_time.sunday']) {
        updatedData.work_time = {
            weekdays: req.body['work_time.weekdays'] || '',
            saturday: req.body['work_time.saturday'] || '',
            sunday: req.body['work_time.sunday'] || ''

        };
    }

    if (req.file) {
        updatedData.image = req.file.filename;
    }

    /*if (updatedData.delivery) {
        if (req.body.delivery_price) {
            updatedData.delivery_price = parseFloat(req.body.delivery_price);
        } else {
            return res.status(400).json({ success: false, message: "Цена доставки обязательна, если доставка включена" });
        }
    } else {
        updatedData.delivery_price = undefined;
    }*/

    try {
        const shop = await shopModel.findByIdAndUpdate(id, updatedData, { new: true });
        if (!shop) {
            return res.json({ success: false, message: "Магазин не найден" });
        }
        res.json({ success: true, data: shop, message: "Магазин обновлен" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Произошла ошибка" });
    }
};

const checkShopStatus = async (req, res) => {
    try {
        const { shopId } = req.params;
        const shop = await shopModel.findById(shopId);

        if (!shop) {
            return res.status(404).json({ message: "Магазин не найден" });
        }

        const { weekdays, saturday, sunday } = shop.work_time;
        const currentTime = new Date();
        const dayOfWeek = currentTime.getDay();

        // Функция для преобразования времени работы в дату
        const parseTimeRange = (timeRange) => {
            if (!timeRange || timeRange === "выходной") {
                return { startDate: null, endDate: null };
            }

            const [start, end] = timeRange.split("-");
            const [startHour, startMinute] = start.split(":").map(Number);
            const [endHour, endMinute] = end.split(":").map(Number);

            const startDate = new Date(currentTime);
            const endDate = new Date(currentTime);

            startDate.setHours(startHour, startMinute, 0);
            endDate.setHours(endHour, endMinute, 0);

            return { startDate, endDate };
        };

        let shopStatus = "closed"; // По умолчанию магазин закрыт

        // Определяем статус магазина в зависимости от текущего дня недели
        if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Понедельник - Пятница
            const { startDate, endDate } = parseTimeRange(weekdays);
            if (startDate && currentTime >= startDate && currentTime <= endDate) {
                shopStatus = "open";
            }
        } else if (dayOfWeek === 6) { // Суббота
            const { startDate, endDate } = parseTimeRange(saturday);
            if (startDate && currentTime >= startDate && currentTime <= endDate) {
                shopStatus = "open";
            }
        } else if (dayOfWeek === 0) { // Воскресенье
            const { startDate, endDate } = parseTimeRange(sunday);
            if (startDate && currentTime >= startDate && currentTime <= endDate) {
                shopStatus = "open";
            }
        }

        return res.status(200).json({
            message: shopStatus === "open" ? "Магазин открыт" : "Магазин закрыт"
        });
    } catch (error) {
        console.error("Ошибка при проверке статуса магазина:", error);
        return res.status(500).json({ message: "Ошибка сервера" });
    }
};

function formatPhoneNumber(phone) {
    return phone.replace(/[()\-\s]/g, '');
}

async function initialPayment(req, res) {
    try {
        const { amount, Id } = req.body;

        // Проверка на корректность суммы пополнения
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ success: false, message: 'Неверная сумма пополнения' });
        }

        // Проверка на корректность формата shopId
        if (!mongoose.Types.ObjectId.isValid(Id)) {
            return res.status(400).json({ success: false, message: 'Неверный формат shopId' });
        }

        // Поиск магазина по shopId
        const shop = await shopModel.findById(Id);
        if (!shop) {
            return res.status(404).json({ success: false, message: 'Магазин не найден' });
        }

        const url = "https://api.yookassa.ru/v3/payments";
        const headers = {
            "Authorization": `Basic ${Buffer.from(process.env.YOOMONEY_SHOP_ID + ':' + process.env.YOOMONEY_SECRET_KEY).toString('base64')}`,
            "Idempotence-Key": uuidv4().toString(),
            "Content-Type": "application/json"
        };

        // Логирование в не продакшн-режиме
        if (process.env.NODE_ENV !== 'production') {
            console.log("Заголовки для запроса:", headers);
        }

        const params = {
            "amount": {
                "value": amount.toFixed(2),  // Форматируем сумму с двумя знаками после запятой
                "currency": "RUB"
            },
            "payment_method_data": {
                "type": "bank_card"
            },
            "confirmation": {
                "type": "redirect",
                "return_url": process.env.MY_URL  // URL для редиректа после завершения платежа
            },
            "capture": true,
            "description": `Пополнение баланса магазина ${shop.name}`,
            "save_payment_method": "false",
            "metadata": {
                "shopId": Id  // Добавляем shopId в метаданные
            },
            "receipt": {
                "customer": {
                    "phone": formatPhoneNumber(shop.phone)
                },
                "items": [
                    {
                        "description": `Пополнение баланса магазина ${shop.name}`,  // Описание услуги
                        "quantity": "1.00",  // Количество
                        "amount": {
                            "value": amount.toFixed(2),  // Сумма
                            "currency": "RUB"
                        },
                        "vat_code": 1  // Код НДС
                    }
                ]
            }
        };

        // Логирование параметров запроса в не продакшн-режиме
        if (process.env.NODE_ENV !== 'production') {
            console.log("Параметры для запроса в Юкассу:", params);
        }

        // Отправляем запрос к Юкассе
        const response = await axios.post(url, params, { headers });

        // Обработка ответа от Юкассы
        if (response.data.status === "pending") {
            return res.status(200).json({
                success: true,
                message: "Перенаправление на Юкассу для подтверждения платежа",
                url: response.data.confirmation.confirmation_url
            });
        } else {
            return res.status(400).json({ success: false, message: `Платеж не завершен: ${response.data.status}` });
        }
    } catch (error) {
        // Логирование ошибки и отправка ответа с ошибкой
        console.error("Ошибка при пополнении баланса:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

async function UkassaWebHook(req, res) {
    try {
        console.log("Начало обработки вебхука Юкассы");
        const { event, object } = req.body;
        
        // Проверка данных вебхука
        console.log("Webhook body:", req.body);
        console.log("Тип события:", event);
        console.log("Данные объекта:", object);

        if (event === "payment.succeeded") {
            const payment_id = object.id;
            const shopId = object.metadata.shopId;
            const amount = parseFloat(object.amount.value);

            console.log("ID платежа:", payment_id);
            console.log("shopId из метаданных:", shopId);
            console.log("Сумма:", amount);

            if (!mongoose.Types.ObjectId.isValid(shopId)) {
                return res.status(400).json({ success: false, message: 'Неверный формат shopId в вебхуке' });
            }

            const shop = await shopModel.findById(shopId);
            if (!shop) {
                return res.status(404).json({ success: false, message: "Магазин не найден" });
            }

            console.log("Найден магазин для обновления баланса:", shop);

            // Обновляем баланс магазина
            shop.balance += amount;
            await shop.save();

            console.log("Баланс магазина успешно обновлен:", shop.balance);
            return res.status(200).send("OK");
        } else {
            console.log("Некорректный тип события");
            return res.status(400).send("Некорректный тип события");
        }
    } catch (error) {
        console.error("Ошибка в обработке вебхука Юкассы:", error);
        return res.status(500).send("Ошибка на сервере");
    }
}

const getShopBalance = async (req, res) => {
    try {
        const { shopId } = req.body; // Получаем shopId из тела запроса

        // Проверяем, передан ли shopId
        if (!shopId) {
            return res.status(400).json({
                success: false,
                message: "Не указан идентификатор магазина (shopId)"
            });
        }

        // Ищем магазин по ID
        const shop = await shopModel.findById(shopId);

        // Проверяем, найден ли магазин
        if (!shop) {
            return res.status(404).json({
                success: false,
                message: "Магазин с указанным ID не найден"
            });
        }

        if (shop.balance === undefined || shop.balance === null) {
            return res.status(404).json({
                success: false,
                message: "У данного магазина отсутствует информация о состоянии баланса"
            });
        }

        // Возвращаем баланс магазина
        return res.status(200).json({
            success: true,
            message: "Информация о балансе магазина",
            data: {
                balance: shop.balance
            }
        });
    } catch (error) {
        console.error("Ошибка при получении баланса магазина:", error);
        return res.status(500).json({
            success: false,
            message: "Ошибка сервера"
        });
    }
};

const updateShopBalance = async (req, res) => {
    const { id, balance } = req.body;

    // Проверка наличия данных
    if (!id || balance === undefined) {
        return res.json({ success: false, message: "Некорректные данные" });
    }

    // Формируем объект обновления
    const updatedBalance = { balance: parseFloat(balance) };

    try {
        // Обновление баланса магазина
        const shop = await shopModel.findByIdAndUpdate(id, updatedBalance, { new: true });
        if (!shop) {
            return res.json({ success: false, message: "Магазин не найден" });
        }

        // Успешное обновление
        res.json({ success: true, data: shop, message: "Баланс магазина обновлен" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Произошла ошибка" });
    }
};

export {addShop, listShop, getShopById, removeShop, updateShop, limitListShop, banShop, limitListBannedShop, checkShopStatus, initialPayment, UkassaWebHook, getShopBalance, updateShopBalance}