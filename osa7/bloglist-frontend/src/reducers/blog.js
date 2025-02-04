import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
const emptyNotification = ''
const initialState = [/* { title:"blog1", author:'me', url:'some.url' },{ title:"blog2", author:'me', url:'some.url' },{ title:"blog3", author:'me', url:'some.url' } */]

const blogSlice = createSlice({
  name:'blog',
  initialState,
  reducers:{
    addNew(state, action) {
        console.log("STATE",state)
        console.log("ACITON",action)
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    }
    /*     likeBlog(state) {
      state.message = ''
    } */
  }
})

export const { addNew, setBlogs } = blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}
export const addNewBlog = (blog) => {
  return async dispatch => {
    const response = await blogService.create(blog)
    console.log('ADD NEW BLOG',response)
    dispatch(addNew(response))
  }
}

export const likeBlog = (blog) =>{
    return async dispatch => {
        const response = await blogService.update(blog.id,{...blog,likes:blog.likes+1})
        console.log("LIKED",response)
        dispatch(setBlogs(await blogService.getAll()))
    }
}
export const removeBlog = (blog) =>{
    console.log("REMOVING",blog)
    return async dispatch => {
        const response = await blogService.remove(blog)
        dispatch(setBlogs(await blogService.getAll()))
    }
}
/*
export const setNotification = (newBlog) => {
  console.log(message_and_color,time)
  return async dispatch => {
    dispatch(addNew(message_and_color))
    //dispatch(clearNotification(time))
    setTimeout(() => {
      dispatch(clearNotification())
    }, time * 1000)
  }
}
 */
//export const {setNotification} = notificationSlice.actions
export default blogSlice.reducer