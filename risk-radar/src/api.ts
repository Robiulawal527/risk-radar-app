import axios from 'axios';

// Change this IP if your laptop Wi-Fi IP changes.
export const API_URL = 'http://192.168.0.103:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});


