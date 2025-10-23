import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';
import { useAuth } from '@/hooks/useAuth';

// Mock the useAuth hook
vi.mock('@/hooks/useAuth');
const mockedUseAuth = vi.mocked(useAuth);

describe('LoginForm', () => {
    const mockLogin = vi.fn();
    const mockOnSuccess = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockedUseAuth.mockReturnValue({
            user: null,
            isLoggedIn: false,
            isLoading: false,
            error: null,
            login: mockLogin,
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

    it('should render login form elements', () => {
        render(<LoginForm />);

        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
        expect(screen.getByText(/forgot your password?/i)).toBeInTheDocument();
        expect(screen.getByText(/don't have an account?/i)).toBeInTheDocument();
    });

    it('should handle form submission with valid data', async () => {
        const user = userEvent.setup();
        mockLogin.mockResolvedValueOnce(undefined);

        render(<LoginForm onSuccess={mockOnSuccess} />);

        const emailInput = screen.getByLabelText(/email address/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /sign in/i });

        await user.type(emailInput, 'john.doe@example.com');
        await user.type(passwordInput, 'Password123!');
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith({
                email: 'john.doe@example.com',
                password: 'Password123!'
            });
        });

        expect(mockOnSuccess).toHaveBeenCalled();
    });

    it('should display validation errors for empty fields', async () => {
        const user = userEvent.setup();

        render(<LoginForm />);

        const submitButton = screen.getByRole('button', { name: /sign in/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/email is required/i)).toBeInTheDocument();
            expect(screen.getByText(/password is required/i)).toBeInTheDocument();
        });

        expect(mockLogin).not.toHaveBeenCalled();
    });

    it('should display validation error for invalid email', async () => {
        const user = userEvent.setup();

        render(<LoginForm />);

        const emailInput = screen.getByLabelText(/email address/i);
        const submitButton = screen.getByRole('button', { name: /sign in/i });

        await user.type(emailInput, 'invalid-email');
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
        });

        expect(mockLogin).not.toHaveBeenCalled();
    });

    it('should display validation error for short password', async () => {
        const user = userEvent.setup();

        render(<LoginForm />);

        const emailInput = screen.getByLabelText(/email address/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /sign in/i });

        await user.type(emailInput, 'john.doe@example.com');
        await user.type(passwordInput, '123');
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/password must be at least 8 characters long/i)).toBeInTheDocument();
        });

        expect(mockLogin).not.toHaveBeenCalled();
    });

    it('should toggle password visibility', async () => {
        const user = userEvent.setup();

        render(<LoginForm />);

        const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
        const toggleButton = screen.getByRole('button', { name: /show password/i });

        // Initially password should be hidden
        expect(passwordInput.type).toBe('password');

        await user.click(toggleButton);

        // Password should now be visible
        expect(passwordInput.type).toBe('text');
        expect(screen.getByRole('button', { name: /hide password/i })).toBeInTheDocument();

        await user.click(toggleButton);

        // Password should be hidden again
        expect(passwordInput.type).toBe('password');
    });

    it('should display login error', () => {
        const loginError = new Error('Invalid credentials');
        mockedUseAuth.mockReturnValue({
            user: null,
            isLoggedIn: false,
            isLoading: false,
            error: null,
            login: mockLogin,
            register: vi.fn(),
            forgotPassword: vi.fn(),
            resetPassword: vi.fn(),
            logout: vi.fn(),
            isLoggingIn: false,
            isRegistering: false,
            isSendingResetEmail: false,
            isResettingPassword: false,
            isLoggingOut: false,
            loginError,
            registerError: null,
            forgotPasswordError: null,
            resetPasswordError: null,
            logoutError: null
        });

        render(<LoginForm />);

        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });

    it('should show loading state during login', () => {
        mockedUseAuth.mockReturnValue({
            user: null,
            isLoggedIn: false,
            isLoading: false,
            error: null,
            login: mockLogin,
            register: vi.fn(),
            forgotPassword: vi.fn(),
            resetPassword: vi.fn(),
            logout: vi.fn(),
            isLoggingIn: true,
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

        render(<LoginForm />);

        const submitButton = screen.getByRole('button', { name: /signing in/i });
        expect(submitButton).toBeDisabled();
        expect(screen.getByText(/signing in/i)).toBeInTheDocument();
    });

    it('should display test credentials in development', () => {
        // Mock development environment
        import.meta.env.DEV = true;

        render(<LoginForm />);

        expect(screen.getByText(/test credentials/i)).toBeInTheDocument();
        expect(screen.getByText(/john\.doe@example\.com/)).toBeInTheDocument();
        expect(screen.getByText(/admin@example\.com/)).toBeInTheDocument();
    });
});
