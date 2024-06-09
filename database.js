const Sequelize = require('sequelize');

// Настройка подключения к SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.db' // Укажите путь к вашему файлу .db
});

// Проверка подключения
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize;
