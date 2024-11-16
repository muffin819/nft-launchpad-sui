import axios from 'axios';
import NProgress from 'nprogress';

NProgress.configure({ showSpinner: false });

const axiosInstance = axios.create({
  // baseURL: 'https://api.theruneguardians.com/', // Replace with your API base URL
  timeout: 250000, // Timeout after 5 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    NProgress.start();
    return config;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
);

axiosInstance.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (error.response.status === 403 || error.response.status === 404 || error.response.status === 401) {
    // FasaToast({ title: "Error", content: "Your session expired.", type: "error" })
    // remove old cache
    // localStorage.clear()

    // localStorage.removeItem("jwt")
    // localStorage.removeItem("user-data")
    // localStorage.removeItem("wallet-session")
    // window.location.href = "/";
  }
  return Promise.reject(error);
});

export const ERR_BAD_REQUEST = "ERR_BAD_REQUEST"

export default axiosInstance;