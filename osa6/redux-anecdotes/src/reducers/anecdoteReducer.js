import {createSlice} from '@reduxjs/toolkit'

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}
const initialState = anecdotesAtStart.map(asObject)

const anecdoteSlice = createSlice({
  name:'anecdotes',
  initialState,
  reducers:{
    createAnecdote(state,action){
      console.log("state and action",state,action)
      return  [...state, asObject(action.payload)]
    },
    vote(state,action){
      const id=action.payload
      console.log('vote', id)
      return state.map(anecdote =>
        anecdote.id === id 
          ? { ...anecdote, votes: anecdote.votes + 1 }
          : anecdote
        )
    }
  }
})

/* const reducer = (state = initialState, action) => {
  console.log('state now: ', state)
  console.log('action', action)
  switch(action.type){
    case 'VOTE':
      console.log("VOTE action got")
      console.log(action.data.id, state.find((el)=>el.id===action.data.id))
      return state.map(anecdote =>
      anecdote.id === action.data.id 
        ? { ...anecdote, votes: anecdote.votes + 1 }
        : anecdote
      )
    case 'NEW':
      console.log("ADDING NEW ANECDOTE")
      return [...state, asObject(action.payload.content)]
    default:
      return state

  }
} */

export const { createAnecdote, vote } = anecdoteSlice.actions
export default anecdoteSlice.reducer



/* export const vote = (id) => {
  console.log('vote', id)
  return { type: 'VOTE', data: { id } }
}

export const createAnecdote = (content) =>{
  return { type: 'NEW', payload: { content } }
}  */

//export default reducer