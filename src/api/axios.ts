import axios from 'axios';

export const axiosPublic = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
});

export const axiosPrivate = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});
