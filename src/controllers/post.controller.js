const catchAsync = require('./../utils/catchAsync')
const { db } = require('./../database/config')
const { Post, postStatus } = require('./../models/post.model')
const User = require('../models/user.model')
const { Comment } = require('../models/comment.model')

// find all blog posts
exports.findAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.findAll({
    where: {
      status: postStatus.active,
    },
    include: [
      {
        model: User,
      },
      {
        model: Comment,
        include: [
          {
            model: User,
          },
        ],
        attributes: {
          exclude: ['postId', 'updatedAt', 'status'],
        },
      },
    ],
    order: [['createdAt', 'DESC']],
    limit: 10,
    attributes: {
      exclude: ['status'],
    },
  })

  return res.status(200).json({
    status: 'succes',
    result: posts.length,
    posts,
  })
})

// find my personal posts
exports.findMyPosts = catchAsync(async (req, res, next) => {
  //hacer funcionalidad para traerse los post del usuario en sesión
  //debe incluir los comentarios de cada post y el user que hizo el comentario
  const { id } = req.sessionUser

  const myPosts = await Post.findAll({
    where: {
      status: postStatus.active,
      userId: id,
    },
    attributes: {
      exclude: ['status'],
    },
    include: [
      {
        model: Comment,
        attributes: {
          exclude: ['status', 'postId'],
        },
        include: [
          {
            model: User,
            attributes: {
              exclude: ['password', 'passwordChangedAt', 'email', 'status'],
            },
          },
        ],
      },
    ],
  })

  return res.status(200).json({
    status: 'succes',
    myPosts,
  })
})

//find posts of one specific user
exports.findUserPost = catchAsync(async (req, res, next) => {
  const { id } = req.params

  //this an other option to do a query, but is vulnerable, is necessary implement other security actions
  const query = `SELECT id, title, content FROM posts WHERE user_id = ${id} AND status = 'active'`

  const [rows, fields] = await db.query(query)

  return res.status(200).json({
    status: 'succes',
    results: fields.rowCount,
    posts: rows,
  })
})

//create a post
exports.createPost = catchAsync(async (req, res, next) => {
  const { title, content } = req.body
  const { id } = req.sessionUser

  const post = await Post.create({ title, content, userId: id })

  return res.status(201).json({
    status: 'success',
    message: 'New post created',
    post,
  })
})

//find one specific post
exports.findOnePost = catchAsync((req, res, next) => {
  const { post } = req

  return res.status(200).json({
    status: 'success',
    post,
  })
})

//update one specific post
exports.updatePost = catchAsync(async (req, res, next) => {
  const { post } = req
  const { title, content } = req.body

  await post.update({ title, content })

  return res.status(200).json({
    status: 'success',
    message: 'Post has been updated',
  })
})

//delete one specific post
exports.deletePost = catchAsync(async (req, res, next) => {
  const { post } = req

  await post.update({ status: postStatus.disable })

  return res.status(200).json({
    status: 'succes',
    message: 'Post has been deleted',
  })
})
