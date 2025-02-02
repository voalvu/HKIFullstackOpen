import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'
const AnecdoteForm = () =>{
    const [anecdote, setAnecdote] = useState('anecdote here')
    const dispatch = useDispatch()


    const addNew = (event)=>{
        event.preventDefault()
        const content = anecdote
        console.log( event)
        console.log(content)
        dispatch(createAnecdote(content))
        dispatch(setNotification(`created new anecdote: ${content}`,5))
    
    }
    return(<div>
    <h2>create new</h2>
    <form>
    <div><input value={anecdote} onChange={({target})=>{console.log(target); setAnecdote(target.value)}} /></div>
    <button type='submit' onClick={addNew}>create</button>
    </form>
    </div>
    )
}
export default AnecdoteForm