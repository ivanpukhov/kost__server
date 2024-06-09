// В файле middleware/authenticateToken.js

const jwt = require('jsonwebtoken');
const { Sequelize } = require('sequelize');

const JWT_SECRET = 'your_jwt_secret'; // Используйте тот же секрет, который был использован при создании токена

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) return res.sendStatus(401); // Если токена нет, отправляем статус 401

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Если ошибка при верификации, отправляем статус 403
        req.user = user; // Сохраняем данные пользователя в объект запроса
        next(); // Переходим к следующему middleware/маршруту
    });
};

module.exports = authenticateToken;
