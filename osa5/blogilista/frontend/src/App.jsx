import { useState, useEffect } from 'react'
import './App.css'
import blogService from './services/blogService'
import AddBlogPopup from './components/AddBlogPopup';

function App() {
  const [blogs, setBlogs] = useState([])
  const [blogsLiked, setBlogsLiked] = useState([])
  
  useEffect(() => {
    console.log('running blogs getAll effect')
    blogService.getAll()    
      .then(res => {        
        console.log('blogs getAll promise fulfilled')
        console.log(res.data)   
        setBlogs(res.data)      
      })},
      [])

const removeOne = (blog) => {
  if (window.confirm('Are you sure you want to delete this blog?')) {

  blogService.removeOne(blog)
    .then(() => {
      setBlogs(blogs.filter(b => b.id !== blog.id))
    })
  }
}

const addLike = (blog) =>{
  console.log(blogsLiked)
  console.log("adding like")
  const editedBlog = { ...blog, likes: blog.likes + 1 };
  console.log(editedBlog)
  blogService.editBlog(blog, editedBlog)
    .then((res) => {
      console.log(res.data)
      setBlogs(blogs.map(b => b.id === blog.id ? res.data : b));
      console.log('setting likes')
      setBlogsLiked(blogsLiked.concat(blog.id))
    });

}

const removeLike = (blog)=>{
  console.log(blogsLiked)
  console.log("removing like")
  const editedBlog = { ...blog, likes: blog.likes - 1 };
  blogService.editBlog(blog, editedBlog)
    .then((res) => {
      console.log(res.data)
      setBlogs(blogs.map(b => b.id === blog.id ? res.data : b));
      console.log('setting likes')
      setBlogsLiked(blogsLiked.filter(b => b !== blog.id))
    });
}

  return (
    <>
{/*       <div className="addBlog">
        <button onClick={initAddBlogPopup}>add blog</button>
      </div>*/}
      <div key="justblogs" className="blogs">
      <AddBlogPopup blogs={blogs} setBlogs={setBlogs}/>
        
        {
          blogs.map(blog => {if(blog.title){return(
            
            <div className="blog" key={blog.id}>
              <p>Title: {blog.title}</p>
              <p>Author: {blog.author}</p>
              <p>Link: {blog.url}</p>
              <p>Likes ♥ {blog.likes}</p> 
              {console.log(typeof blogsLiked)}
              { ! blogsLiked.includes(blog.id) ? 
                <button onClick={()=>addLike(blog)}> ♥ </button> : 
                <button onClick={()=>removeLike(blog)}> Liked ! </button> 
              }
              
              <button onClick={()=>removeOne(blog)}> delete </button>
              </div>
          )}
          }
          )
        }
        </div>
    </>
  )
}

export default App
