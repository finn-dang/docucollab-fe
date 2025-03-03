import axios from 'axios';
import axiosInstance from './axios';

export const auth = {
    login: async (email: string, password: string, rememberMe: boolean) => {
        const response = await axios.post(
            'http://localhost:3000/administration/auth/login',
            { email, password, rememberMe }
        );

        const { accessToken, refreshToken, user } = response.data.data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        return response.data;
    },

    logout: async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            try {
                await axiosInstance.post('/administration/auth/logout', { refreshToken });
            } catch (error) {
                console.error('Logout error:', error);
            }
        }
        localStorage.clear();
    },

    isAuthenticated: () => {
        const token = localStorage.getItem('accessToken');
        return !!token;
    },

    getAccessToken: () => localStorage.getItem('accessToken'),

    getRefreshToken: () => localStorage.getItem('refreshToken'),

    getUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },
};