import axios from 'axios';
import errorInterceptor from './errorInterceptor';
// Set config defaults when creating the instance
const instance = axios.create({
    baseURL: 'http://localhost:8080/',
});

// Config cookie can use in client
instance.defaults.withCredentials = true;

// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    return response.data ?? {};
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    errorInterceptor(error)
    // return Promise.reject(error);
});

export default instance;