import { useSelector, useDispatch } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'

const AnecdoteList = () =>{
    const anecdotes = useSelector(state => state)
    const dispatch = useDispatch()

    const addVote = (id)=>{
        dispatch(vote(id))
    }
    return(
    <div>
      <h2>Anecdotes</h2>
      {/* sort anecdotes (descendign) */}
      {anecdotes.sort((a,b)=>a.votes<b.votes).map(anecdote =>
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