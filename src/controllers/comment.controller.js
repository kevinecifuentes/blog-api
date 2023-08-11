const catchAsync = require('../utils/catchAsync')
const { Comment } = require('./../models/comment.model')
const { commentStatus } = require('./../models/comment.model')

exports.findAllComments = catchAsync(async (req, res, next) => {
  const comments = await Comment.findAll({
    where: {
      status: commentStatus.active,
    },
  })

  return res.status(200).json({
    status: 'success',
    results: comments.length,
    comments,
  })
})

exports.createComment = catchAsync(async (req, res, next) => {
  const { text, postId } = req.body
  const { id } = req.sessionUser

  const comment = await Comment.create({ text, postId, userId: id })

  return res.status(201).json({
    status: 'comment created succesfully',
    comment,
  })
})

exports.findOneComment = catchAsync(async (req, res, next) => {
  const { comment } = req

  return res.status(200).json({
    status: 'success',
    comment,
  })
})

exports.updateComment = catchAsync(async (req, res, next) => {
  const { comment } = req
  const { text } = req.body

  await comment.update({ text })

  return res.status(200).json({
    status: 'success',
    message: 'comment has been updated',
  })
})

exports.deleteComment = catchAsync(async (req, res, next) => {
  const { comment } = req

  await comment.updated({ status: commentStatus.disabled })

  return res.status(200).json({
    status: 'success',
    message: 'comment has been deleted',
  })
})
