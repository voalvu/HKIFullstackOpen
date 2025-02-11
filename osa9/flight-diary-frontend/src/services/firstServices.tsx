import axios from 'axios'
import {AxiosResponse, AxiosError} from 'axios'
const baseUrl: string = "http://localhost:3001/"
const ping = async () => {
    try {
        return await axios.get(baseUrl+'ping')

    } catch (error) {
        console.error('Error fetching /ping:', error)
    }   
    return undefined;
}
const getAll = async () =>{
    return await axios.get(baseUrl+'api/diaries')
}
const create = async (data: object): Promise<string | AxiosResponse | AxiosError<unknown, unknown>> => {
    try {
        const res: AxiosResponse = await axios.post(baseUrl + 'api/diaries', data);
        console.log(res);
        return res;
    } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
            return e
        } else {
            console.error(e);
            return "something went wrong"
        }
    }
}

export default { ping ,getAll,create} 