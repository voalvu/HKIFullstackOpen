import axios from 'axios'

const baseUrl = "http://localhost:3003"

let token = null
const setToken = newToken => {
    token = `Bearer ${newToken}`
  }

const getAll = async () => {
    const res = await axios.get(baseUrl+"/api/blogs")
    return res
}

const getOne = async (blogId) => {
    const res = await axios.get(baseUrl+`/api/blogs/${blogId}`)
    return res
}

const removeOne = (blog, user) => {
    console.log(blog)
    const config = {
        headers: { Authorization: `Bearer ${user.token}` },
    }
    return axios.delete(baseUrl+`/api/blogs/${blog.id}`, config)
}

const createBlog = async (blog, user) => {
    const config = {
        headers: { Authorization: `Bearer ${user.token}` },
    }
    
    const response = await axios.post(baseUrl+`/api/blogs`, blog, config)
    return response.data
}

const editBlog = (blog,editedBlog, user) => {
    const config = {
        headers: { Authorization: `Bearer ${user.token}` },
    }
    console.log("debugging edit blog")
    console.log(blog)
    console.log(editedBlog)
    return axios.put(baseUrl+`/api/blogs/${blog.id}`,editedBlog, config)
}


  
export default { getAll, removeOne, createBlog, editBlog, setToken, getOne }