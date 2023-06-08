'use strict';
const fs = require('fs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const data = JSON.parse(fs.readFileSync('./users.json','utf-8'))
    data.forEach(e => {
      delete e.id;
      e.createdAt = new Date;
      e.updatedAt = new Date;
    });
    await queryInterface.bulkInsert('Users', data, {});
    /**
     * Add seed commands here.
     *
     * Example:
    */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     */
  }
};
