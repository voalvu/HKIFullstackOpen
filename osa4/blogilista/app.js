const config = require('./utils/config.js')
const express = require('express')
require('express-async-errors')

const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/users')
const logger = require('./utils/logger.js')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

logger.info('connecting to',config.MONGODB_URI)

const mongoUrl = config.MONGODB_URI// 'mongodb://localhost/bloglist'
mongoose.connect(mongoUrl).then(() => {    console.log('connected to MongoDB')  })  .catch((error) => {    console.log('error connecting to MongoDB:', error.message)  })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/login',loginRouter)
app.use('/api/users', usersRouter)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app