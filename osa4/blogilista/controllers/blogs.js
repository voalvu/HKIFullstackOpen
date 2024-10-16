
const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')


blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

blogsRouter.get('/:id', async(request, response) => {
    const blog = await Blog.findById(request.params.id)
      response.json(blog)
  })

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)

})

blogsRouter.put('/:id',async(request,response)=>{
  const body = request.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  const res = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(res)
})

blogsRouter.delete('/:id', async (request, response) => {
  //console.log(request.params)
  const res = await Blog.findByIdAndDelete(request.params.id)
  response.status(204).json(res)
})

module.exports = blogsRouter