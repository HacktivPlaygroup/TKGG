'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile, {foreignKey: 'UserId'});
      User.hasOne(models.StudentCourse,{foreignKey: 'StudentId'});
      User.hasMany(models.Course, {foreignKey: 'TeacherId'});
    }
  }
  User.init({
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull: {msg: "userName required!"},
        notEmpty: {msg: "userName required!"}
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: "password required!"},
        notEmpty: {msg: "password required!"}
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: `email required!`},
        notEmpty: {msg: `email required!`},
        isEmail: {msg: `check your email's format!`}
      }
    },
    grade: DataTypes.STRING,
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: `role required!`},
        notEmpty: {msg: `role required!`}
      }
    }
  }, {
    hooks: {
      beforeCreate(user,option) {
        user.grade = 'ungraded';
        const salt = bcrypt.genSaltSync(8);
        const hash = bcrypt.hashSync(user.password, salt);
        user.password = hash;

      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};