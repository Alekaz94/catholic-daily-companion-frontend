import axios from 'axios';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export const API = axios.create({ baseURL: API_BASE_URL });
export const refreshAPI = axios.create({ baseURL: API_BASE_URL });
