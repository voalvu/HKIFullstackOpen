import { useState } from 'react'
import { useEffect } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
  const initArr = new Array(anecdotes.length-1).fill(0)
  let initState = {}
  for (let i = 0; i < initArr.length; i++) {
    initState[i] = initArr[i]; // Assign the value from the array to the object
  } 
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(initState)

/*   useEffect(() => {
  let i =0
  const initVotes = {}
  for(let a of anecdotes){
    initVotes[i] = {"text":a,"votes":0}
    i+=1
    console.log(i)
  }; */
  //setVotes(initVotes)}, [anecdotes]);

  const randomAnecdote = () =>{
    let r = Math.floor(Math.random()*(anecdotes.length-1))
    while(r==selected){
      r = Math.floor(Math.random()*(anecdotes.length-1))
    }
    setSelected(r)
    console.log(r)
  }
  
  const voteAnecdote = () => {
    console.log(selected)
    const copy = {...votes}
    copy[selected]+=1
    setVotes(copy)
  }
  const AnecdoteMostVoted = () =>
  {
    let v = Object.values(votes)
    console.log(v)
    let m = Math.max(...v)
    console.log(Object.values(votes))
    console.log(m)
    const mostVoted = v.indexOf(m)
    console.log(mostVoted)
    return (<div>{anecdotes[mostVoted]}<br></br>has {m} votes</div>)
  }
  
  return (<>
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}<br></br>
      has {votes[selected]} votes <br></br>
      <button onClick={(voteAnecdote)}>vote</button>
      <button onClick={(randomAnecdote)}>next anecdote</button>
    </div>
    <div>
      <h1>Anecdote with most votes</h1>
      <AnecdoteMostVoted></AnecdoteMostVoted>
    </div>
    </>
  )
}

export default App