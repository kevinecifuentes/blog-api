const { body, validationResult } = require('express-validator')

const validFields = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.mapped(),
    })
  }
  next()
}

exports.updateUserValidation = [
  body('name').notEmpty().withMessage('Name is required.'),
  body('description').notEmpty().withMessage('Description is required.'),
  validFields,
]

exports.createUserValidation = [
  body('name').notEmpty().withMessage('Name is required.'),
  body('email')
    .notEmpty()
    .withMessage('email is required.')
    .isEmail()
    .withMessage('insert a valid email.'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('password must have at least 8 characters'),
  body('description').notEmpty().withMessage('Description is required.'),
  validFields,
]

exports.loginUserValidation = [
  body('email')
    .notEmpty()
    .withMessage('email is required.')
    .isEmail()
    .withMessage('insert a valid email.'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('password must have a least 8 characters'),
  validFields,
]

exports.updatePasswordValidation = [
  body('currentPassword')
    .isLength({ min: 8 })
    .withMessage('password must have at least 8 characters'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('password must have at least 8 characters'),
  validFields,
]

exports.createPostValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Post content is required'),
  validFields,
]

exports.createCommentValidation = [
  body('text').notEmpty().withMessage('Text is required'),
  body('postId').notEmpty().withMessage('Post id is required'),
  validFields,
]

exports.updateCommentValidation = [
  body('text').notEmpty().withMessage('Text is required'),
  validFields,
]
