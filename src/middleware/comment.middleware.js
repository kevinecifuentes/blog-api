const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const { Comment } = require('./../models/comment.model')
const { commentStatus } = require('./../models/comment.model')

exports.validComment = catchAsync(async (req, res, next) => {
  const { id } = req.params

  const comment = await Comment.findOne({
    where: {
      status: commentStatus.active,
      id,
    },
  })

  if (!comment) {
    return next(new AppError('This comment does not exist', 404))
  }

  req.comment = comment
  next()
})
