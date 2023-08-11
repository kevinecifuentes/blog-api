const catchAsync = require('./../utils/catchAsync')
const { Post, postStatus } = require('./../models/post.model')
const AppError = require('../utils/appError')
const User = require('../models/user.model')

exports.findOnePostMidlleware = catchAsync(async (req, res, next) => {
  const { id } = req.params

  const post = await Post.findOne({
    where: {
      status: postStatus.active,
      id,
    },
    include: {
      model: User,
      attributes: ['id', 'description', 'name'],
    },
  })

  if (!post) {
    return next(new AppError('This post does not exist', 404))
  }

  req.post = post
  req.user = post.user
  next()
})
