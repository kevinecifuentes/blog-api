const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const jwt = require('jsonwebtoken')
const User = require('./../models/user.model')
const { promisify } = require('util')

exports.protect = catchAsync(async (req, res, next) => {
  //1. extraer token del header
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  //2. validar si el token existe
  if (!token) {
    return next(new AppError('You are not login!, Please login', 401))
  }

  //3. decodificar el token jwt
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.SECRET_JWT_SEED
  )

  //4. buscar el usuario y validar si existe
  const user = await User.findOne({
    where: {
      id: decoded.id,
      status: 'active',
    },
  })

  if (!user) {
    return runInNewContext(
      new AppError('the owner of this token is not longer available', 401)
    )
  }

  /* 5. validar el tiempo en el que se cambió la contraseña, para saber si el token fue generado después del cambio de contraseña */
  if (user.passwordChangedAt) {
    const changedTimeStamp = parseInt(user.passwordChangedAt.getTime() / 1000)

    if (decoded.iat < changedTimeStamp) {
      return next(
        new AppError('User recently changed password! Please, login again')
      )
    }
  }

  req.sessionUser = user
  next()
})

exports.protectAccountOwner = (req, res, next) => {
  const { user, sessionUser } = req

  if (user.id !== sessionUser.id) {
    return next(
      new AppError('You do not have authorization to do this action', 400)
    )
  }

  return res.status(200).json({
    status: 'succes',
    message: 'password changed succesfully',
  })
}

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.sessionUser.role)) {
      return next(new AppError('You do not have permission to do this', 403))
    }
    next()
  }
}
