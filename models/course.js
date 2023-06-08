'use strict';
const {
  Model,Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Course.hasMany(models.StudentCourse, {foreignKey: 'CourseId'});
      Course.belongsTo(models.User, {foreignKey: 'TeacherId'});
    }

    get duMenit() {
      return this.duration+" menit";
    }

    get dateId() {
      return this.createdAt.toLocaleString('id-ID', {dateStyle: 'medium'})
    }

    static nameSearch(search) {
      let whereStatement = {};
      if(search) whereStatement.name = {[Op.iLike]: `%${search}%`};

      return whereStatement;
    }
  }
  Course.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    duration: DataTypes.STRING,
    TeacherId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};