import axios from 'axios';

const myAxios = axios.create({
    baseURL: "http://localhost:8000/api/v1"
});

export default myAxios;
