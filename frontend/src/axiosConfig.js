// frontend/src/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // Cseréld ki a megfelelő backend URL-re, ha szükséges
});

export default instance;
