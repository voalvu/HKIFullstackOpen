import {useQuery, useQueryClient, useMutation} from '@tanstack/react-query'
import axios from 'axios'
import { useContext } from 'react'
import NotificationContext from '../NotificationContext'

const AnecdoteForm = () => {
  const [notification, dispatch] = useContext(NotificationContext)
  const queryClient = useQueryClient()

  const createAnecdote = anecdote =>
    axios.post('http://localhost:3001/anecdotes',anecdote)
    .then(res => res.data)

  const newAnecdoteMutation = useMutation({ mutationFn: createAnecdote,
    onSuccess: (anecdote) => {
      console.log(anecdote)
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] });
      dispatch({type:"NEW",data:anecdote})
      setTimeout(()=>{dispatch({type:"CLEAR"})},5000)
    },
  onError: (response) => {
     dispatch({type:"ERROR",data:response})
      setTimeout(()=>{dispatch({type:"CLEAR"})},5000)
   }})

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    console.log('new anecdote')
    newAnecdoteMutation.mutate({content, votes:0})
}


  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
