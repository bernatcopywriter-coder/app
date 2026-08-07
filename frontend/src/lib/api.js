import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API_BASE = `${BACKEND_URL}/api`;

export const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
});

// Public
export const submitQuote = async (formData) => {
    const { data } = await api.post('/quotes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
};

export const submitContact = async (payload) => {
    const { data } = await api.post('/contact', payload);
    return data;
};

// Auth
export const exchangeSession = async (sessionId) => {
    const { data } = await api.post('/auth/session', { session_id: sessionId });
    return data;
};

export const loginWithPassword = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
};

export const changePassword = async (currentPassword, newPassword) => {
    const { data } = await api.post('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
    });
    return data;
};

export const getMe = async () => {
    const { data } = await api.get('/auth/me');
    return data;
};

export const logout = async () => {
    const { data } = await api.post('/auth/logout');
    return data;
};

// Admin
export const listAdminQuotes = async () => {
    const { data } = await api.get('/admin/quotes');
    return data;
};

export const getAdminQuote = async (id) => {
    const { data } = await api.get(`/admin/quotes/${id}`);
    return data;
};

export const updateAdminQuoteStatus = async (id, statusVal) => {
    const { data } = await api.patch(`/admin/quotes/${id}`, { status: statusVal });
    return data;
};

export const deleteAdminQuote = async (id) => {
    const { data } = await api.delete(`/admin/quotes/${id}`);
    return data;
};

export const adminFileUrl = (quoteId, fileId) =>
    `${API_BASE}/admin/quotes/${quoteId}/files/${fileId}`;

export const listAdminMessages = async () => {
    const { data } = await api.get('/admin/messages');
    return data;
};
