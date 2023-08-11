const AppError = require('../utils/appError')
const User = require('./../models/user.model')
const catchAsync = require('./../utils/catchAsync')

exports.validUser = catchAsync(async (req, res, next) => {
  const { id } = req.params

  const user = await User.findOne({
    where: {
      id,
      status: 'active',
    },
  })

  if (!user) {
    return next(new AppError(`User with id ${id} not found`, 404))
  }

  req.user = user
  next()
})
