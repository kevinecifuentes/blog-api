const jwt = require('jsonwebtoken')

const generateJWT = (id) => {
  return new Promise((res, rej) => {
    const payload = { id }

    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED,
      {
        expiresIn: process.env.JWT_EXPIRED_IN,
      },
      (err, token) => {
        if (err) {
          rej(err)
        }

        res(token)
      }
    )
  })
}

module.exports = generateJWT
