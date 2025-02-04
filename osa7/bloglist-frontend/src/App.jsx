import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
//import user from '../../../osa4/blogilista/models/user'
import loginService from './services/login'

import { useDispatch, useSelector } from 'react-redux'

import { setNotification } from './reducers/notification'
import { initializeBlogs, addNewBlog } from './reducers/blog'


const App = () => {
  //const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const dispatch = useDispatch()
  const blogsGot = useRef(false)
  useEffect(() => {
    if (!blogsGot.current) {
      dispatch(initializeBlogs())
      blogsGot.current = true
    }
  }, [])

  const blogs = useSelector(state => {
    // TODO: SORT blogs
    console.log('STATAE',state)
    return state.blogs // blogs.sort((a,b) => b.likes - a.likes)
  })

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    //console.log(loggedUserJSON)
    // DIFFERENT BETWEEN BROWSERS...
    if(loggedUserJSON && loggedUserJSON !== 'null'){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  },[])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login(username,password)
      if(user){
        setUser(user)
        window.localStorage.setItem('loggedBlogappUser',JSON.stringify(user))
        blogService.setToken(user.token)
        dispatch(setNotification([`logged in user ${user.username}`,'green'],5))
        //loginTogglable.current.toggleVisibility() // Close login form
      }
    } catch (exception) {
      dispatch(setNotification([`error logging in: ${exception.request.response}`,'red'],5))
      console.log(exception)
    }
  }
  const handleLogout = (event) => {
    event.preventDefault()
    setUser(null)
    window.localStorage.setItem('loggedBlogappUser',null)
    blogService.setToken(null)
    dispatch(setNotification(['logged out','green'],5))
  }
  const handleNewBlog = async (newBlog,callback) => {
    try {
      dispatch(addNewBlog(newBlog))
      //setBlogs(blogs.concat(newBlogCreated))
      //dispatch(addNew(newBlog))
      dispatch(setNotification([`a new blog ${newBlog.title} by ${newBlog.author} added`,'green'],5
      ))
      newBlogTogglable.current.toggleVisibility() // Close new blog form
      if (callback) {
        callback();
      }
      //return newBlog
    } catch (exception) {
      console.log(exception)
      dispatch(setNotification([`error adding blog ${exception.request.response}`,'red'],5))
      console.log(exception)
      return exception.request.response
    }
  }

  const login = () => {
    return(<>
      <Togglable buttonLabel="login" ref={loginTogglable}>
        <h2>login</h2>
          username<input data-testid='username'  type="text" onChange={({ target }) => setUsername(target.value)}/>
          password<input data-testid='password' type="text" onChange={({ target }) => setPassword(target.value)}/>
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
      <Notification/>
      {/*       {notification === null ? null : <div id="notification" style={{ color:notification[1] }}>{notification[0]}</div>}
 */}      {user === null ? login() : <><div>{user.username} logged in</div> {logout()}</>}
      {user===null ? <div>please login to create new blogs</div> : newBlog()}

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} user={user} />

      )}
      <button onClick={() => {console.log(blogs)}}> blogs</button>

      <Blog blog={null}>helllo blog</Blog>
    </div>
  )
}

export default App