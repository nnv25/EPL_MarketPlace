import mongoose from "mongoose";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import shopModel from "../models/shopModel.js";
import axios from 'axios'; 
import dotenv from 'dotenv';
dotenv.config();

const placeOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const shop = await shopModel.findById(req.body.shopId).session(session);
        if (!shop) {
            return res.status(404).json({ message: "Магазин не найден" });
        }

        const commission = req.body.amount * 0.1;

        const user = await userModel.findById(req.body.userId).session(session);
        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,   
            shop: req.body.shopId,        
            amount: req.body.amount,        
            address: req.body.address,
            status: "Заказ в обработке",     
            payment: req.body.payment,
            comment: req.body.comment,
            deliveryOption: req.body.deliveryOption      
        });

        await newOrder.save({ session });

        await userModel.findByIdAndUpdate(req.body.userId, { $inc: { numberOfOrders: 1 } }, { session });
        
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} }, { session });

        await shopModel.findByIdAndUpdate(req.body.shopId, { $inc: { balance: -commission } }, { session });

        if (shop.phone) {
            const smsMessage = `У Вас новый заказ от ${user.name}. Для ознакомления перейдите по ссылке https://admin.bezpovoda14.ru/`;
            const smsParams = new URLSearchParams();
            smsParams.append('api_id', process.env.SMS_API_KEY); 
            smsParams.append('to', shop.phone);  
            smsParams.append('msg', smsMessage);

            try {
                await axios.post('https://sms.ru/sms/send', smsParams);
                sendWPStatusUpdate({
                    userId: req.body.userId,
                    shopId: req.body.shopId,
                    userModel,
                    shopModel,
                    type: 'orderPlacement'
                }).catch(error => {
                    console.log('проблема в отправке сообщения администратору:', error);
                });
            } catch (error) {
                console.error("Ошибка отправки SMS:", error);
            }
        }

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({ success: true, message: "Заказ успешно размещён" });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        return res.status(500).json({ success: false, message: "Ошибка при создании заказа" });
    }
};

const updateStatus = async (req, res) => {
    try {
      await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
  
      sendWPStatusUpdate({
        userId: req.body.userId,
        shopId: req.body.shop,
        status: req.body.status,
        userModel,
        shopModel,
        type: 'statusUpdate'
      }).catch(error => {
        console.log('проблема в отправке сообщения:', error);
      });
      res.json({ success: true, message: "Статус обновлен" });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" });
    }
  };

const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const page = parseInt(req.query.page) || 1; // Текущая страница, по умолчанию 1
        const limit = parseInt(req.query.limit) || 7; // Количество заказов на странице, по умолчанию 7
        const skip = (page - 1) * limit; // Вычисляем, сколько заказов нужно пропустить

        // Получаем заказы пользователя с сортировкой по дате (более поздние в начале)
        const orders = await orderModel.find({ userId })
            .sort({ date: -1 }) // Сортировка по дате в порядке убывания (более поздние идут первыми)
            .limit(limit)
            .skip(skip);

        // Подсчитываем общее количество заказов для пользователя
        const totalOrders = await orderModel.countDocuments({ userId });

        // Отправляем результат
        res.json({
            success: true,
            data: orders,
            currentPage: page,
            totalPages: Math.ceil(totalOrders / limit), // Вычисляем количество страниц
            totalOrders: totalOrders
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Ошибка" });
    }
};


const listOrders = async(req,res) => {
    try {
        const orders = await orderModel.find({});
        userModel.findById(userId).select('name phone').lean(),
        console.log(orders)
        
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Ошибка"})
    }
}

const sendWPStatusUpdate = async (options) => {
    const { 
      userId, 
      shopId, 
      status, 
      userModel, 
      shopModel,
      type = 'statusUpdate' 
    } = options;
  
    try {
      const [findUser, findShopName] = await Promise.all([
        userModel.findById(userId).select('name phone').lean(),
        shopModel.findById(shopId).select('name').lean()
      ]);
  
      if (!findUser) {
        console.log('User not found');
        return false;
      }
  
      const phoneNumber = findUser.phone;
      const userName = findUser.name;
      const shopName = findShopName?.name;
  
      if (!phoneNumber) {
        console.log('проблема с получением номера');
        return false;
      }
  
      const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
      const adminPhone = process.env.ADMIN_PHONE;
      const cleanedShop = shopName?.replace(/'/g, '').trim() || '';

      let WPMessage = '';
      let recipient = cleanedPhoneNumber;
      if (type === 'orderPlacement') {
        WPMessage = `Пользователь ${userName} с номером ${cleanedPhoneNumber} сделал заказ в магазине "${cleanedShop}"`;
        recipient = adminPhone;
      } else {
        WPMessage = `Здравствуйте ${userName}! Статус вашего заказа в магазине "${cleanedShop}" был изменен на "${status}"`;
      }
  
      const WPconfig = {
        method: 'post',
        url: `https://wappi.pro/api/async/message/send?profile_id=${process.env.WAPPI_ID}`,
        headers: {
          'Authorization': `${process.env.WAPPI_TOKEN}`
        },
        data: {
          body: WPMessage,
          recipient: recipient
        }
      };
  
      await axios(WPconfig);
      return true;
    } catch (error) {
      console.log('Error sending WhatsApp message:', error);
      return false;
    }
  };


// Получение всех заказов для конкретного магазина
/*const getOrdersByShop = async (req, res) => {
    const { shopId } = req.params; // Получаем shopId из параметров запроса

    try {
        // Ищем все заказы по shopId
        const orders = await orderModel.find({ shop: shopId }).populate('shop'); // Заполняем информацию о магазине

        if (orders.length === 0) {
            return res.status(404).json({ success: false, message: "Заказы для данного магазина не найдены" });
        }

        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Ошибка при получении заказов" });
    }
};*/
const getOrdersByShop = async (req, res) => {
    const { shopId } = req.params; // Получаем shopId из параметров запроса
    const page = parseInt(req.query.page) || 1; // Номер текущей страницы
    const limit = parseInt(req.query.limit) || 7; // Количество заказов на странице
    const skip = (page - 1) * limit; // Количество заказов, которые нужно пропустить

    try {
        // Ищем все заказы по shopId с пагинацией
        const orders = await orderModel.find({ shop: shopId })
            .populate('shop') // Заполняем информацию о магазине
            .populate({ path: 'userId', select: 'name phone' })
            .sort({ date: -1 }) // Сортируем заказы по дате (по убыванию)
            .limit(limit) // Ограничиваем количество возвращаемых заказов
            .skip(skip); // Пропускаем нужное количество заказов
        // Получаем общее количество заказов для данного магазина
        const totalOrders = await orderModel.countDocuments({ shop: shopId });

        if (orders.length === 0) {
            return res.status(404).json({ success: false, message: "Заказы для данного магазина не найдены" });
        }

        res.json({
            success: true,
            data: orders,
            currentPage: page, // Текущая страница
            totalPages: Math.ceil(totalOrders / limit), // Общее количество страниц
            totalOrders: totalOrders // Общее количество заказов
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Ошибка при получении заказов" });
    }
};

const getOrderById = async (req, res) => {
  const { orderId } = req.params; // Получаем ID заказа из параметров запроса

  try {
      // Находим заказ по его ID
      const order = await orderModel.findById(orderId);

      if (!order) {
          return res.status(404).json({ success: false, message: "Заказ не найден" });
      }

      // Возвращаем данные заказа
      res.json({
          success: true,
          data: order
      });
  } catch (error) {
      console.error("Ошибка при получении заказа:", error);
      res.status(500).json({ success: false, message: "Ошибка при получении заказа" });
  }
};

export { placeOrder, userOrders, listOrders, updateStatus, getOrdersByShop, getOrderById };