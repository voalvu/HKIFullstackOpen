import Togglable from './Togglable'
import blogsService from '../services/blogs'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { likeBlog, removeBlog } from '../reducers/blog'
import { setNotification } from '../reducers/notification'

const Blog = ({blog, user }) => {
  //const [blogState, setBlogState] = useState(blo g)
  const dispatch = useDispatch()
  const blogState = useSelector((state)=>{if(blog){return state.blogs.find(b=>b.id===blog.id)}else{return null}} )

  if (!blogState)
    return null

  const addLike = async (blog) => {
    console.log(blog.id)
  
      dispatch(likeBlog(blog))
      //const updatedBlog = await blogsService.update(blog.id, { ...blog,likes:blog.likes+1 })
      //setBlogState(updatedBlog)
  }
  if(blogState === null){
    return null
  }
  console.log("BLOGSTATE",blogState)
  return(
    <>
      <div style={{ border:'1px solid black',margin:'5px',padding:'5px' }}>
        {blogState.title}
        <Togglable buttonLabel="view">

          {blogState.url} <br/>
        likes: {blogState.likes} <button id="like-button" onClick={() => addLike(blogState)}>like ♥</button> <br/>
          {blogState.user.length>0 ? blogState.user[0].username : null} <br/>
          {user!==null && blogState.user.length>0 ? blogState.user[0].username === user.username ? <button onClick={() => {if(window.confirm(`Are you sure you want to remove blog ${blogState.title} by ${blogState.author} ?`)){
            dispatch(removeBlog(blog.id))
            dispatch(setNotification([`removed blog ${blog.title}`],5))
            //blogsService.remove(blogState.id)
            //setBlogState(null)
          }}}>remove</button> : null : null}
        </Togglable>
      </div>
    </>
  )
}


export default Blog