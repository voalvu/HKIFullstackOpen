import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
//import user from '../../../osa4/blogilista/models/user'
import loginService from './services/login'



const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])
  useEffect(() =>{
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    //console.log(loggedUserJSON)
    if(loggedUserJSON !=="null"){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    } 
  },[])
  useEffect(() => {
    if (notification !== null) {
      const timer = setTimeout(() => {
        setNotification(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login(username,password)
      if(user){
        setUser(user)
        window.localStorage.setItem('loggedBlogappUser',JSON.stringify(user))
        blogService.setToken(user.token)
        setNotification([`logged in user ${user.username}`,"green"])
      }
    } catch (exception) {
      setNotification([`error logging in: ${exception.request.response}`,"red"])
      console.log(exception)
    }
  }
  const handleLogout = (event) =>{
    event.preventDefault()
    setUser(null)
    window.localStorage.setItem('loggedBlogappUser',null)
    blogService.setToken(null)
    setNotification([`logged out`,"green"])
  }
  const handleNewBlog = async (event) => {
    event.preventDefault()
    try {
      const newBlog = await blogService.create({title,author,url})
      setBlogs(blogs.concat(newBlog))
      setNotification([`a new blog ${newBlog.title} by ${newBlog.author} added`,"green"]
      )
    } catch (exception) {
      setNotification(['error adding blog',"red"])
      console.log(exception)
    }
  }

  const login = () => {
    return(<>
      <h2>login</h2>
        username<input type="text" onChange={({target}) => setUsername(target.value)}/>
        password<input type="text" onChange={({target}) => setPassword(target.value)}/>
        <button onClick={handleLogin}>login</button>
        
        </>)
  }
  const logout = () => {
    return(<>
        <button onClick={handleLogout}>logout</button>) 
        </>)
  }
  const newBlog = () => {
    return(<>
      <h2>create new</h2>
      <div id="newBlogInputs">
        title: <input type="text" onChange={({target}) => setTitle(target.value)}/><br/>
        author: <input type="text" onChange={({target}) => setAuthor(target.value)}/><br/>
        url: <input type="text" onChange={({target}) => setUrl(target.value)}/><br/>
      </div>
      <button onClick={handleNewBlog}>create</button>
      </>)
  }

  return (
    <div>
      <h2>blogs</h2>
      {notification === null ? null : <div id="notification" style={{color:notification[1]}}>{notification[0]}</div>}
      {user === null ? login() : <><div>{user.username} logged in</div> {logout()}</>}
      {user===null ? <div>please login to create new blogs</div> : newBlog()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App