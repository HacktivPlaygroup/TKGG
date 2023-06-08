'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Profiles', "UserId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: "Users"
        },
        key : "id"
      }
    });
    /**
     * Add altering commands here.
     *
     * Example:
     */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Profiles', 'UserId');
    /**
     * Add reverting commands here.
     *
     * Example:
     */
  }
};
