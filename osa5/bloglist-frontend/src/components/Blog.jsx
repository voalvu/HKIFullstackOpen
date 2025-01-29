import Togglable from './Togglable'
import blogsService from '../services/blogs'

import { useState } from 'react'

const Blog = ({ blog,user, onLike }) => {
  const [blogState, setBlogState] = useState(blog)

  const addLike = async (blog) => {
    console.log(blog.id)
    if(onLike){
      onLike()
    }else{
      const updatedBlog = await blogsService.update(blog.id, { ...blog,likes:blog.likes+1 })
      setBlogState(updatedBlog)
    }
  }

  if(blogState === null){

    return null
  }
  return(
    <>
      <div style={{ border:'1px solid black',margin:'5px',padding:'5px' }}>
        {blogState.title}
        <Togglable buttonLabel="view">

          {blogState.url} <br/>
        likes: {blogState.likes} <button onClick={() => addLike(blogState)}>♥</button> <br/>
          {blogState.user[0].username} <br/>
          {user!==null ? blogState.user[0].username === user.username ? <button onClick={() => {if(window.confirm(`Are you sure you want to remove blog ${blogState.title} by ${blogState.author} ?`)){
            blogsService.remove(blogState.id)
            setBlogState(null)
          }}}>remove</button> : null : null}
        </Togglable>
      </div>
    </>
  )
}


export default Blog