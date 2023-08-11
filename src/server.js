require('dotenv').config()
const initModel = require('./models/initmodels')
const app = require('./app')
const { db } = require('./database/config')

db.authenticate()
  .then(() => console.log('db conected'))
  .catch((err) => console.log(err))

initModel()

db.sync({ force: false })
  .then(() => console.log('db sync'))
  .catch((err) => console.log(err))

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`server runing on port ${PORT}`)
})
