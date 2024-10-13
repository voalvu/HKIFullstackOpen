const express = require('express')
const app = express()
const cors = require('cors')
const {} = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware.js')
const mongoose = require('mongoose')

//const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = process.env.MONGODB_URI// 'mongodb://localhost/bloglist'
mongoose.connect(mongoUrl).then(() => {    console.log('connected to MongoDB')  })  .catch((error) => {    console.log('error connecting to MongoDB:', error.message)  })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

// TODO: logger

app.use('/api/blogs', blogsRouter)

// TODO: middleware

module.exports = app