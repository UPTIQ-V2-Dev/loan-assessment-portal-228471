import type { AuthResponse, User } from '@/types/user';

export const mockUser: User = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    role: 'USER',
    isActive: true,
    isEmailVerified: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
};

export const mockAuthResponse: AuthResponse = {
    user: mockUser,
    tokens: {
        access: {
            token: 'mock-access-token-12345',
            expires: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes
        },
        refresh: {
            token: 'mock-refresh-token-67890',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        }
    }
};

export const mockAdminUser: User = {
    ...mockUser,
    id: '2',
    email: 'admin@example.com',
    role: 'ADMIN',
    firstName: 'Admin',
    lastName: 'User'
};

export const mockAdminAuthResponse: AuthResponse = {
    user: mockAdminUser,
    tokens: {
        access: {
            token: 'mock-admin-access-token-12345',
            expires: new Date(Date.now() + 15 * 60 * 1000).toISOString()
        },
        refresh: {
            token: 'mock-admin-refresh-token-67890',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
    }
};
