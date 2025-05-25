import axios from 'axios';

window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.baseURL = import.meta.env.VITE_APP_URL || 'https://olivia-g4htendadecwc7fu.canadacentral-01.azurewebsites.net';