const catchAsync = require('./../utils/catchAsync')
const User = require('./../models/user.model')
const bcrypt = require('bcryptjs')
const generateJWT = require('./../utils/jwt')
const AppError = require('../utils/appError')
const storage = require('./../utils/firebase')
const { getStorage, ref, uploadBytes } = require('firebase/storage')

// signup user
exports.signUp = catchAsync(async (req, res) => {
  const { name, email, password, description } = req.body

  const imgRef = ref(storage, `users/${Date.now()}-${req.file.originalName}`)
  const imgUpload = await uploadBytes(imgRef, req.file.buffer)

  const salt = await bcrypt.genSalt(12)
  const encryptedPassword = await bcrypt.hash(password, salt)

  const user = await User.create({
    name: name.toLowerCase().trim(),
    email: email.toLowerCase().trim(),
    password: encryptedPassword,
    description,
    profileImageUrl: imgUpload.metadata.fullPath,
  })

  const token = await generateJWT(user.id)

  res.status(200).json({
    status: 'succes',
    message: 'user has been created',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      description: user.description,
      role: user.role,
      profileImgUrl: user.profileImageUrl,
    },
  })
})

// signin user
exports.signIn = catchAsync(async (req, res, next) => {
  //1. traer el correo y la contraseña
  const { email, password } = req.body

  //2. buscar el usuario y validar si existe
  const user = await User.findOne({
    where: {
      status: 'active',
      email: email.toLowerCase().trim(),
    },
  })

  if (!user) {
    return next(new AppError(`user with email: ${email} not found`, 404))
  }

  //3.validar si la contraseña es correcta
  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Password is incorrect', 401))
  }

  //4. generar token
  const token = await generateJWT(user.id)

  res.status(200).json({
    status: 'signin success',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      description: user.description,
      role: user.role,
      profileImgUrl: user.profileImageUrl,
    },
  })
})

//change password
exports.changePassword = catchAsync(async (req, res, next) => {
  //1. traerme el usuario que viene de la req del middleware
  const { user } = req

  //2. tarerme los datos de la req.body
  const { currentPassword, newPassword } = req.body

  //3. validar si la contraseña actual y nueva son iguales, enviar un error
  if (currentPassword === newPassword) {
    return next(
      new AppError('New password cannot be equal to current password', 400)
    )
  }

  //4. validar si currentPassword es igual a la contraseña que tengo en la base de datos
  if (!(await bcrypt.compare(currentPassword, user.password))) {
    return next(new AppError('Incorrect password', 401))
  }

  //5. encriptar la contraseña
  const salt = await bcrypt.genSalt(14)
  const encryptedPassword = await bcrypt.hash(newPassword, salt)

  //6. actualizo la contraseña
  await user.update({
    password: encryptedPassword,
    passwordChangedAt: new Date(),
  })

  //7. enviar mensaje de que el cambio fue existoso
  res.status(200).json({
    status: 'succes',
    message: 'password changed succesfully',
  })
})
