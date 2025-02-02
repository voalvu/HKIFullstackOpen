import {createSlice} from '@reduxjs/toolkit'

const emptyNotification = ''
const initialState = {message:emptyNotification}

const notificationSlice = createSlice({
    name:'notification',
    initialState,
    reducers:{
        changeNotification(state, action) {
            state.message = action.payload
        },
        clearNotification(state) {
            state.message = ''
        }
    }
})

export const { changeNotification, clearNotification } = notificationSlice.actions

export const setNotification = (message,time) =>{
    console.log(message,time)
    return async dispatch => {
        dispatch(changeNotification(message))
        //dispatch(clearNotification(time))
        setTimeout(() => {
            dispatch(clearNotification())
        }, time * 1000)
    }
}

//export const {setNotification} = notificationSlice.actions
export default notificationSlice.reducer