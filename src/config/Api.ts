import axios from 'axios';
import { API_URL } from '@env';
import { config } from './env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const url = config.apiUrl
// console.log(
//   config.apiUrl
// );

const api = axios.create({
  baseURL: url, 
});

api.interceptors.request.use(async (conf) => {
  const token = await AsyncStorage.getItem(`${config.storageKeyPrefix}token`)
  const sessionId = await AsyncStorage.getItem(`${config.storageKeyPrefix}sessionId`)
 
  if (token) {
    conf.headers['Authorization'] = `Bearer ${token}`;
    conf.headers["x-session-id"] = sessionId;

  }
  return conf;
});

export default api;

