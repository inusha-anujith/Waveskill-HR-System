import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001/api', // ඔයාගේ back-end URL එක
});

// හැම Request එකකටම කලින් Auth Token එක එකතු කරන්න (යාළුවා හදපු Auth එකට ගැලපෙන්න)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // යාළුවා token එක save කරපු නම
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;