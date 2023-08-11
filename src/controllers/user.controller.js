const AppError = require('../utils/appError')
const User = require('./../models/user.model')
const catchAsync = require('./../utils/catchAsync')

// Find all
exports.findAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    where: {
      status: 'active',
    },
  })

  res.status(200).json({
    status: 'succes',
    message: 'users found',
    users,
  })
})

// Find with ID
exports.findUser = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const { user } = req

  return res.status(200).json({
    status: 'succes',
    message: `user with id ${id} found`,
    id,
    user,
  })
})

// Update user
exports.updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const { user } = req
  const { name, description } = req.body

  await user.update({ name, description })

  return res.status(200).json({
    message: `user with id ${id} updated`,
    id,
    user,
  })
})

//delete user
exports.deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req

  await user.update({ status: 'inactive' })

  res.status(200).json({
    status: 'succes',
    message: `user deleted succesfully`,
    user,
  })
})
