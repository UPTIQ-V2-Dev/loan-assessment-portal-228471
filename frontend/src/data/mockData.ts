import type { PaginatedResponse } from '@/types/api';
import type { AuthResponse, User } from '@/types/user';

export const mockUser: User = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'user@example.com',
    phone: '+1234567890',
    role: 'USER',
    isActive: true,
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

export const mockAdminUser: User = {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'admin@example.com',
    phone: '+1987654321',
    role: 'ADMIN',
    isActive: true,
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

export const mockUsers: User[] = [mockUser, mockAdminUser];

export const mockAuthResponse: AuthResponse = {
    user: mockUser,
    tokens: {
        access: {
            token: 'mock-access-token',
            expires: new Date(Date.now() + 15 * 60 * 1000).toISOString()
        },
        refresh: {
            token: 'mock-refresh-token',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
    }
};

export const mockPaginatedUsers: PaginatedResponse<User> = {
    results: mockUsers,
    page: 1,
    limit: 10,
    totalPages: 1,
    totalResults: 2
};
