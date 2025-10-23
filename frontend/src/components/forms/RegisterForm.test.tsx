import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { RegisterForm } from './RegisterForm';
import { useAuth } from '@/hooks/useAuth';

// Mock the useAuth hook
vi.mock('@/hooks/useAuth');
const mockedUseAuth = vi.mocked(useAuth);

describe('RegisterForm', () => {
    const mockRegister = vi.fn();
    const mockOnSuccess = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockedUseAuth.mockReturnValue({
            user: null,
            isLoggedIn: false,
            isLoading: false,
            error: null,
            login: vi.fn(),
            register: mockRegister,
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

    it('should render registration form elements', () => {
        render(<RegisterForm />);

        expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
        expect(screen.getByRole('checkbox', { name: /terms of service/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
        expect(screen.getByText(/already have an account?/i)).toBeInTheDocument();
    });

    it('should handle form submission with valid data', async () => {
        const user = userEvent.setup();
        mockRegister.mockResolvedValueOnce(undefined);

        render(<RegisterForm onSuccess={mockOnSuccess} />);

        // Fill out the form
        await user.type(screen.getByLabelText(/first name/i), 'John');
        await user.type(screen.getByLabelText(/last name/i), 'Doe');
        await user.type(screen.getByLabelText(/email address/i), 'john.doe@example.com');
        await user.type(screen.getByLabelText(/phone number/i), '+1234567890');
        await user.type(screen.getByLabelText(/^password$/i), 'Password123!');
        await user.type(screen.getByLabelText(/confirm password/i), 'Password123!');
        await user.click(screen.getByRole('checkbox', { name: /terms of service/i }));
        await user.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledWith({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '+1234567890',
                password: 'Password123!',
                confirmPassword: 'Password123!',
                acceptTerms: true
            });
        });

        expect(mockOnSuccess).toHaveBeenCalled();
    });

    it('should display validation errors for empty required fields', async () => {
        const user = userEvent.setup();

        render(<RegisterForm />);

        const submitButton = screen.getByRole('button', { name: /create account/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
            expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
            expect(screen.getByText(/email is required/i)).toBeInTheDocument();
            expect(screen.getByText(/password is required/i)).toBeInTheDocument();
            expect(screen.getByText(/please confirm your password/i)).toBeInTheDocument();
            expect(screen.getByText(/you must accept the terms and conditions/i)).toBeInTheDocument();
        });

        expect(mockRegister).not.toHaveBeenCalled();
    });

    it('should validate password requirements', async () => {
        const user = userEvent.setup();

        render(<RegisterForm />);

        const passwordInput = screen.getByLabelText(/^password$/i);
        await user.type(passwordInput, 'weak');

        const submitButton = screen.getByRole('button', { name: /create account/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/password must be at least 8 characters long/i)).toBeInTheDocument();
        });
    });

    it('should validate password confirmation match', async () => {
        const user = userEvent.setup();

        render(<RegisterForm />);

        await user.type(screen.getByLabelText(/first name/i), 'John');
        await user.type(screen.getByLabelText(/last name/i), 'Doe');
        await user.type(screen.getByLabelText(/email address/i), 'john.doe@example.com');
        await user.type(screen.getByLabelText(/^password$/i), 'Password123!');
        await user.type(screen.getByLabelText(/confirm password/i), 'DifferentPassword123!');
        await user.click(screen.getByRole('checkbox', { name: /terms of service/i }));

        const submitButton = screen.getByRole('button', { name: /create account/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
        });

        expect(mockRegister).not.toHaveBeenCalled();
    });

    it('should validate email format', async () => {
        const user = userEvent.setup();

        render(<RegisterForm />);

        const emailInput = screen.getByLabelText(/email address/i);
        await user.type(emailInput, 'invalid-email');

        const submitButton = screen.getByRole('button', { name: /create account/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
        });

        expect(mockRegister).not.toHaveBeenCalled();
    });

    it('should validate phone number format', async () => {
        const user = userEvent.setup();

        render(<RegisterForm />);

        const phoneInput = screen.getByLabelText(/phone number/i);
        await user.type(phoneInput, '123'); // Too short

        const submitButton = screen.getByRole('button', { name: /create account/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/please enter a valid phone number/i)).toBeInTheDocument();
        });

        expect(mockRegister).not.toHaveBeenCalled();
    });

    it('should toggle password visibility', async () => {
        const user = userEvent.setup();

        render(<RegisterForm />);

        const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i) as HTMLInputElement;

        const passwordToggle = screen.getAllByRole('button', { name: /show password/i })[0];
        const confirmPasswordToggle = screen.getAllByRole('button', { name: /show password/i })[1];

        // Initially passwords should be hidden
        expect(passwordInput.type).toBe('password');
        expect(confirmPasswordInput.type).toBe('password');

        await user.click(passwordToggle);
        expect(passwordInput.type).toBe('text');

        await user.click(confirmPasswordToggle);
        expect(confirmPasswordInput.type).toBe('text');
    });

    it('should display registration error', () => {
        const registerError = new Error('Email already exists');
        mockedUseAuth.mockReturnValue({
            user: null,
            isLoggedIn: false,
            isLoading: false,
            error: null,
            login: vi.fn(),
            register: mockRegister,
            forgotPassword: vi.fn(),
            resetPassword: vi.fn(),
            logout: vi.fn(),
            isLoggingIn: false,
            isRegistering: false,
            isSendingResetEmail: false,
            isResettingPassword: false,
            isLoggingOut: false,
            loginError: null,
            registerError,
            forgotPasswordError: null,
            resetPasswordError: null,
            logoutError: null
        });

        render(<RegisterForm />);

        expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
    });

    it('should show loading state during registration', () => {
        mockedUseAuth.mockReturnValue({
            user: null,
            isLoggedIn: false,
            isLoading: false,
            error: null,
            login: vi.fn(),
            register: mockRegister,
            forgotPassword: vi.fn(),
            resetPassword: vi.fn(),
            logout: vi.fn(),
            isLoggingIn: false,
            isRegistering: true,
            isSendingResetEmail: false,
            isResettingPassword: false,
            isLoggingOut: false,
            loginError: null,
            registerError: null,
            forgotPasswordError: null,
            resetPasswordError: null,
            logoutError: null
        });

        render(<RegisterForm />);

        const submitButton = screen.getByRole('button', { name: /creating account/i });
        expect(submitButton).toBeDisabled();
        expect(screen.getByText(/creating account/i)).toBeInTheDocument();
    });
});
