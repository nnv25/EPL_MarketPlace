import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import roleModel from '../models/roleModel.js';
import shopModel from "../models/shopModel.js";

const JWT_SECRET = process.env.JWT_SECRET; // Используйте переменные окружения
const ADMIN_EMAIL = process.env.ADMIN_EMAIL; // Адрес электронной почты администратора

// Функция для генерации JWT токена
const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '1h' });
};

const registerShopUser = async (req, res) => {
  const { login, email, password, shopId } = req.body;

  try {
    // Проверяем, существует ли магазин с указанным shopId
    const shop = await shopModel.findById(shopId);
    if (!shop) {
      return res.status(400).json({ message: 'Магазин не найден' });
    }

    // Проверяем, существует ли уже пользователь с таким email
    const existingUser = await roleModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    // Создаём нового пользователя
    const newUser = new roleModel({
      login,
      email,
      password,
      role: 'shop',
      shopId
    });

    await newUser.save();
    return res.status(201).json({ message: 'Пользователь с ролью "shop" успешно зарегистрирован' });
  } catch (error) {
    console.error('Ошибка при регистрации пользователя:', error);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await roleModel.findOne({ email });
    if (!user) {
      return res.status(403).json({ message: 'Неверный email или пароль' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({ message: 'Неверный пароль' });
    }

    const token = generateToken(user._id, user.role);

    let isBanned = false;
    if (user.role === 'shop' && user.shopId) {
      const shop = await shopModel.findById(user.shopId);
      if (shop) {
        isBanned = shop.isBanned; // Set isBanned from the shop data
      }
    }

    return res.status(200).json({
      message: 'Вход успешен',
      token,
      user: {
        login: user.login,
        email: user.email,
        shopId: user.shopId,
        role: user.role,
      },
      isBanned, // Include isBanned in response
    });
  } catch (error) {
    console.error('Ошибка при входе пользователя:', error);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
};


// Контроллер для получения роли пользователя
const getUserRole = async (req, res) => {
  try {
    const { email } = req.params;

    // Находим пользователя по email без использования populate
    const user = await roleModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    // Проверяем, есть ли shopId
    if (user.role === 'shop' && !user.shopId) {
      return res.status(400).json({ message: 'У данного пользователя отсутствует shopId.' });
    }

    // Если shopId есть, попробуем выполнить populate для получения данных магазина
    let shop = null;
    if (user.role === 'shop') {
      shop = await shopModel.findById(user.shopId); // Находим магазин напрямую
      if (!shop) {
        return res.status(404).json({ message: 'Магазин не найден.' });
      }
    }

    // Формируем сообщение в зависимости от роли пользователя
    let message;
    if (user.role === 'admin') {
      message = 'Данный пользователь администратор';
    } else if (user.role === 'shop') {
      message = `Это владелец магазина. Shop ID: ${user.shopId}. Название магазина: ${shop.name}.`;
    }

    // Формируем ответ
    const response = {
      role: user.role,
      shopId: user.role === 'shop' ? user.shopId : null,
      message,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error); // Логируем ошибку на сервере для отладки
    res.status(500).json({ message: 'Server error', error });
  }
};

export {registerShopUser, loginUser, getUserRole };