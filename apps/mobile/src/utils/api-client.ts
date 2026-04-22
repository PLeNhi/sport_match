import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

let token: string | null = null;

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:3000',
  timeout: 10000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  if (!token) {
    token = await AsyncStorage.getItem('authToken');
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('authToken');
      token = null;
      // TODO: Redirect to login screen
    }
    return Promise.reject(error);
  },
);

export const setAuthToken = async (newToken: string) => {
  token = newToken;
  await AsyncStorage.setItem('authToken', newToken);
};

export const clearAuthToken = async () => {
  token = null;
  await AsyncStorage.removeItem('authToken');
};

export default apiClient;
