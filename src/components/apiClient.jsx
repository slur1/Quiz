import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:80/quiz/src/api/',
});

export default apiClient;
