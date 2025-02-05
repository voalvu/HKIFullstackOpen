import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { changeNotification, setNotification } from './notification'
const emptyUser = ''
const emptyPassword = ''
const initialToken = null
const initialState = { username:emptyUser, password:emptyPassword, color:'purple', token:initialToken }

const userSlice = createSlice({
  name:'user',
  initialState,
  reducers:{
    changeUser(state, action) {
      state.username = action.payload.username
      state.token = action.payload.token
      if(action.payload.color)
        state.color = action.payload.color
    },
    clearUser(state) {
      state.username = ''
      state.password = ''
      state.token = null
    },
    changeLoginForm(state,action) {
      if(action.payload.password)
        state.password = action.payload.password
      else if(action.payload.username)
        state.username = action.payload.username
    },
    loginUser(state, action){
      state.user = action.payload
    }
  }
})

export const { changeUser, clearUser, changeLoginForm,loginUser } = userSlice.actions
export const setUsername = (username) => {
  return async dispatch => {
    dispatch(changeLoginForm({ username:username }))
  }
}
export const setPassword = (password) => {
  return async dispatch => {
    dispatch(changeLoginForm({ password:password }))
  }
}
export const setUser = (username,token,color) => {
  console.log('SETTING USER',username,token,color)
  return async dispatch => {
    blogService.setToken(token)
    dispatch(changeUser({ username:username,token:token,color:color }))
  }
}
export const handleLogin = (username, password) => {
  return async dispatch => {try{
    console.log('Loggign in',username)
    const loginRes = await loginService.login(username, password)
    console.log(loginRes)
    blogService.setToken(loginRes.token)
    window.localStorage.setItem('loggedBlogappUser',JSON.stringify(loginRes))
    dispatch(changeUser({ username: loginRes.username,
      token: loginRes.token, password:'' }))
    dispatch(setNotification(['Logged in as'+loginRes.username,'green'],5))
  }     catch (error) {
    console.error('Login failed:', error)
    dispatch(setNotification([error.response.data.error,'red'],5))
  }}
}

//export const {setuser} = userSlice.actions
export default userSlice.reducer