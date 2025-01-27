import { useState } from 'react'
import Proptypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()
    const response = await createBlog({ title,author,url })

    if(!(typeof(response) === 'string' && response.includes('error')))
    {
      setTitle('')
      setAuthor('')
      setUrl('')
    }

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