import axios from 'axios';


const API_BASE_URL = 'https://die-botschaft-transcript-ai-app.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const endpoints = {
  spellcheck: {
    check: '/spellcheck/check',
  },
  pdfToImage: {
    convert: '/pdf-to-image/convert',
  },
  separator: {
    process: '/separator/process',
  },
  crop: {
    process: '/crop/process',
  },
};

export default api; 
