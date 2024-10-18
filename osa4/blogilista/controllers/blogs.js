
const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')
const User = require('../models/user.js')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user',{username:1,name:1})
    
    response.json(blogs)
})

blogsRouter.get('/:id', async(request, response) => {
    const blog = await Blog.findById(request.params.id)
      response.json(blog)
  })


  const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')){
      return authorization.replace('Bearer ','')
    }
    return null
  }

blogsRouter.post('/', async (request, response) => {
  const decodedToken = jwt.verify(getTokenFrom(request),process.env.SECRET)
  console.log(decodedToken)
  if(!decodedToken.id){
    return response.status(401).json({error: 'token invalid'})
  }
  console.log(request.body)
  const body=request.body
 // const blog = new Blog(request.body)
 const user = await User.findById(decodedToken.id)
  const blog = new Blog({title: body.title,user:user._id, author:body.author, url:body.url, likes:body.likes})

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
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