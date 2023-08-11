const { DataTypes } = require('sequelize')
const { db } = require('./../database/config')

const Comment = db.define('comments', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'post_id',
  },
  status: {
    type: DataTypes.ENUM('active', 'disabled'),
    defaultValue: 'active',
    allowNull: false,
  },
})

const commentStatus = Object.freeze({
  active: 'active',
  disabled: 'disabled',
})

module.exports = { Comment, commentStatus }
