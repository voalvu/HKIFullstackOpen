import axios from 'axios'

const baseUrl = "http://localhost:3003"

let token = null

const getOne = async (id) => {

    const res = await axios.get(baseUrl+`/api/images/${id}`)
    console.log(res.body,res.data)
    console.log("IAMGE TIEMEEE")
    //btoa(String.fromCharCode(...new Uint8Array(blogEntry.image.imageData.arrayBuffer)))
    return res
}

const addOne = async (blog, imgFile, user) => {
    const { name, type, size, data } = imgFile;
    console.log("HELLO")
    console.log(imgFile)
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    console.log("HELLO")
    console.log(typeof(imgFile))
    const body = {
        filename: name || 'first-image',
        fileType: type || 'image/jpeg',
        imageData: data, // Convert the file to a buffer
        fileSize: size,
        blog: blog.id,
      };
    
  
    const res = await axios.post(baseUrl + `/api/images`, body, config);
    return res
};
const convertImageData = async (blogEntry) =>{
    return blogEntry
}

export default { getOne, addOne, convertImageData }