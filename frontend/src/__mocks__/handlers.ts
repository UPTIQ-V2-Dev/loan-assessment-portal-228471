import { http, HttpResponse } from 'msw';
import { mockAuthResponse, mockAdminAuthResponse } from '@/data/authMockData';

export const handlers = [
    // Auth endpoints
    http.post('/api/v1/auth/login', async ({ request }) => {
        const body = (await request.json()) as { email: string; password: string };

        // Mock admin login
        if (body.email === 'admin@example.com' && body.password === 'Password123!') {
            return HttpResponse.json(mockAdminAuthResponse);
        }

        // Mock user login
        if (body.email === 'john.doe@example.com' && body.password === 'Password123!') {
            return HttpResponse.json(mockAuthResponse);
        }

        // Invalid credentials
        return HttpResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }),

    http.post('/api/v1/auth/register', async ({ request }) => {
        const body = (await request.json()) as {
            firstName: string;
            lastName: string;
            email: string;
            phone?: string;
            password: string;
        };

        // Mock email already exists
        if (body.email === 'existing@example.com') {
            return HttpResponse.json({ message: 'Email already exists' }, { status: 400 });
        }

        // Successful registration
        return HttpResponse.json({
            ...mockAuthResponse,
            user: {
                ...mockAuthResponse.user,
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                phone: body.phone
            }
        });
    }),

    http.post('/api/v1/auth/forgot-password', () => {
        return HttpResponse.json({ message: 'Password reset email sent successfully' });
    }),

    http.post('/api/v1/auth/reset-password', () => {
        return HttpResponse.json({ message: 'Password reset successfully' });
    }),

    http.post('/api/v1/auth/refresh', () => {
        return HttpResponse.json(mockAuthResponse);
    }),

    http.post('/api/v1/auth/logout', () => {
        return HttpResponse.json({ message: 'Logged out successfully' });
    })
];
