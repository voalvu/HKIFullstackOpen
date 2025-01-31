import { useSelector, useDispatch } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'

//import {useState} from 'react'
import Filter from './Filter'
const AnecdoteList = () =>{
  //const [filter,setFilter] = useState('')
  
  const anecdotes = useSelector(state => {
    if(state.filter===""){return state.anecdotes}
    else{return state.anecdotes.filter((a)=>a.content.includes(state.filter.filter))
  }}
)
/*     if (state.filter === "") {
      return state
    }
    console.log(state)
    return state.filter(a=>a.content.includes(""))
    }) */

    const dispatch = useDispatch()

    const addVote = (id)=>{
        dispatch(vote(id))
    }
    return(
    <div>
      <h2>Anecdotes</h2>
      <Filter/>{/* filter<input value={filter} onChange={({target})=>(setFilter(target.value))}/> */}
      {/* sort anecdotes (descendign) */}
      {anecdotes.sort((a,b)=>a.votes<b.votes)
      .map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => addVote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}

    </div>
    )
}

export default AnecdoteList