import axios from 'axios';

const instance = axios.create({});

instance.interceptors.request.use(
  (config) => {
    const intercepted = { ...config };
    intercepted.url = `${process.env.SUJIN_AJAX_URL}${intercepted.url}`;
    return intercepted;
  },
  error => Promise.reject(error),
);

export default instance;
