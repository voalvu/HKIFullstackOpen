import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
//import user from '../../../osa4/blogilista/models/user'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [notification, setNotification] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a,b) => b.likes - a.likes) )
    )
  }, [])
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    //console.log(loggedUserJSON)
    if(loggedUserJSON !=='null'){
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
        setNotification([`logged in user ${user.username}`,'green'])
      }
    } catch (exception) {
      setNotification([`error logging in: ${exception.request.response}`,'red'])
      console.log(exception)
    }
  }
  const handleLogout = (event) => {
    event.preventDefault()
    setUser(null)
    window.localStorage.setItem('loggedBlogappUser',null)
    blogService.setToken(null)
    setNotification(['logged out','green'])
  }
  const handleNewBlog = async (newBlog) => {
    try {
      const newBlogCreated = await blogService.create(newBlog)
      setBlogs(blogs.concat(newBlogCreated))
      setNotification([`a new blog ${newBlogCreated.title} by ${newBlogCreated.author} added`,'green']
      )
      return newBlogCreated
    } catch (exception) {
      setNotification([`error adding blog ${exception.request.response}`,'red'])
      console.log(exception)
      return exception.request.response
    }
  }

  const login = () => {
    return(<>
      <Togglable buttonLabel="login" ref={loginTogglable}>
        <h2>login</h2>
          username<input type="text" onChange={({ target }) => setUsername(target.value)}/>
          password<input type="text" onChange={({ target }) => setPassword(target.value)}/>
        <button onClick={handleLogin}>login</button>
      </Togglable>
    </>
    )
  }
  const logout = () => {
    return(<>
      <button onClick={handleLogout}>logout</button>
    </>)
  }



  const newBlog = () => {
    return(<>

      <Togglable buttonLabel="new blog" ref={newBlogTogglable}>
        <BlogForm createBlog={handleNewBlog}/>
      </Togglable>

    </>)
  }
  const newBlogTogglable = useRef()
  const loginTogglable = useRef()

  return (
    <div>
      <h2>blogs</h2>
      {notification === null ? null : <div id="notification" style={{ color:notification[1] }}>{notification[0]}</div>}
      {user === null ? login() : <><div>{user.username} logged in</div> {logout()}</>}
      {user===null ? <div>please login to create new blogs</div> : newBlog()}

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} user={user} />

      )}
      <button onClick={() => {console.log(blogs)}}> blogs</button>
    </div>
  )
}

export default App