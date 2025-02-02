
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import {useEffect} from 'react'
import { initializeAnecdotes } from './reducers/anecdoteReducer'
import { useDispatch } from 'react-redux'
const App = () => {
  const dispatch = useDispatch()

  useEffect(()=>{
    dispatch(initializeAnecdotes())
  })

  return (
    <div>
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App

/* const App = () => {


  return (

  )
}

export default App */