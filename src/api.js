import axios from 'axios';

const api = axios.create({
    // Usage of REACT_APP_API_URL for production (Vercel) environment
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
});

console.log('------------------------------------------------');
console.log('🚀 App Environment:', process.env.NODE_ENV);
console.log('🔗 API URL Conf:', process.env.REACT_APP_API_URL);
console.log('📡 Axios BaseURL:', api.defaults.baseURL);
console.log('------------------------------------------------');

// Add a request interceptor to include the token if it exists (for protected routes)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Add a response interceptor to handle 401 errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Only redirect if it's a known protected route
            const protectedRoutes = ['cart', 'wishlist', 'orders', 'razorpay'];
            const isProtected = protectedRoutes.some(route => error.config.url.includes(route));

            if (isProtected) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;