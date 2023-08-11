const express = require('express')

//controllers
const postController = require('./../controllers/post.controller')

//middlewares
const authMiddleware = require('./../middleware/auth.middleware')
const validationMiddleware = require('./../middleware/validation.middleware')
const postMiddleware = require('./../middleware/post.middleware')
const userMiddleware = require('./../middleware/user.middleware')

const router = express.Router()

router
  .route('/')
  .get(postController.findAllPosts)
  .post(
    authMiddleware.protect,
    validationMiddleware.createPostValidation,
    postController.createPost
  )

router.use(authMiddleware.protect)

router.get('/me', postController.findMyPosts)

router.get(
  '/profile/:id',
  userMiddleware.validUser,
  postController.findUserPost
)

router
  .use('/:id', postMiddleware.findOnePostMidlleware)
  .route('/:id')
  .get(postController.findOnePost)
  .patch(
    validationMiddleware.createPostValidation,
    authMiddleware.protectAccountOwner,
    postController.updatePost
  )
  .delete(postController.deletePost)

module.exports = router
