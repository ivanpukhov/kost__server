const express = require('express');
const authController = require('../controllers/authController');
const establishmentController = require('../controllers/establishmentController');
const categoryController = require('../controllers/categoryController'); // Убедитесь, что импортировали контроллер категорий
const reviewController = require('../controllers/reviewController');
const authenticateToken = require('../middleware/authenticateToken'); // Импортируем middleware
const router = express.Router();

// Маршруты аутентификации
router.post('/api/auth/register', authController.register);
router.post('/api/auth/login', authController.login);

// Маршруты заведений
router.post('/api/establishments', establishmentController.create);
router.get('/api/establishments', establishmentController.getAll);
router.get('/api/establishments/:id', establishmentController.getById);
router.put('/api/establishments/:id', establishmentController.update);
router.delete('/api/establishments/:id', establishmentController.delete);
router.get('/api/user/:userId/reviews', establishmentController.getEstablishmentsByUserReviews);
router.post('/api/establishments/:id/reviews', establishmentController.addReview);
router.put('/api/reviews/:reviewId', establishmentController.updateReview);
router.delete('/api/reviews/:reviewId', establishmentController.deleteReview);

// Маршруты категорий
router.post('/api/categories', categoryController.create); // Создание категории
router.get('/api/categories', categoryController.getAll); // Получение списка всех категорий
router.get('/api/categories/:id', categoryController.getById); // Получение информации о конкретной категории
router.put('/api/categories/:id', categoryController.update); // Обновление категории
router.delete('/api/categories/:id', categoryController.delete); // Удаление категории

module.exports = router;
