const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = {
    async fetch(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        const headers = { ...options.headers };

        // Don't set Content-Type for FormData, let the browser handle it
        if (!(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${BASE_URL}/${endpoint}`, {
            ...options,
            headers: headers,
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
            const error = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
            throw new Error(error.message || response.statusText);
        }

        return response.json();
    },

    get(endpoint) {
        return this.fetch(endpoint, { method: 'GET' });
    },

    post(endpoint, data) {
        return this.fetch(endpoint, {
            method: 'POST',
            body: data instanceof FormData ? data : JSON.stringify(data),
        });
    },

    put(endpoint, data) {
        return this.fetch(endpoint, {
            method: 'PUT',
            body: data instanceof FormData ? data : JSON.stringify(data),
        });
    },

    delete(endpoint) {
        return this.fetch(endpoint, { method: 'DELETE' });
    },
};

export default api;
