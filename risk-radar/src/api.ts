import axios from 'axios';
import { Platform } from 'react-native';

// Change this IP if your laptop Wi-Fi IP changes.
// Find it on Mac with: ipconfig getifaddr en0
const LAN_IP = '192.168.0.103';

export const API_URL = Platform.OS === 'web' ? 'http://localhost:5000/api' : `http://${LAN_IP}:5000/api`;

export const api = axios.create({
  baseURL: API_URL,
  timeout: 12000,
});

export function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'Network request failed';
  }
  return 'Something went wrong';
}
