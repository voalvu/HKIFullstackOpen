
const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')


blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

blogsRouter.get('/:id', (request, response, next) => {
    Blog.findById(request.params.id)
      .then(blog => {
        if (blog) {
          response.json(note)
        } else {
          response.status(404).end()
        }
      })
      .catch(error => next(error))
  })

blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

module.exports = blogsRouter