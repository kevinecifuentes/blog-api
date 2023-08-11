class AppError extends Error {
  constructor(message, statusCode) {
    super(message)

    this.statusCode = statusCode

    const statusCodeString = String(statusCode)

    this.status = statusCodeString.startsWith('4') ? 'error' : 'fail'
    this.isOperational = true

    Error.captureStackTrace(this, this.contructor)
  }
}

module.exports = AppError
