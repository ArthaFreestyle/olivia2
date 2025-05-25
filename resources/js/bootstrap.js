import axios from 'axios';
window.axios = axios;

axios.defaults.baseURL = import.meta.env.VITE_APP_URL || '/';
axios.defaults.withCredentials = true;
console.log('VITE_APP_URL:', import.meta.env.VITE_APP_URL);
console.log('axios.defaults.baseURL:', axios.defaults.baseURL);
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
