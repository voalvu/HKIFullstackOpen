import axios from 'axios'

const baseUrl = "http://localhost:3003"

const getAll = () => {
    return axios.get(baseUrl+"/api/blogs")
}

export default { getAll }