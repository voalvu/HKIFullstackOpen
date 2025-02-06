import Togglable from './Togglable'
import blogsService from '../services/blogs'

import { useMatch } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { likeBlog, removeBlog,addComment } from '../reducers/blog'
import { setNotification } from '../reducers/notification'
import { useState } from 'react'

const Blog = ({ blog, user }) => {
  //const [blogState, setBlogState] = useState(blo g)
  const [comment, setComment] = useState('')
  const match = useMatch('/blogs/:id')
  /*     const blogMatched = match
    ?  blogs.find(a => a.id === match.params.id)
    : null
 */
  const dispatch = useDispatch()

  const blogState = useSelector((state) => { if(match){
    console.log('MATCHED',match)
    return state.blogs.find(a => a.id === match.params.id)}
  else if(blog){
    return state.blogs.find(b => b.id===blog.id)}
  else{
    return null
  }
  }
  )

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

  console.log('BLOGSTATE',blogState)
  console.log(blog,user)
  return(
    <>
      {user && blog ?
        <div style={{ border:'1px solid black',margin:'5px',padding:'5px' }}>
          {<a href={`/blogs/${blogState.id}`}>{blogState.title}</a>}
          <Togglable buttonLabel="view">

            {blogState.url} <br/>
        likes: {blogState.likes} <button id="like-button" onClick={() => addLike(blogState)}>like ♥</button> <br/>
            {blogState.user.length>0 ? blogState.user.username : null} <br/>
            {user!==null && blogState.user.length>0 ? blogState.user[0].username === user.username ? <button onClick={() => {if(window.confirm(`Are you sure you want to remove blog ${blogState.title} by ${blogState.author} ?`)){
              dispatch(removeBlog(blog.id))
              dispatch(setNotification([`removed blog ${blog.title}`],5))

            }}}>remove</button> : null : null}
          </Togglable>
        </div>
        : <div className='singleBlogView'><h2>{blogState.title} by {blogState.author}</h2><p>{blogState.likes} likes</p>
          <button>
      like
          </button>
          <p>added by {blogState.user[0] ? blogState.user[0].name : null}</p>
          <div className='comments'><h2>comments</h2>
            <form className='commentForm' onSubmit={
              (event) => {
                event.preventDefault()

                dispatch(addComment(blogState,match.params.id,comment))
                setComment('')
              }
            }>

              <input type="text" value={comment} onChange={({ target }) => setComment(target.value)} placeholder='leave comment'/><button type='submit'
              >add coment
              </button>
            </form>

            {blogState.comments ? blogState.comments.map((c) => <li>{c}</li>) : null }


          </div>
        </div>}


    </>
  )
}


export default Blog