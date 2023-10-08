import axios from "axios";
import { localStorageUtil } from "../utils/localStorageUtils";

const BASE_URL = "http://localhost:8080/api/v1";

export const axiosInstance = axios.create({ baseURL: BASE_URL });

axiosInstance.interceptors.request.use(
  (config: any) => {
    if (config.authorization !== false) {
      const token = localStorageUtil.token.get();
      if (token) {
        config.headers.Authorization = "Bearer " + token;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  (error: any) => {
    if (error.response?.data.httpStatusCode === 401) {
      localStorageUtil.token.remove()
      window.location.replace("login");
    }
    return error;
  }
);
