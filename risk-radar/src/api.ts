import axios from 'axios';
export const API_URL='http://192.168.0.103:5000/api';
export const api=axios.create({baseURL:API_URL,timeout:10000});
export async function safeGet<T>(url:string,fallback:T):Promise<T>{try{const r=await api.get(url);return r.data}catch{return fallback}}
