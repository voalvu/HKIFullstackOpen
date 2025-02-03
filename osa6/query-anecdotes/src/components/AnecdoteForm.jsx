import {useQuery, useQueryClient, useMutation} from '@tanstack/react-query'
import axios from 'axios'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()

  const createAnecdote = anecdote =>
    axios.post('http://localhost:3001/anecdotes',anecdote)
    .then(res => res.data)

  const newAnecdoteMutation = useMutation({ mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
  onError: () => {
/*     <Notification></Notification>
 */  }})

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
