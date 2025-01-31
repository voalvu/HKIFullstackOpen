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

export const {changeNotification, clearNotification} = notificationSlice.actions
export default notificationSlice.reducer