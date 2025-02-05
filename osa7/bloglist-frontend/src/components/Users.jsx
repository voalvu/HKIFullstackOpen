import axios from 'axios'
import { useState,useEffect } from 'react'
import userService from '../services/users'
const Users = () => {
  const [users, setUsers] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      const gotUsers = await userService.getAll()
      setUsers(gotUsers)
    }
    fetchUsers()
  },[])


  return(
    <>
      <h2>Users</h2>
      {users ?
        <div>
          {console.log('USERS',users)}
          <table>
            <thead>
              <tr>
                <th></th>
                <th>blogs created</th>
              </tr>
            </thead>
            <tbody>

              {users.map(user => <tr key={user.id}>
                <td>
                  {user.name ?
                    <a href={`/users/${user.id}`}>{user.name}</a> :
                    <a href={`/users/${user.id}`}>{user.username}</a>
                  }
                  {/*               <SingleUser users={users}></SingleUser>
 */}            </td>
                <td>{user.blogs.length}</td>

              </tr>)}

            </tbody>
          </table>

        </div>
        : null }
    </>)}

export default Users