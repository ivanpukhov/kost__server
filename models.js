const Sequelize = require('sequelize');

// Настройка подключения к базе данных
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.db' // Укажите свой путь к файлу базы данных
});

// Определение модели User
const User = sequelize.define('User', {
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// Определение модели Establishment
const Establishment = sequelize.define('Establishment', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false
    },
    photo: {
        type: Sequelize.STRING,
        allowNull: true
    }
    // CategoryId добавится автоматически
});

// Определение модели Review
const Review = sequelize.define('Review', {
    rating: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    comment: {
        type: Sequelize.TEXT,
        allowNull: true
    }
});

// Определение модели Category
const Category = sequelize.define('Category', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true
    }
});

// Отношения между моделями
User.hasMany(Review);
Establishment.hasMany(Review, { as: 'reviews' });
Review.belongsTo(User);
Review.belongsTo(Establishment, { as: 'reviews' });
Establishment.belongsTo(Category); // Это добавляет `CategoryId` к `Establishment`
Category.hasMany(Establishment);

// Синхронизация с базой данных
sequelize.sync({ force: false }).then(() => {
    console.log('Database & tables created!');
});

module.exports = { User, Establishment, Review, Category, sequelize };
