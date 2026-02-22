import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message;
    console.error("API Error:", message);
    return Promise.reject(new Error(message));
  }
);

export const apiLogin = async (email, password) => {
  const { data } = await apiClient.post('/auth/login', { email, password });
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
};

export const apiRegister = async (formData) => {
  const { data } = await apiClient.post('/auth/register', formData);
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
};

export const apiLogout = async () => {
  localStorage.removeItem('token');
  try {
    const { data } = await apiClient.post('/auth/logout');
    return data;
  } catch (e) {
    return { message: "Logged out locally" };
  }
};
