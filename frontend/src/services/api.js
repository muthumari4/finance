import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api' // or your Render/Cloud URL
});

export default api;
