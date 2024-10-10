import axios from 'axios';


export const axiosInstance = axios.create({
  baseURL: "https://product-microservice-mlp.onrender.com",
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const axiosInstanceBanners = axios.create({
  baseURL: "https://banner-microservice-fr04.onrender.com",
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

