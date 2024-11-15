import axios from 'axios';


export const axiosInstance = axios.create({
  baseURL: "https://product-microservice-mlp.onrender.com",
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});
