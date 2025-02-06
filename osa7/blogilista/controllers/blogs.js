
const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')
const User = require('../models/user.js')
const jwt = require('jsonwebtoken')
const userExtractor = require("../utils/middleware").userExtractor

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user',{username:1,name:1})
    
    response.json(blogs)
})

blogsRouter.get('/:id', async(request, response) => {
    const blog = await Blog.findById(request.params.id)
      response.json(blog)
  })


blogsRouter.post('/', userExtractor, async (request, response) => {
  if(!request.token){
    response.status(401).json({error: 'token invalid'})
  }
  const decodedToken = jwt.verify(request.token,process.env.SECRET)
  if(!decodedToken.id){
    return response.status(401).json({error: 'token invalid'})
  }
  const body=request.body
 // const blog = new Blog(request.body)
  const blog = new Blog({title: body.title,user:request.user._id, author:body.author, url:body.url, likes:body.likes})

  const savedBlog = await blog.save()

  request.user.blogs = request.user.blogs.concat(savedBlog._id)
  await request.user.save()
  
  const resBlog = await Blog.findById(savedBlog._id).populate('user',{username:1,name:1})
  response.status(201).json(resBlog)

})

// add comment
blogsRouter.post('/:id/comments', /* userExtractor, */ async (request, response) => {
/*   if(!request.token){
    response.status(401).json({error: 'token invalid'})
  }
  const decodedToken = jwt.verify(request.token,process.env.SECRET)
  if(!decodedToken.id){
    return response.status(401).json({error: 'token invalid'})
  } */
  const body=request.body
 // const blog = new Blog(request.body)
  /* const blog = new Blog({title: body.title,user:request.user._id, author:body.author, url:body.url, likes:body.likes})

  const savedBlog = await blog.save()

  request.user.blogs = request.user.blogs.concat(savedBlog._id)
  await request.user.save()
   */
  console.log('COMMENT BODY',body)
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    comments: body.comments
  }
  const res = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true}).populate('user',{username:1,name:1})/* .populate('comments',{content:1}) */
  response.json(res)

})

blogsRouter.put('/:id', userExtractor, async(request,response)=>{
  const body = request.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  const res = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true }).populate('user',{username:1,name:1})
  response.json(res)
})

blogsRouter.delete('/:id',userExtractor, async (request, response) => {
  //const user = request.user
  //console.log(user)
  const decodedToken = jwt.verify(request.token,process.env.SECRET)
  if(!decodedToken.id){
    return response.status(401).json({error: 'token invalid'})
  }
  const blog = await Blog.findById(request.params.id)
  if(blog===null){ response.status(404).json({error:"blog not found"}
  )}

  else if ( blog.user.toString() === request.user._id.toString() ){
    const blogDeleted = await Blog.findByIdAndDelete(request.params.id)
    response.status(204).json(blogDeleted)
  }
  else{
    response.status(403).json({"error":"wrong user"})
  }
})

module.exports = blogsRouter