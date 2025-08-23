import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    const { token } = req.headers;

    if (!token) {
        return res.status(401).json({ success: false, message: "Пожалуйста, войдите в профиль" });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            // Обработка истечения токена
            return res.status(401).json({ success: false, message: "Срок действия токена истек. Пожалуйста, войдите снова." });
        } else {
            // Обработка других ошибок валидации
            console.error("Ошибка при проверке токена:", error);
            return res.status(401).json({ success: false, message: "Ошибка аутентификации" });
        }
    }
};

export default authMiddleware;