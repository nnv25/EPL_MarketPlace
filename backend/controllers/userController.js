import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendSMS = async (phone, OTP) => {
    const apiKey = process.env.SMS_API_KEY;
    const message = `Ваш код подтверждения: ${OTP}`;
    const url = `https://sms.ru/sms/send?api_id=${apiKey}&to=${phone}&msg=${encodeURIComponent(message)}&json=1`;

    try {
        const response = await axios.get(url);
        if (response.data.status === "OK") {
            console.log("SMS отправлено:", response.data);
            return true;
        } else {
            console.log("Ошибка отправки SMS:", response.data.status_text);
            return false;
        }
    } catch (error) {
        console.error("Ошибка отправки SMS:", error);
        return false;
    }
};

// Маршрут логина
const loginUser = async (req, res) => {
    const { phone, password } = req.body;
    try {
        const user = await userModel.findOne({ phone });

        if (!user) {
            return res.json({ success: false, message: "Такого пользователя не существует" });
        }

        if (user.isBanned) { 
            return res.json({ success: false, message: "Пользователь заблокирован", isBanned: true });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Неверный пароль" });
        }

        const token = createToken(user._id);
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Ошибка при входе" });
    }
};

// Создание JWT токенов
const createToken = (id, expiresIn = '1d') => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn });
};

/*const createEmailToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_EMAIL_SECRET, { expiresIn: '1h' });
};*/

/*const createPasswordResetToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_PASSWORD_RESET_SECRET, { expiresIn: '1h' });
};*/

// Регистрация пользователя
/*const registerUser = async (req, res) => {
    const { name, password, email, phone } = req.body;
    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "Пользователь уже существует" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Некорректный email" });
        }

        if (password.length < 6) {
            return res.json({ success: false, message: "Пароль должен содержать не менее 6 символов" });
        }

        const phoneRegex = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
        if (!phoneRegex.test(phone)) {
            return res.json({ success: false, message: "Некорректный номер телефона" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            phone,
            password: hashedPassword,
        });

        const user = await newUser.save();
        const emailToken = createEmailToken(user._id);
        sendVerificationEmail(user, emailToken);

        const token = createToken(user._id);
        res.json({ success: true, message: "Регистрация успешна. Подтвердите email.", token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Ошибка при регистрации" });
    }
};*/
const registerUser = async (req, res) => {
    const { name, password, email, phone } = req.body;
    try {
        const exists = await userModel.findOne({ phone });
        if (exists) {
            return res.json({ success: false, message: "Пользователь уже существует" });
        }

        if (password.length < 6) {
            return res.json({ success: false, message: "Пароль должен содержать не менее 6 символов" });
        }

        const phoneRegex = /^\+7\d{10}$/; // Пример: +71234567890
        if (!phoneRegex.test(phone)) {
            return res.json({ success: false, message: "Некорректный номер телефона" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            phone,
            password: hashedPassword,
        });

        const OTP = Math.floor(1000 + Math.random() * 9000); // Генерация OTP
        newUser.otp = OTP;
        newUser.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP действует 5 минут
        await newUser.save();

        // Отправка OTP через SMS
        const smsSent = await sendSMS(phone, OTP);
        if (!smsSent) {
            return res.json({ success: false, message: "Ошибка при отправке SMS" });
        }

        res.json({ success: true, message: "Регистрация успешна. Подтвердите код из SMS." });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Ошибка при регистрации" });
    }
};

/*const verifyOTP = async (req, res) => {
    const { phone, OTP } = req.body;

    try {
        const user = await userModel.findOne({ phone });
        if (!user) {
            return res.json({ success: false, message: "Пользователь не найден" });
        }

        // Проверка на истечение срока действия OTP
        if (new Date() > user.otpExpiresAt) {
            return res.json({ success: false, message: "Код истек. Пожалуйста, запросите новый." });
        }

        if (user.otp !== OTP) {
            return res.json({ success: false, message: "Неверный OTP" });
        }

        user.otp = undefined;
        user.otpExpiresAt = undefined;
        user.isVerified = true;
        await user.save();

        res.json({ success: true, message: "Регистрация подтверждена" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Ошибка при проверке OTP" });
    }
};*/
const verifyOTP = async (req, res) => {
    const { phone, OTP } = req.body;

    try {
        const user = await userModel.findOne({ phone });
        if (!user) {
            return res.json({ success: false, message: "Пользователь не найден" });
        }

        if (new Date() > user.otpExpiresAt) {
            return res.json({ success: false, message: "Код истек. Пожалуйста, запросите новый." });
        }

        if (user.otp !== OTP) {
            return res.json({ success: false, message: "Неверный OTP" });
        }

        // Очистка OTP и подтверждение пользователя
        user.otp = undefined;
        user.otpExpiresAt = undefined;
        user.isVerified = true;
        await user.save();

        // Создание токена для входа пользователя
        const token = createToken(user._id);

        // Отправка подтверждения вместе с токеном
        res.json({ success: true, message: "Регистрация подтверждена", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Ошибка при проверке OTP" });
    }
};

const resendOTP = async (req, res) => {
    const { phone } = req.body;

    try {
        const user = await userModel.findOne({ phone });
        if (!user) {
            return res.json({ success: false, message: "Пользователь не найден" });
        }

        const OTP = Math.floor(1000 + Math.random() * 9000); // Генерация нового OTP
        user.otp = OTP;
        user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // Установка нового срока действия (5 минут)
        await user.save();

        // Отправка нового OTP через SMS
        const smsSent = await sendSMS(phone, OTP);
        if (!smsSent) {
            return res.json({ success: false, message: "Ошибка при отправке SMS" });
        }

        res.json({ success: true, message: "Новый код OTP отправлен." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Ошибка при повторной отправке OTP" });
    }
};

// Отправка письма для подтверждения email
/*const sendVerificationEmail = (user, token) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.yandex.ru',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const url = `http://localhost:4000/api/user/verify-email?token=${token}`;

    transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Подтверждение электронной почты',
        html: `Пожалуйста, подтвердите вашу почту, перейдя по <a href="${url}">ссылке</a>.`,
    }, (error, info) => {
        if (error) {
            console.log('Ошибка отправки email:', error);
        } else {
            console.log('Email отправлен:', info.response);
        }
    });
};*/

// Верификация email
/*const verifyEmail = async (req, res) => {
    const { token } = req.query;
    try {
        const decoded = jwt.verify(token, process.env.JWT_EMAIL_SECRET);
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.sendFile(path.join(__dirname, '../view/error.html'));
        }
        user.isVerified = true;
        await user.save();
        res.sendFile(path.join(__dirname, '../view/success.html'));
    } catch (error) {
        console.log('Ошибка верификации:', error);
        res.sendFile(path.join(__dirname, '../view/error.html'));
    }
};*/

/*const checkVerification = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    try {
        if (!token) {
            return res.status(400).json({ success: false, message: "Токен не предоставлен" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.json({ success: false, message: "Пользователь не найден" });
        }

        res.json({ success: true, isVerified: user.isVerified });
    } catch (error) {
        console.log('Ошибка проверки подтверждения:', error);
        res.json({ success: false, message: "Ошибка при проверке подтверждения" });
    }
};*/

/*export const sendPasswordResetEmail = async ({ email, OTP }) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.yandex.ru',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Сброс пароля',
        html: `<!DOCTYPE html>
        <html lang="en">
            <body>
                <h2>Ваш одноразовый пароль (OTP): ${OTP}</h2>
                <p>Он действителен в течение 5 минут.</p>
            </body>
        </html>`,
    };

    return transporter.sendMail(mailOptions);
};*/

/*const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Пользователь не найден" });
        }

        const OTP = Math.floor(1000 + Math.random() * 9000); // Пример генерации OTP

        // Сохранение OTP и его истечения в базу данных
        user.otp = OTP;
        user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP действует 5 минут
        await user.save();

        await sendPasswordResetEmail({ email: user.email, OTP });

        res.json({ success: true, message: "Письмо для сброса пароля отправлено." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Ошибка запроса сброса пароля" });
    }
};*/

/*const verifyOTP = async (req, res) => {
    const { email, OTP } = req.body;
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.json({ success: false, message: "Пользователь не найден" });
      }
  
      if (user.otp !== OTP || new Date() > user.otpExpiresAt) {
        return res.json({ success: false, message: "Неверный или истекший OTP" });
      }
  
      user.otp = undefined; // Удаление OTP после проверки
      user.otpExpiresAt = undefined;
      await user.save();
  
      res.json({ success: true, message: "OTP успешно проверен" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Ошибка проверки OTP" });
    }
};*/

/*const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Пользователь не найден" });
        }

        // Хеширование нового пароля
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Обновление пароля пользователя
        user.password = hashedPassword;
        await user.save();

        res.json({ success: true, message: "Пароль успешно изменен" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Ошибка при смене пароля" });
    }
};*/

const banUser = async (req, res) => {
    const {email, isBanned} = req.body;
    try {
        const user = await userModel.findOne({email});
        user.isBanned = req.body.isBanned;
        await user.save();

        return res.json({ success: true, message: user.isBanned ? "Пользователь заблокирован" : "Пользователь разблокирован" });
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Произошла ошибка" });
    }
}

const listUser = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Получаем номер страницы из параметров запроса, если не указан, то по умолчанию 1
    const limit = parseInt(req.query.limit) || 10; // Получаем количество элементов на странице, по умолчанию 10
    const skip = (page - 1) * limit; // Количество пропущенных элементов

    try {
        // Получаем магазины с учетом пагинации
        const users = await userModel.find({})
            .limit(limit)
            .skip(skip);

        // Получаем общее количество магазинов
        const totalUsers = await userModel.countDocuments();

        // Отправляем результат с дополнительной информацией о пагинации
        res.json({
            success: true,
            data: users,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit), // Вычисляем общее количество страниц
            totalUsers // Общее количество магазинов
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Произошла ошибка" });
    }
};

const limitListUser = async (req, res) => {
    try {
      // Получаем номер страницы из запроса, по умолчанию 1
      const page = parseInt(req.query.page) || 1;
      const limit = 10; // Количество магазинов на одной странице
      const skip = (page - 1) * limit;
  
      // Получаем количество всех магазинов
      const totalUsers = await userModel.countDocuments({});
  
      // Находим магазины с учётом пагинации
      const users = await userModel.find({}).skip(skip).limit(limit);
  
      // Отправляем данные с информацией о пагинации
      res.json({
        success: true,
        data: users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers: totalUsers,
        },
      });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Произошла ошибка" });
    }
};

const sendOtpForPasswordReset = async (req, res) => {
    const { phone } = req.body;
    try {
        const user = await userModel.findOne({ phone });
        if (!user) {
            return res.status(404).json({ success: false, message: "Пользователь не найден" });
        }

        const OTP = Math.floor(1000 + Math.random() * 9000); // Например, функция для генерации случайного 4-6 значного OTP
        user.otp = OTP;
        user.otpExpiresAt = Date.now() + 300000; // OTP действует 5 минут
        await user.save();

        // Отправка OTP через SMS-сервис
        await sendSMS(phone, OTP); // sendSms — ваша функция для интеграции с SMS API

        res.json({ success: true, message: "OTP отправлен на ваш номер телефона" });
    } catch (error) {
        console.error("Ошибка при отправке OTP:", error);
        res.status(500).json({ success: false, message: "Ошибка при отправке OTP" });
    }
};

const verifyOtpForPasswordReset = async (req, res) => {
    const { phone, OTP } = req.body;
    try {
        const user = await userModel.findOne({ phone });
        if (!user || user.otp !== OTP || new Date() > user.otpExpiresAt) {
            return res.status(400).json({ success: false, message: "Неверный или истекший OTP" });
        }

        user.otp = undefined;
        user.otpExpiresAt = undefined;
        await user.save();

        res.json({ success: true, message: "OTP подтвержден" });
    } catch (error) {
        console.error("Ошибка при проверке OTP:", error);
        res.status(500).json({ success: false, message: "Ошибка при проверке OTP" });
    }
};

const resetPassword = async (req, res) => {
    const { phone, newPassword } = req.body;
    try {
        const user = await userModel.findOne({ phone });
        if (!user) {
            return res.status(404).json({ success: false, message: "Пользователь не найден" });
        }

        user.password = await bcrypt.hash(newPassword, 10); // Хэширование нового пароля
        await user.save();

        res.json({ success: true, message: "Пароль успешно сброшен" });
    } catch (error) {
        console.error("Ошибка при сбросе пароля:", error);
        res.status(500).json({ success: false, message: "Ошибка при сбросе пароля" });
    }
};

export { loginUser, registerUser, /*verifyEmail, requestPasswordReset, checkVerification,*/ verifyOTP, resetPassword, banUser ,listUser, limitListUser, resendOTP, sendOtpForPasswordReset, verifyOtpForPasswordReset };