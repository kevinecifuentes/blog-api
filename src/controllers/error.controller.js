const AppError = require('../utils/appError')
const Error = require('./../models/error.model')

const handleCastError22001 = () =>
  new AppError('The number of characters is greater than expected', 400)

const handleCastError22P02 = () =>
  new AppError('Invalid data type in data base', 400)

const handleCastError23505 = () =>
  new AppError('Duplicate fild value: please use another value', 400)

const handleJWTError = () =>
  new AppError('Invalid token. Please, check your token and try again', 401)

const handleTokenExpiredError = () =>
  new AppError('Your token has expired. Please, login again!', 401)

const errorDevMode = (err, res) => {
  Error.create({
    status: err.status,
    message: err.message,
    stack: err.stack,
  })
  console.log(err)
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    err,
  })
}

const errorProductionMode = (err, res) => {
  console.log(err)

  //operational, trusted error: send message to clien
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })
  } else {
    // programming or other uknown error: don't leak error detail
    return res.status(500).json({
      status: 'fail',
      message: 'something went wrong!',
    })
  }
}

const globalErrorHandle = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'fail'

  if (process.env.NODE_ENV === 'development') {
    errorDevMode(err, res)
  }

  if (process.env.NODE_ENV === 'production') {
    let error = err
    if (err.parent?.code === '22001') error = handleCastError22001()
    if (err.parent?.code === '22P02') error = handleCastError22P02()
    if (err.parent?.code === '23505') error = handleCastError23505()
    if (err.name === 'JsonWebTokenError') error = handleJWTError()
    if (err.name === 'TokenExpiredError') error = handleTokenExpiredError()

    errorProductionMode(error, res)
  }
}

module.exports = globalErrorHandle
