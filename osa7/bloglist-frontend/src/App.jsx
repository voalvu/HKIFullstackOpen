import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Users from './components/Users'
import SingleUser from './components/SingleUser'
import blogService from './services/blogs'
//import user from '../../../osa4/blogilista/models/user'
import loginService from './services/login'
import { BrowserRouter as Router, useNavigate, Routes, Route, useMatch, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { setNotification } from './reducers/notification'
import { initializeBlogs, addNewBlog } from './reducers/blog'
import { setUser, setUsername, setPassword, handleLogin } from './reducers/user'

const Menu = () => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <Link to='/' style={padding}>home</Link>
      <Link to='/users' style={padding}>view users</Link>
    </div>
  )
}


const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
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

  const user = useSelector(state => {
    return state.user
  })

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    console.log('LOGGED USER JSON',loggedUserJSON)
    // DIFFERENT BETWEEN BROWSERS...
    if(loggedUserJSON && loggedUserJSON !== 'null'){
      const user = JSON.parse(loggedUserJSON)
      console.log('USER PARSED',user)
      dispatch(setUser( user.username,user.token,user.color ))
      blogService.setToken(user.token)

    }
  },[])

  const handleLogout = (event) => {
    event.preventDefault()
    dispatch(setUser(null))
    window.localStorage.setItem('loggedBlogappUser',null)
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
        callback()
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
        <form onSubmit={(event) => {
          event.preventDefault();console.log(user)
          window.localStorage.setItem('loggedBlogappUser',JSON.stringify(user))
          dispatch(handleLogin(username,password))}}
        >
          username<input data-testid='username'  type="text" onChange={({ target }) => setUsername(target.value)}/><br/>
          password<input data-testid='password' type="password" onChange={({ target }) => setPassword(target.value)}/><br/>
          <button type='submit'>login</button>
        </form>
      </Togglable>
      <br/>
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
  const Blogs = ({blogs,user}) => {return(
    <>
      <div>
        {console.log('BLOGS IN MAIN PAGE',blogs)}
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} user={user} />
        )}
      </div>
    </>)
  }
  return (
    <Router>
      <div>

        <h2>blogs</h2>
        <Menu></Menu>
        <Notification/>
        {/*       {notification === null ? null : <div id="notification" style={{ color:notification[1] }}>{notification[0]}</div>}
 */}      {user.token === null || user.token===undefined ? login() : <><div><span style={{ color:user.color }}>{user.username}</span> logged in</div> {logout()}</>}
        {user===null ? <div>please login to create new blogs</div> : newBlog()}


        <button onClick={() => {console.log(blogs)}}> blogs</button>

        {/* <Blog blog={null}>helllo blog</Blog> */}
        <Routes>
          <Route path="/" element = {<Blogs blogs={blogs} user={user}/>}></Route>
          <Route path='/users' element={<Users/>
          }>
          </Route>
          <Route path="/users/:id" element={<SingleUser />} />
          <Route path="/blogs/:id" element={<Blog />} />
        </Routes>
        <Link to='/users/:id'></Link>
      </div>
    </Router>
  )
}

export default App