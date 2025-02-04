import { configureStore  } from '@reduxjs/toolkit'

/* import filterReducer from './reducers/filterReducer'
 */import notificationReducer from './reducers/notification'
 import blogsReducer from './reducers/blog'


//import anecdotesService from './services/anecdotes'

const store = configureStore({
  reducer:{
    blogs: blogsReducer,
    notification: notificationReducer,
  }
})

/* anecdotesService.getAll().then(anecdotes =>
    anecdotes.forEach(anecdote => {
      store.dispatch(appendAnecdote(anecdote))
})) */

export default store