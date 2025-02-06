import { useMatch } from 'react-router-dom'
import { useState,useEffect } from 'react'
import userService from '../services/users'
const SingleUser = () => {
  const [users, setUsers] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      const gotUsers = await userService.getAll()
      setUsers(gotUsers)
    }
    fetchUsers()
  },[])

  const match = useMatch('/users/:id')
  //console.log(Number(match.params.id))
  console.log('USERS',users)
  console.log(match.params.id)
  const user = match
    ?  users ? users.find(a => a.id === match.params.id)
      : null : null
  console.log('matched',user)
  //console.log(user.blogs)
  return (<>{ user!==null ?<div><h2>{user.name}</h2><ul>{user.blogs.map(b => <li key={b.id}>{b.title}</li>)}</ul></div>:null}</>)
}

export default SingleUser