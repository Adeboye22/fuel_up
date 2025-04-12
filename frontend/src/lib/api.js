import axios from 'axios';

const api = axios.create({
  baseURL: 'https://fuelup-server.onrender.com/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
