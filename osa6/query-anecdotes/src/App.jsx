import { useQuery, useMutation,useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useReducer } from 'react'

import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

import NotificationContext from './NotificationContext'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "NEW":
        console.log("action data",action.data)
        return `added ${action.data.content}`
    case "CLEAR":
      return ''
    case "ERROR":
        if(action.data.text){
          return action.data.text
        }
        console.log(action.data.request.response)
        return `couldnt add: ${action.data.request.response}`
    case "VOTE":
        return `voted ${action.data.content}`
    default:
        return state
  }
}

const App = () => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, null)

  const queryClient = useQueryClient()
  
  const getAnecdotes = () =>{
    return axios.get('http://localhost:3001/anecdotes').then(res => res.data)
  }
  const setAnecdote = (anecdote) =>{
    return axios.put(`http://localhost:3001/anecdotes/${anecdote.id}`, anecdote).then(res => {console.log("RESDATA",res.data);return res.data})
  }

  const voteAnecdoteMutation = useMutation({mutationFn:setAnecdote,
    onSuccess:(votedAnecdote)=>{
      // Get anecdotes at query time
      const anecdotes = queryClient.getQueryData(['anecdotes']);
      
      // Update anecdotes with the votedAnecdote from the queryFn (setAnecdote) response
      // This avoids a GET request compared to queryInvalidation
      const newAnecdotes = anecdotes.map((a) => {return a.id === votedAnecdote.id ? votedAnecdote : a});
      queryClient.setQueryData(['anecdotes'],newAnecdotes);
      notificationDispatch({type:"VOTE",data:votedAnecdote});
      setTimeout(()=>{notificationDispatch({type:"CLEAR"})},5000);
  },
  onError:(response)=>{
    notificationDispatch({type:"ERROR",data:{text:"couldn't vote for some reason."}});
    setTimeout(()=>{notificationDispatch({type:"CLEAR"})},5000);
  }})

  const handleVote = (anecdote) => {
    voteAnecdoteMutation.mutate({...anecdote, votes:anecdote.votes+1})
  }


  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry:false,
    
  })
  console.log(JSON.parse(JSON.stringify(result)))

  if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  let anecdotes;
  if(result.data){
    anecdotes = result.data
    console.log(anecdotes)
  }
  else{
    anecdotes = undefined
  }
  console.log(anecdotes)

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>

    <div>
      {anecdotes !== undefined ?
      
      <div>
        <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />

      {
      anecdotes.map(anecdote => {return(
        
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )})}
      </div> :<div> <p>problems with the anecdote server</p></div>
    }
    </div>
    </NotificationContext.Provider>
  )
}

export default App
