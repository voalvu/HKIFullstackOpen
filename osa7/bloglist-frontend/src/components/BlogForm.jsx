import { useState } from 'react'
import Proptypes from 'prop-types'
import { useSelector } from 'react-redux'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const blogs = useSelector(state => state.blogs)

  const addBlog = async (event) => {
    event.preventDefault()
    const newBlog = { title,author,url }
    createBlog(newBlog, () => {
      setTitle('')
      setAuthor('')
      setUrl('')
    })

    /*     if(!(typeof(response) === 'string' && response.includes('error')))
    {
      setTitle('')
      setAuthor('')
      setUrl('')
    }
    else{
      console.log(response)
    } */
  }

  return(
    <>
      <div id="newBlogInputs">
        <h2>create new</h2>
        <form onSubmit={addBlog}>
        title: <input value= {title}type="text" onChange={({ target }) => setTitle(target.value)}/><br/>
        author: <input value= {author} type="text" onChange={({ target }) => setAuthor(target.value)}/><br/>
        url: <input value= {url} type="text" onChange={({ target }) => setUrl(target.value)}/><br/>
          <button type="submit">save and submit</button>
        </form>
      </div>

    </>)
}

BlogForm.propTypes = {
  createBlog: Proptypes.func.isRequired
}

export default BlogForm