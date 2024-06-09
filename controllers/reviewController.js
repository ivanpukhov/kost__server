const { Review, Establishment, sequelize } = require('../models');
const { Sequelize } = require('sequelize'); // Убедитесь, что Sequelize импортирован правильно

const getReviewsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const reviews = await Review.findAll({
            where: { UserId: userId },
            include: [{
                model: Establishment,
                attributes: ['name', 'address', 'phoneNumber'],
            }],
            attributes: [
                'id', 'rating', 'comment',
                [sequelize.literal(`(SELECT AVG(rating) FROM Reviews WHERE EstablishmentId = Establishment.id)`), 'averageRating']
            ]
        });

        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching user reviews with establishments:', error);
        res.status(500).send('Internal server error');
    }
};

module.exports = { getReviewsByUserId };
