import axios from 'axios';
window.axios = axios;

axios.defaults.baseURL = import.meta.env.VITE_APP_URL || '/';
axios.defaults.withCredentials = true;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
