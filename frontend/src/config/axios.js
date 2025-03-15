import axios from 'axios';

const token = localStorage.getItem('token'); // or wherever you store your token

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        Authorization: token ? `Bearer ${token}` : null
    }
});

export default axiosInstance;   