import axios from 'axios';
window.axios = axios;

axios.defaults.baseURL = ''
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
