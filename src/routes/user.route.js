const express = require('express')
const router = express.Router()

//controlers
const userControllers = require('./../controllers/user.controller')

//middlewares
const useMiddleWares = require('./../middleware/user.middleware')
const validationMiddleWares = require('./../middleware/validation.middleware')
const authMiddleware = require('./../middleware/auth.middleware')

router.route('/').get(userControllers.findAllUsers)

router.use(authMiddleware.protect)

router.use(authMiddleware.restrictTo('admin', 'user'))

router
  .route('/:id')
  .get(useMiddleWares.validUser, userControllers.findUser)
  .patch(
    validationMiddleWares.updateUserValidation,
    useMiddleWares.validUser,
    userControllers.updateUser
  )
  .delete(useMiddleWares.validUser, userControllers.deleteUser)

module.exports = router
