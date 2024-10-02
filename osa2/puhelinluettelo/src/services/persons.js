import axios from 'axios'

const baseUrl='/api/persons'

const getAll = () =>{
    return axios.get(baseUrl)
}

const getById = (id) => {
    // Check if the ID is a number or a string
    const idType = typeof id;
    const url = idType === 'number' ? `${baseUrl}/${id}` : `${baseUrl}?id=${id}`;
    return axios.get(url)
}

const create = newObject => {
    return axios.post(baseUrl,newObject)
}

const update = (id,newObject)=>{
    const url = `${baseUrl}/${parseInt(id)}`;
    return axios.put(url,newObject)
}

const deletePerson = personId => {
    const idType = typeof personId;
    console.log(idType,personId)
    const url = idType === 'number' ? `${baseUrl}/${personId}` : `${baseUrl}/${parseInt(personId)}`;
    return axios.delete(url);
  };


/* const deletePerson = id =>{
    return axios.delete(`${baseUrl}`).then(response => {
        console.log(response.data);
      })
      .catch(error => {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
        console.log(error.config);
      });
} */

export default {
    getAll: getAll,
    getById: getById,
    create: create,
    update: update,
    deletePerson: deletePerson,
}