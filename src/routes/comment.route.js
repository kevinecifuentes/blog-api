const express = require('express')

//controllers
const commentController = require('./../controllers/comment.controller')

//middlewares
const authMiddleware = require('./../middleware/auth.middleware')
const commentMiddleware = require('./../middleware/comment.middleware')
const validationMiddleware = require('./../middleware/validation.middleware')

const router = express.Router()

router.use(authMiddleware.protect)

router
  .route('/')
  .get(commentController.findAllComments)
  .post(
    validationMiddleware.createCommentValidation,
    commentController.createComment
  )

router
  .use('/:id', commentMiddleware.validComment)
  .route('/:id')
  .get(commentController.findOneComment)
  .patch(
    validationMiddleware.updateCommentValidation,
    commentController.updateComment
  )
  .delete(commentController.deleteComment)

module.exports = router
