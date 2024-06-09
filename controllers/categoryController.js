const { Category, Establishment } = require('../models');

const categoryController = {
    // Создание новой категории
    async create(req, res) {
        try {
            const { name, description } = req.body;
            const newCategory = await Category.create({
                name,
                description
            });
            res.status(201).json(newCategory);
        } catch (error) {
            console.error('Ошибка при создании категории:', error);
            res.status(500).send('Ошибка при создании категории');
        }
    },

    // Получение списка всех категорий
    async getAll(req, res) {
        try {
            const categories = await Category.findAll();
            res.status(200).json(categories);
        } catch (error) {
            console.error('Ошибка при получении списка категорий:', error);
            res.status(500).send('Ошибка при получении списка категорий');
        }
    },

    // Получение информации о конкретной категории по ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const category = await Category.findByPk(id, {
                include: [Establishment]
            });

            if (!category) {
                return res.status(404).send('Категория не найдена');
            }

            res.status(200).json(category);
        } catch (error) {
            console.error('Ошибка при получении информации о категории:', error);
            res.status(500).send('Ошибка при получении информации о категории');
        }
    },

    // Обновление категории
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, description } = req.body;
            const category = await Category.findByPk(id);

            if (!category) {
                return res.status(404).send('Категория не найдена');
            }

            await category.update({
                name,
                description
            });

            res.status(200).json(category);
        } catch (error) {
            console.error('Ошибка при обновлении категории:', error);
            res.status(500).send('Ошибка при обновлении категории');
        }
    },

    // Удаление категории
    async delete(req, res) {
        try {
            const { id } = req.params;
            const category = await Category.findByPk(id);

            if (!category) {
                return res.status(404).send('Категория не найдена');
            }

            await category.destroy();
            res.status(200).send('Категория удалена');
        } catch (error) {
            console.error('Ошибка при удалении категории:', error);
            res.status(500).send('Ошибка при удалении категории');
        }
    }
};

module.exports = categoryController;
