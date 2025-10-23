import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
        useLocation: vi.fn()
    };
});

// Mock the useAuth hook
vi.mock('@/hooks/useAuth');

const mockedUseNavigate = vi.mocked(useNavigate);
const mockedUseLocation = vi.mocked(useLocation);
const mockedUseAuth = vi.mocked(useAuth);

describe('ProtectedRoute', () => {
    const mockNavigate = vi.fn();
    const mockLocation = { pathname: '/dashboard', search: '', hash: '', state: null, key: 'default' };

    beforeEach(() => {
        vi.clearAllMocks();
        mockedUseNavigate.mockReturnValue(mockNavigate);
        mockedUseLocation.mockReturnValue(mockLocation);
    });

    it('should render children when user is authenticated', () => {
        mockedUseAuth.mockReturnValue({
            user: { id: '1', email: 'test@example.com' } as any,
            isLoggedIn: true,
            isLoading: false,
            error: null,
            login: vi.fn(),
            register: vi.fn(),
            forgotPassword: vi.fn(),
            resetPassword: vi.fn(),
            logout: vi.fn(),
            isLoggingIn: false,
            isRegistering: false,
            isSendingResetEmail: false,
            isResettingPassword: false,
            isLoggingOut: false,
            loginError: null,
            registerError: null,
            forgotPasswordError: null,
            resetPasswordError: null,
            logoutError: null
        });

        render(
            <ProtectedRoute>
                <div data-testid='protected-content'>Protected Content</div>
            </ProtectedRoute>
        );

        expect(screen.getByTestId('protected-content')).toBeInTheDocument();
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should show loading state when authentication is loading', () => {
        mockedUseAuth.mockReturnValue({
            user: null,
            isLoggedIn: false,
            isLoading: true,
            error: null,
            login: vi.fn(),
            register: vi.fn(),
            forgotPassword: vi.fn(),
            resetPassword: vi.fn(),
            logout: vi.fn(),
            isLoggingIn: false,
            isRegistering: false,
            isSendingResetEmail: false,
            isResettingPassword: false,
            isLoggingOut: false,
            loginError: null,
            registerError: null,
            forgotPasswordError: null,
            resetPasswordError: null,
            logoutError: null
        });

        render(
            <ProtectedRoute>
                <div data-testid='protected-content'>Protected Content</div>
            </ProtectedRoute>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();
        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should redirect to login when user is not authenticated', () => {
        mockedUseAuth.mockReturnValue({
            user: null,
            isLoggedIn: false,
            isLoading: false,
            error: null,
            login: vi.fn(),
            register: vi.fn(),
            forgotPassword: vi.fn(),
            resetPassword: vi.fn(),
            logout: vi.fn(),
            isLoggingIn: false,
            isRegistering: false,
            isSendingResetEmail: false,
            isResettingPassword: false,
            isLoggingOut: false,
            loginError: null,
            registerError: null,
            forgotPasswordError: null,
            resetPasswordError: null,
            logoutError: null
        });

        const TestComponent = () => (
            <ProtectedRoute>
                <div data-testid='protected-content'>Protected Content</div>
            </ProtectedRoute>
        );

        // We can't easily test Navigate component behavior in this setup,
        // but we can verify the component doesn't render protected content
        render(<TestComponent />);

        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });
});
