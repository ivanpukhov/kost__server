const express = require('express');
const authController = require('../controllers/authController');
const establishmentController = require('../controllers/establishmentController');
const categoryController = require('../controllers/categoryController'); // Убедитесь, что импортировали контроллер категорий
const reviewController = require('../controllers/reviewController');
const authenticateToken = require('../middleware/authenticateToken'); // Импортируем middleware
const router = express.Router();

// Маршруты аутентификации
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Маршруты заведений
router.post('/establishments', establishmentController.create);
router.get('/establishments', establishmentController.getAll);
router.get('/establishments/:id', establishmentController.getById);
router.put('/establishments/:id', establishmentController.update);
router.delete('/establishments/:id', establishmentController.delete);
router.get('/user/:userId/reviews', establishmentController.getEstablishmentsByUserReviews);
router.post('/establishments/:id/reviews', establishmentController.addReview);
router.put('/reviews/:reviewId', establishmentController.updateReview);
router.delete('/reviews/:reviewId', establishmentController.deleteReview);

// Маршруты категорий
router.post('/categories', categoryController.create); // Создание категории
router.get('/categories', categoryController.getAll); // Получение списка всех категорий
router.get('/categories/:id', categoryController.getById); // Получение информации о конкретной категории
router.put('/categories/:id', categoryController.update); // Обновление категории
router.delete('/categories/:id', categoryController.delete); // Удаление категории

module.exports = router;
