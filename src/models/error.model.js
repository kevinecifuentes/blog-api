const { DataTypes } = require('sequelize')
const { db } = require('./../database/config')

const Error = db.define('errors', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  stack: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
})

module.exports = Error
