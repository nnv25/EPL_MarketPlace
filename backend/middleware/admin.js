import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

const authorizeAdmin = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; 

  if (!token) {
    return res.status(403).json({ message: 'Токен отсутствует' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; 

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ запрещён: недостаточно прав' });
    }

    next(); // Если всё в порядке, продолжаем выполнение запроса
  } catch (error) {
    return res.status(401).json({ message: 'Неверный токен' });
  }
};

export { authorizeAdmin };