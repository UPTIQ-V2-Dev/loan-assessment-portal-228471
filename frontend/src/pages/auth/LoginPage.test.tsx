import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { useNavigate } from 'react-router-dom';
import { LoginPage } from './LoginPage';
import { useAuth } from '@/hooks/useAuth';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn()
    };
});

// Mock the useAuth hook
vi.mock('@/hooks/useAuth');

const mockedUseNavigate = vi.mocked(useNavigate);
const mockedUseAuth = vi.mocked(useAuth);

describe('LoginPage', () => {
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockedUseNavigate.mockReturnValue(mockNavigate);
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
    });

    it('should render login page with correct title and description', () => {
        render(<LoginPage />);

        expect(screen.getByText('Welcome back')).toBeInTheDocument();
        expect(screen.getByText('Sign in to your account to continue')).toBeInTheDocument();
        expect(screen.getByText('Loan Assessment Portal')).toBeInTheDocument();
        expect(screen.getByText('Streamline your loan application process')).toBeInTheDocument();
    });

    it('should render login form', () => {
        render(<LoginPage />);

        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('should redirect to dashboard when already logged in', () => {
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

        render(<LoginPage />);

        expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });

    it('should have links to register and forgot password pages', () => {
        render(<LoginPage />);

        expect(screen.getByRole('link', { name: /sign up/i })).toHaveAttribute('href', '/register');
        expect(screen.getByRole('link', { name: /forgot your password/i })).toHaveAttribute('href', '/forgot-password');
    });

    it('should display footer text', () => {
        render(<LoginPage />);

        expect(screen.getByText(/© 2024 Loan Assessment Portal. All rights reserved./)).toBeInTheDocument();
    });
});
