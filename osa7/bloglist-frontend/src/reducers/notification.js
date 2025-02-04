import { createSlice } from '@reduxjs/toolkit'

const emptyNotification = ''
const initialState = { message:emptyNotification, color:'green' }

const notificationSlice = createSlice({
  name:'notification',
  initialState,
  reducers:{
    changeNotification(state, action) {
      state.message = action.payload[0]
      if(action.payload.length>1)
        state.color = action.payload[1]
    },
    clearNotification(state) {
      state.message = ''
    }
  }
})

export const { changeNotification, clearNotification } = notificationSlice.actions

export const setNotification = (message_and_color,time) => {
  console.log(message_and_color,time)
  return async dispatch => {
    dispatch(changeNotification(message_and_color))
    //dispatch(clearNotification(time))
    setTimeout(() => {
      dispatch(clearNotification())
    }, time * 1000)
  }
}

//export const {setNotification} = notificationSlice.actions
export default notificationSlice.reducer