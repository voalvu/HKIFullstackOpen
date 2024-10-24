
const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')
const User = require('../models/user.js')
const jwt = require('jsonwebtoken')
const userExtractor = require("../utils/middleware").userExtractor
const Image = require('../models/image');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose')

let gfs; 
mongoose.connection.once('open', () => {
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection('uploads');
});


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user',{username:1,name:1}).populate({
    path:'entries.image',model:"Image",
  })
  //console.log(blogs[blogs.length-1].entries[blogs[blogs.length-1].entries.length-1].image.imageData)
  //console.log(atob(blogs[blogs.length-1].entries[blogs[blogs.length-1].entries.length-1].image.imageData.reduce((data, byte) => data + String.fromCharCode(byte), '')))
/*   console.log(
    Buffer.from(
      blogs[blogs.length - 1].entries[blogs[blogs.length - 1].entries.length - 1].image.imageData,
      'binary'
    ).toString('base64')

  ); */
  
/*   Buffer.from(
    blogs[blogs.length - 1].entries[blogs[blogs.length - 1].entries.length - 1].image.imageData,
    'binary'
  ).toString('base64') */

  const processedBlogs = blogs.map(blog => {
    return {
      id: blog._id.toString(),
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes,
      entries: blog.entries.map(entry => {
        if (entry.image && entry.image.imageData) {
          return {
            date:entry.date,
            subtitle:entry.subtitle,
            content:entry.content,
            image: {
              fileType:entry.image.fileType,
              fileSize:entry.image.fileSize,
              filename:entry.image.filename,
              imageData:entry.image.imageData.toString()
            }
          };
        } else {
          return entry;
        }
      }),
    };
  });
  response.json(processedBlogs)
})

blogsRouter.get('/:id', async(request, response) => {
    const blog = await Blog.findById(request.params.id).populate('user',{username:1,name:1})
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
  console.log("BODY FOR DEBUGGING NO USER IN BLOG",body)
 // const blog = new Blog(request.body)
  const blog = new Blog({title: body.title,user:request.user._id, author:body.author, url:body.url, likes:body.likes, user: request.user})

  const savedBlog = await blog.save()

  request.user.blogs = request.user.blogs.concat(savedBlog._id)
  await request.user.save()
  response.status(201).json(savedBlog)

})


blogsRouter.put('/:id', userExtractor, async (request, response) => {
  const { title, author, url, likes, entries, user } = request.body;
  try {
    // Find the blog by ID
    const blog = await Blog.findById(request.params.id);

    blog.title = title;
    blog.author = author;
    blog.url = url;
    blog.likes = likes;
    blog.entries = entries
    blog.user = user.id;

    await blog.save();

    const resBlog = await Blog.findById(request.params.id).populate('user',{username:1,name:1}).populate({
      path:'entries.image',model:"Image",
    })
    response.json(resBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    response.status(400).json({ error: error.message });
  }
});


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