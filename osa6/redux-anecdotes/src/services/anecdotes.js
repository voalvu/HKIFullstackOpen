import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (content) => {
  const response = await axios.post(baseUrl, content)
  return response.data
}

const voteById = async (id) => {
  const response = await axios.get(baseUrl)
  const anecdote = response.data.find(a => a.id === id)
  const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
  const result = await axios.put(`${baseUrl}/${id}`, updatedAnecdote)
  return result.data
}


export default { getAll, createNew,voteById }