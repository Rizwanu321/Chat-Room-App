import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://chat-room-app-tnj8.onrender.com/api",
  withCredentials: true,
});

export default axiosInstance;
