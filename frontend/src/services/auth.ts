import { mockAuthResponse, mockAdminAuthResponse } from '@/data/authMockData';
import { api, clearAuthData, getStoredRefreshToken, setAuthData } from '@/lib/api';
import { mockApiDelay } from '@/lib/utils';
import type { AuthResponse } from '@/types/user';
import type { LoginCredentials, RegisterData, ForgotPasswordData } from '@/types/auth';

export const authService = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: login ---', credentials);
            await mockApiDelay();

            // Mock admin login
            if (credentials.email === 'admin@example.com') {
                return mockAdminAuthResponse;
            }

            // Mock user login - simulate wrong credentials
            if (credentials.email !== 'john.doe@example.com' || credentials.password !== 'Password123!') {
                throw new Error('Invalid email or password');
            }

            return mockAuthResponse;
        }

        const response = await api.post('/auth/login', credentials);
        setAuthData(response.data);
        return response.data;
    },

    register: async (userData: RegisterData): Promise<AuthResponse> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: register ---', userData);
            await mockApiDelay();

            // Mock email already exists error
            if (userData.email === 'existing@example.com') {
                throw new Error('Email already exists');
            }

            return {
                ...mockAuthResponse,
                user: {
                    ...mockAuthResponse.user,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    phone: userData.phone
                }
            };
        }

        const response = await api.post('/auth/register', userData);
        setAuthData(response.data);
        return response.data;
    },

    forgotPassword: async (data: ForgotPasswordData): Promise<{ message: string }> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: forgotPassword ---', data);
            await mockApiDelay();
            return { message: 'Password reset email sent successfully' };
        }

        const response = await api.post('/auth/forgot-password', data);
        return response.data;
    },

    resetPassword: async (token: string, password: string): Promise<{ message: string }> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: resetPassword ---', { token });
            await mockApiDelay();
            return { message: 'Password reset successfully' };
        }

        const response = await api.post('/auth/reset-password', { token, password });
        return response.data;
    },

    refreshToken: async (): Promise<AuthResponse> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: refreshToken ---');
            await mockApiDelay();
            return mockAuthResponse;
        }

        const response = await api.post('/auth/refresh');
        setAuthData(response.data);
        return response.data;
    },

    logout: async (): Promise<void> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: logout ---');
            await mockApiDelay();
            clearAuthData();
            return;
        }

        const refreshToken = getStoredRefreshToken();
        if (refreshToken) {
            await api.post('/auth/logout', { refreshToken });
        }
        clearAuthData();
    }
};
