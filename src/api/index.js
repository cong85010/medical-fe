import { notification } from "antd";
import axios from "axios";

export const instance = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => {
    return response.data.data;
  },
  (error) => {
    notification.error({
      message: error.response.data.message,
    });
    return Promise.reject(error.response.data);
  }
);
