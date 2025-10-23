import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { server } from '@/__mocks__/server';
import { http, HttpResponse } from 'msw';
import { authService } from './auth';
import { mockAuthResponse } from '@/data/authMockData';

// Mock the utils
vi.mock('@/lib/utils', () => ({
    mockApiDelay: vi.fn(() => Promise.resolve())
}));

describe('AuthService', () => {
    beforeEach(() => {
        // Set mock data mode
        import.meta.env.VITE_USE_MOCK_DATA = 'true';
        localStorage.clear();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('login', () => {
        it('should login successfully with valid credentials', async () => {
            const credentials = {
                email: 'john.doe@example.com',
                password: 'Password123!'
            };

            const result = await authService.login(credentials);

            expect(result).toEqual(mockAuthResponse);
            expect(result.user.email).toBe(credentials.email);
        });

        it('should throw error for invalid credentials', async () => {
            const credentials = {
                email: 'wrong@example.com',
                password: 'wrongpassword'
            };

            await expect(authService.login(credentials)).rejects.toThrow('Invalid email or password');
        });

        it('should handle admin login', async () => {
            const credentials = {
                email: 'admin@example.com',
                password: 'Password123!'
            };

            const result = await authService.login(credentials);

            expect(result.user.role).toBe('ADMIN');
            expect(result.user.email).toBe(credentials.email);
        });
    });

    describe('register', () => {
        it('should register successfully with valid data', async () => {
            const userData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'new.user@example.com',
                phone: '+1234567890',
                password: 'Password123!',
                confirmPassword: 'Password123!',
                acceptTerms: true
            };

            const result = await authService.register(userData);

            expect(result.user.firstName).toBe(userData.firstName);
            expect(result.user.lastName).toBe(userData.lastName);
            expect(result.user.email).toBe(userData.email);
            expect(result.user.phone).toBe(userData.phone);
        });

        it('should throw error for existing email', async () => {
            const userData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'existing@example.com',
                password: 'Password123!',
                confirmPassword: 'Password123!',
                acceptTerms: true
            };

            await expect(authService.register(userData)).rejects.toThrow('Email already exists');
        });
    });

    describe('forgotPassword', () => {
        it('should send forgot password email successfully', async () => {
            const data = { email: 'john.doe@example.com' };

            const result = await authService.forgotPassword(data);

            expect(result).toEqual({ message: 'Password reset email sent successfully' });
        });
    });

    describe('resetPassword', () => {
        it('should reset password successfully', async () => {
            const token = 'reset-token-123';
            const password = 'NewPassword123!';

            const result = await authService.resetPassword(token, password);

            expect(result).toEqual({ message: 'Password reset successfully' });
        });
    });

    describe('logout', () => {
        it('should logout successfully', async () => {
            // Set some mock data in localStorage
            localStorage.setItem('auth_token', 'mock-token');
            localStorage.setItem('user_data', JSON.stringify(mockAuthResponse.user));

            await authService.logout();

            // Check that localStorage was cleared
            expect(localStorage.getItem('auth_token')).toBeNull();
            expect(localStorage.getItem('user_data')).toBeNull();
        });
    });

    describe('with real API', () => {
        beforeEach(() => {
            import.meta.env.VITE_USE_MOCK_DATA = 'false';
        });

        it('should handle successful login with real API', async () => {
            server.use(
                http.post('/api/v1/auth/login', () => {
                    return HttpResponse.json(mockAuthResponse);
                })
            );

            const credentials = {
                email: 'john.doe@example.com',
                password: 'Password123!'
            };

            const result = await authService.login(credentials);

            expect(result).toEqual(mockAuthResponse);
        });

        it('should handle API errors', async () => {
            server.use(
                http.post('/api/v1/auth/login', () => {
                    return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
                })
            );

            const credentials = {
                email: 'wrong@example.com',
                password: 'wrongpassword'
            };

            await expect(authService.login(credentials)).rejects.toThrow();
        });
    });
});
