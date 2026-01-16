import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://notes-gcjt.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
