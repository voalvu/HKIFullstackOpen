import axios from 'axios'

const baseUrl = "http://localhost:3003"

const getAll = () => {
    return axios.get(baseUrl+"/api/blogs")
}

const removeOne = (blog) => {
    console.log(blog)
    return axios.delete(baseUrl+`/api/blogs/${blog.id}`)
}

const createBlog = (blog) => {
    return axios.post(baseUrl+`/api/blogs`,blog)
}

const editBlog = (blog,editedBlog) => {
    return axios.put(baseUrl+`/api/blogs/${blog.id}`,editedBlog)
}

export default { getAll, removeOne, createBlog, editBlog }