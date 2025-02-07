import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Users from './components/Users'
import SingleUser from './components/SingleUser'
import { BrowserRouter as Router, useNavigate, Routes, Route, useMatch, Link, NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from './reducers/notification'
import { initializeBlogs, addNewBlog } from './reducers/blog'
import { setUser, handleLogin } from './reducers/user'

import styled from 'styled-components'


const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.2em; /* Space between form elements */
  font-family: monospace;
`

const Menu = (state) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const loginTogglable = useRef()

  const handleLogout = (event) => {
    event.preventDefault()
    dispatch(setUser(null))
    window.localStorage.setItem('loggedBlogappUser',null)
    dispatch(setNotification(['logged out','green'],5))
  }

  const login = () => {
    return(<>
      {console.log('LOGINTOGGAALBE',loginTogglable.current)}



      <Togglable buttonLabel="login" ref={loginTogglable}>
        <h2>login</h2>
        <Form onSubmit={(event) => {
          event.preventDefault()
          dispatch(handleLogin(username,password))
          console.log('FINALLY LOGGED ',window.localStorage.getItem('loggedBlogappUser'))
        }
        }
        >
          username<input data-testid='username'  type="text" onChange={({ target }) => setUsername(target.value)}/><br/>
          password<input data-testid='password' type="password" onChange={({ target }) => setPassword(target.value)}/><br/>
          <Button type='submit'>login</Button>
        </Form>
      </Togglable>
      <br/>
    </>
    )
  }
  const logout = () => {
    return(<>
      <Button onClick={handleLogout}>logout</Button>
    </>)
  }

  return (
    <Navbar>


      {!state.user.token ? (
        login()
      ) : (
        <>
          <UserInfoPanel>
            <UserInfo color={state.user.color}>
              <div className="block"></div>
              {state.user.username} logged in

            </UserInfo>
            {logout()}
          </UserInfoPanel>
        </>
      )}
      <NavLinks>
        <StyledLink to="/" exact activeClassName="active">Home</StyledLink>
        <StyledLink to="/users" activeClassName="active">View Users</StyledLink>
      </NavLinks>
    </Navbar>
  )
}

const UserInfoPanel = styled.div`
display:grid;`

const Navbar = styled.div`
  display: flex;
  justify-content: space-between; /* Space between links and user info */
  flex-direction: row-reverse;
  align-items: end; /* Center items vertically */
  padding: 0em 1em; /* Add padding for better spacing */
  background: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Add a subtle shadow */
`

const NavLinks = styled.div`
  display: flex;
  gap: 0.5em;
  align-items: center; /* Space between links */
`

const StyledLink = styled(NavLink)`
  font-family: 'Arial', sans-serif;
  color: black;
  text-decoration: none;
  padding: 1em 1.5em 0.2em 1.5em; /* Padding for better click area */
  border-radius: 4px 4px 0 0;
  transition: background 0.3s; /* Smooth background transition */

  &:hover {
    background:rgb(236, 221, 145); /* Light background on hover */
  }
  &.active {
    background:rgba(210, 209, 202, 0.46); /* Light background on hover */
  }
`
const UserInfo = styled.div`
  display: flex; /* Use flexbox to align items */
  align-items: center; /* Center items vertically */
  padding:1em;
  background: rgb(246, 243, 243);
  padding-right:2em;
  border-radius:8px;
  .block {
    width: 50px; /* Set width */
    height: 50px; /* Set height */
    border-radius: 50%; /* Make it circular */
    background-color: lightgray; /* Set background color */
    margin-right: 10px; /* Space between the circle and text */
  }

  font-family: 'Arial', sans-serif;
  color: ${({ color }) => color || 'black'}; /* Dynamic color based on user */
`


const Page = styled.div`
  padding: 1em;
  background: papayawhip;
  h2{
    font-family:'arial';
  }
`
const Button = styled.button`
  padding: 0.5em 1em;
  background: #ff6347; /* Tomato color */
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1em;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #ff4500; /* Darker shade on hover */
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 99, 71, 0.5); /* Focus ring */
  }
`

const Navigation = styled.div`
  background: BurlyWood;
  padding: 0em;
`

const Footer = styled.div`
  background: Chocolate;
  padding: 1em;
  margin-top: 1em;
`

const App = () => {

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
    }
  },[])


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



  const newBlog = () => {
    return(<>

      <Togglable buttonLabel="new blog" ref={newBlogTogglable}>
        <BlogForm createBlog={handleNewBlog}/>
      </Togglable>

    </>)
  }
  const newBlogTogglable = useRef()
  const Blogs = ({ blogs,user }) => {return(
    <>
      {console.log('is this user null',user)}
      {user===null ? <div>please login to create new blogs</div> : newBlog()}

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

        <Page>
          <Navigation>
            <Menu user={user}></Menu>
          </Navigation>
          <Notification/>

          <h2>blogs</h2>
          <Routes>
            <Route path="/" element = {<Blogs blogs={blogs} user={user}/>}></Route>
            <Route path='/users' element={<Users/>
            }>
            </Route>
            <Route path="/users/:id" element={<SingleUser />} />
            <Route path="/blogs/:id" element={<Blog />} />
          </Routes>
          <Link to='/users/:id'></Link>
          <Footer>
            <div><i>Blogs app, following FullStackOpen part7 material</i></div>
          </Footer>
        </Page>
      </div>
    </Router>
  )
}

export default App