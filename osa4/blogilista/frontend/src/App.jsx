import { useState, useEffect } from 'react'
import './App.css'
import blogService from './services/blogService'

function App() {
  const [blogs, setBlogs] = useState([])
  
  useEffect(() => {
    console.log('running blogs getAll effect')
    blogService.getAll()    
      .then(res => {        
        console.log('blogs getAll promise fulfilled')
        console.log(res)   
        setBlogs(res.data)      
      })}
, [])
  return (
    <>
      <div className="blogs">
        {
          blogs.map(blog => {if(blog.title){return(
              <>
              <div className="blog">
              <p key={blog._id}>Title: {blog.title}</p>
              <p key={blog._id}>Author: {blog.author}</p>
              <p key={blog._id}>Link: {blog.url}</p>
              <p key={blog._id}>Likes ♥ {blog.likes}</p>
              </div>
              </>
          )}
          }
          )
        }
      </div>
    </>
  )
}

export default App
