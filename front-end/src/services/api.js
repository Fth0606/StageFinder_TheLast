import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    //withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const apiService = {
    // Auth
    register: (userData) => api.post('/register', userData),
    login: (credentials) => api.post('/login', credentials),
    logout: () => api.post('/logout'),
    getUser: () => api.get('/user'),
    
    
    // Offers (Stages)
    getOffers: (params) => api.get('/offers', { params }),
    getOffer: (id) => api.get(`/offers/${id}`),
    createOffer: (data) => api.post('/offers', data),
    updateOffer: (id, data) => api.put(`/offers/${id}`, data),
    deleteOffer: (id) => api.delete(`/offers/${id}`),
    getMyOffers: () => api.get('/my-offers'), // company's own offers (all statuses)
    
    // Applications
    getApplications: () => api.get('/applications'),
    applyToOffer: (data) => api.post('/applications', data),
    updateApplicationStatus: (id, data) => api.put(`/applications/${id}`, data),
    submitEvaluation: (applicationId, data) => api.post(`/applications/${applicationId}/evaluation`, data),
    
    // Profile
    getProfile: () => api.get('/profile'),
    updateProfile: (data) => api.put('/profile', data),
    completeStudentProfile: (data) => api.post('/profile/student', data),
    completeCompanyProfile: (data) => api.post('/profile/company', data),
    
    // Messages
    getConversations: () => api.get('/conversations'),
    getConversation: (id) => api.get(`/conversations/${id}`),
    startConversation: (data) => api.post('/conversations', data),
    sendMessage: (conversationId, data) => api.post(`/conversations/${conversationId}/messages`, data),
    markConversationRead: (id) => api.put(`/conversations/${id}/read`),
    
    // Admin
    getAdminStats: () => api.get('/admin/stats'),
    getAdminUsers: () => api.get('/admin/users'),
    updateUserStatus: (id, status) => api.put(`/admin/users/${id}/status`, { status }),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    getAdminOffers: () => api.get('/admin/offers'),
    updateOfferStatus: (id, status) => api.put(`/admin/offers/${id}/status`, { status }),
    getAdminCompanies: () => api.get('/admin/companies'),
    verifyCompany: (id) => api.put(`/admin/companies/${id}/verify`),
    createAdmin: (data) => api.post('/admin/admins', data),
};

export default api;