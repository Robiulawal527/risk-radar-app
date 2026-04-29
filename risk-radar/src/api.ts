import axios from "axios";

export const API_URL = "http://192.168.0.103:5000/api"; //the ip is my laptop public ip address.

export const api = axios.create({
  baseURL: API_URL,
});