const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const AppError = require('./utils/appError')
const globalErrorHandle = require('./controllers/error.controller')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const sanitizater = require('perfect-express-sanitizer')

//routes
const userRoutes = require('./routes/user.route')
const authRoutes = require('./routes/auth.route')
const postRoutes = require('./routes/post.route')
const commentRoutes = require('./routes/comment.route')

const app = express()

const limiter = rateLimit({
  max: 20, //Limit each IP to 100 requests per `window`
  windowMs: 60 * 60 * 1000, //time
  message: 'Too many requests from this IP, please try again in an hour',
})

app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(
  sanitizater.clean({
    xss: true,
    noSql: true,
    sql: false, //Is necessary lets it with false, because the library has an error.
  })
)

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

//limiter
app.use(limiter)

//routes
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/posts', postRoutes)
app.use('/api/v1/comments', commentRoutes)

// cualquier método con cualquier ruta diferente a las estalecidas, captúrame el error
app.all('*', (req, res, next) => {
  return next(
    new AppError(`Cannot find ${req.originalUrl} on this server!`, 404)
  )
})

app.use(globalErrorHandle) // en un callback, el error se puede recibir primero

module.exports = app
