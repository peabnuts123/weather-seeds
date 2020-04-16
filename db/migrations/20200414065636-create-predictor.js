'use strict';
const Sequelize = require('sequelize');

module.exports = {
  /**
   * @param {Sequelize.QueryInterface} queryInterface
   * @param {Sequelize} Sequelize
   */
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Predictor', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      seed: {
        type: Sequelize.STRING,
      },
      roundId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Round',
        },
      },
      firstIncorrectDate: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Add unique constraint to [seed, roundId] to prevent rounds from having multiple of the same seed
    // Of course. This logic will be duplicated in the application layer. It would be silly to rely on this index
    //  to enforce this business logic - it is added as a hard prevention mechanism
    await queryInterface.addIndex('Predictor', {
      fields: ['seed', 'roundId'],
      unique: true,
    });
  },
  /**
   * @param {Sequelize.QueryInterface} queryInterface
   * @param {Sequelize} Sequelize
   */
  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('Predictor');
  }
};