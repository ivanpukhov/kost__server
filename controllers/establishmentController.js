const {Establishment, Review, Category} = require('../models'); // Убедитесь, что импортирована модель Category
const {Sequelize} = require('sequelize');

const establishmentController = {
    // Создание нового заведения с учетом категории
    async create(req, res) {
        try {
            const {name, address, phoneNumber, photo, CategoryId} = req.body;
            const newEstablishment = await Establishment.create({
                name,
                address,
                phoneNumber,
                photo,
                CategoryId
            });
            res.status(201).json(newEstablishment);
        } catch (error) {
            console.error('Ошибка при создании заведения:', error);
            res.status(500).send('Ошибка при создании заведения');
        }
    },

    async getEstablishmentsByUserReviews(req, res) {
        try {
            const userId = req.params.userId; // или req.query.userId, в зависимости от того, как вы решите передавать параметры
            const categoryId = req.query.categoryId;

            let whereClauseEstablishment = {};
            let whereClauseReview = { UserId: userId };

            if (categoryId) {
                whereClauseEstablishment.CategoryId = categoryId; // Фильтр по категории, если указан
            }

            const establishments = await Establishment.findAll({
                where: whereClauseEstablishment,
                include: [{
                    model: Review,
                    as: 'reviews', // Указываем псевдоним, используемый при определении связи
                    required: true,
                    where: whereClauseReview,
                    attributes: ['id', 'rating', 'comment', 'createdAt', 'UserId']
                }, {
                    model: Category,
                    attributes: ['id', 'name']
                }],
                attributes: {
                    include: [
                        // Вычисление среднего рейтинга из отзывов конкретного пользователя
                        [Sequelize.literal(`(SELECT AVG(rating) FROM Reviews WHERE EstablishmentId = Establishment.id AND UserId = ${userId})`), 'averageRating']
                    ]
                }
            });

            // Преобразование среднего рейтинга в число с двумя знаками после запятой
            establishments.forEach(establishment => {
                if (establishment.dataValues.averageRating) {
                    establishment.dataValues.averageRating = parseFloat(establishment.dataValues.averageRating).toFixed(2);
                }
            });

            if (establishments.length === 0) {
                return res.status(404).send('Заведения с отзывами от указанного пользователя не найдены');
            }

            res.status(200).json(establishments);
        } catch (error) {
            console.error('Ошибка при получении заведений с отзывами пользователя:', error);
            res.status(500).send('Ошибка сервера');
        }
    },


    async getAll(req, res) {
        try {
            const {categoryId, best} = req.query;
            let limit = best ? parseInt(best) : null;
            if (isNaN(limit) || limit < 1) limit = null; // Если параметр best не задан или некорректен, не применяем лимит

            const options = {
                include: [{
                    model: Review,
                    as: 'reviews',
                    attributes: ['id', 'rating', 'comment', 'createdAt', 'UserId']
                }],
                attributes: {
                    include: [
                        [Sequelize.literal('(SELECT AVG(rating) FROM Reviews WHERE Reviews.EstablishmentId = Establishment.id)'), 'averageRating']
                    ]
                },
                order: Sequelize.literal('averageRating DESC'), // Сортировка по убыванию среднего рейтинга
                limit: limit // Применение лимита, если он задан
            };

            // Фильтрация по категории, если указан параметр categoryId
            if (categoryId) {
                options.include.push({
                    model: Category,
                    where: {id: categoryId},
                    required: true, // Делаем INNER JOIN
                    attributes: []
                });
            }

            const establishments = await Establishment.findAll(options);

            establishments.forEach(establishment => {
                if (establishment.dataValues.averageRating) {
                    establishment.dataValues.averageRating = parseFloat(establishment.dataValues.averageRating).toFixed(2);
                }
            });

            res.status(200).json(establishments);
        } catch (error) {
            console.error('Ошибка при получении списка заведений:', error);
            res.status(500).send('Ошибка при получении списка заведений');
        }
    },


    // Получение информации о конкретном заведении
    async getById(req, res) {
        try {
            const {id} = req.params;
            const establishment = await Establishment.findByPk(id, {
                include: [{
                    model: Review,
                    as: 'reviews',
                    attributes: ['id', 'rating', 'comment', 'createdAt']
                }],
                attributes: {
                    include: [[Sequelize.fn('AVG', Sequelize.col('reviews.rating')), 'averageRating']]
                },
                group: ['Establishment.id']
            });

            if (!establishment) {
                return res.status(404).send('Заведение не найдено');
            }

            establishment.dataValues.averageRating = parseFloat(establishment.dataValues.averageRating).toFixed(2);

            res.status(200).json(establishment);
        } catch (error) {
            res.status(500).send('Ошибка при получении информации о заведении');
        }
    },

    // Обновление данных заведения
    async update(req, res) {
        try {
            const {id} = req.params;
            const {name, address, phoneNumber, photo} = req.body;
            const establishment = await Establishment.findByPk(id);

            if (!establishment) {
                return res.status(404).send('Заведение не найдено');
            }

            establishment.update({name, address, phoneNumber, photo});
            res.status(200).json(establishment);
        } catch (error) {
            res.status(500).send('Ошибка при обновлении данных заведения');
        }
    },

    // Удаление заведения
    async delete(req, res) {
        try {
            const {id} = req.params;
            const establishment = await Establishment.findByPk(id);

            if (!establishment) {
                return res.status(404).send('Заведение не найдено');
            }

            await establishment.destroy();
            res.status(200).send('Заведение удалено');
        } catch (error) {
            res.status(500).send('Ошибка при удалении заведения');
        }
    },

    // Добавление отзыва к заведению
    async addReview(req, res) {
        try {
            const {id} = req.params;
            const {rating, comment, userId} = req.body;

            const establishment = await Establishment.findByPk(id);
            if (!establishment) {
                return res.status(404).send('Заведение не найдено');
            }

            const newReview = await Review.create({
                rating,
                comment,
                EstablishmentId: id,
                UserId: userId
            });

            res.status(201).json(newReview);
        } catch (error) {
            res.status(500).send('Ошибка при добавлении отзыва');
        }
    },

    // Обновление отзыва
    async updateReview(req, res) {
        try {
            const {reviewId} = req.params;
            const {rating, comment} = req.body;

            const review = await Review.findByPk(reviewId);
            if (!review) {
                return res.status(404).send('Отзыв не найден');
            }

            review.update({rating, comment});
            res.status(200).json(review);
        } catch (error) {
            res.status(500).send('Ошибка при обновлении отзыва');
        }
    },

    // Удаление отзыва
    async deleteReview(req, res) {
        try {
            const {reviewId} = req.params;

            const review = await Review.findByPk(reviewId);
            if (!review) {
                return res.status(404).send('Отзыв не найден');
            }

            await review.destroy();
            res.status(200).send('Отзыв удален');
        } catch (error) {
            res.status(500).send('Ошибка при удалении отзыва');
        }
    }
};

module.exports = establishmentController;
