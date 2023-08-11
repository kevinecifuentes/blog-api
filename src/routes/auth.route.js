const express = require('express')

//controllers
const authControllers = require('./../controllers/auth.controller')

//middlewares
const validationMiddleware = require('./../middleware/validation.middleware')
const userMiddleware = require('./../middleware/user.middleware')
const authMiddleWare = require('./../middleware/auth.middleware')

//multer
const { upload } = require('./../utils/multer')

const router = express.Router()

router.post(
  '/signup',
  upload.single('profileImgUrl'),
  validationMiddleware.createUserValidation,
  authControllers.signUp
)

router.post(
  '/signin',
  validationMiddleware.loginUserValidation,
  authControllers.signIn
)

router.use(authMiddleWare.protect)

router.patch(
  '/password/:id',
  validationMiddleware.updatePasswordValidation,
  userMiddleware.validUser,
  authMiddleWare.protectAccountOwner,
  authControllers.changePassword
)

module.exports = router
