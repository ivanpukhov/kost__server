const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('./../models'); // Импортируйте модель User

const JWT_SECRET = 'your_jwt_secret'; // Задайте свой секрет для JWT

const authController = {
    // Регистрация пользователя
    async register(req, res) {
        try {
            const { username, email, password } = req.body;

            // Проверка существования пользователя
            const userExists = await User.findOne({ where: { email } });
            if (userExists) {
                return res.status(400).send('Пользователь с таким email уже существует');
            }

            // Хеширование пароля
            const hashedPassword = await bcrypt.hash(password, 10);

            // Создание нового пользователя
            const newUser = await User.create({
                username,
                email,
                password: hashedPassword
            });
            const userId = newUser.id;

            // Генерация токена для нового пользователя
            const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '1h' });

            // Отправляем токен в ответе
            res.status(200).json({ token, userId });
        } catch (error) {
            console.log(error);
            res.status(500).send('Ошибка при регистрации пользователя');
        }
    },

    // Вход пользователя
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Поиск пользователя
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(400).send('Пользователь не найден');
            }

            // Проверка пароля
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).send('Неверный пароль');
            }

            const userId = user.id

            // Генерация токена
            const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

            res.status(200).json({ token, userId });
        } catch (error) {
            console.log(error);
            res.status(500).send('Ошибка при входе в систему');
        }
    }
};

module.exports = authController;
