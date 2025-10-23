import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth';
import { getStoredUser, isAuthenticated, clearAuthData } from '@/lib/api';
import type { LoginCredentials, RegisterData, ForgotPasswordData } from '@/types/auth';
import type { User } from '@/types/user';

export const useAuth = () => {
    const queryClient = useQueryClient();

    // Get current user
    const {
        data: user,
        isLoading: isLoadingUser,
        error: userError
    } = useQuery({
        queryKey: ['auth', 'user'],
        queryFn: () => {
            const storedUser = getStoredUser();
            return storedUser;
        },
        staleTime: 5 * 60 * 1000 // 5 minutes
    });

    const isLoggedIn = isAuthenticated();

    // Login mutation
    const loginMutation = useMutation({
        mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
        onSuccess: data => {
            queryClient.setQueryData(['auth', 'user'], data.user);
            queryClient.invalidateQueries({ queryKey: ['auth'] });
        },
        onError: error => {
            console.error('Login failed:', error);
        }
    });

    // Register mutation
    const registerMutation = useMutation({
        mutationFn: (userData: RegisterData) => authService.register(userData),
        onSuccess: data => {
            queryClient.setQueryData(['auth', 'user'], data.user);
            queryClient.invalidateQueries({ queryKey: ['auth'] });
        },
        onError: error => {
            console.error('Registration failed:', error);
        }
    });

    // Forgot password mutation
    const forgotPasswordMutation = useMutation({
        mutationFn: (data: ForgotPasswordData) => authService.forgotPassword(data),
        onError: error => {
            console.error('Forgot password failed:', error);
        }
    });

    // Reset password mutation
    const resetPasswordMutation = useMutation({
        mutationFn: ({ token, password }: { token: string; password: string }) =>
            authService.resetPassword(token, password),
        onError: error => {
            console.error('Reset password failed:', error);
        }
    });

    // Logout mutation
    const logoutMutation = useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            queryClient.setQueryData(['auth', 'user'], null);
            queryClient.clear();
        },
        onError: error => {
            console.error('Logout failed:', error);
            // Clear auth data anyway in case of error
            clearAuthData();
            queryClient.setQueryData(['auth', 'user'], null);
            queryClient.clear();
        }
    });

    const login = (credentials: LoginCredentials) => {
        return loginMutation.mutateAsync(credentials);
    };

    const register = (userData: RegisterData) => {
        return registerMutation.mutateAsync(userData);
    };

    const forgotPassword = (data: ForgotPasswordData) => {
        return forgotPasswordMutation.mutateAsync(data);
    };

    const resetPassword = (token: string, password: string) => {
        return resetPasswordMutation.mutateAsync({ token, password });
    };

    const logout = () => {
        return logoutMutation.mutateAsync();
    };

    return {
        user: user as User | null,
        isLoggedIn,
        isLoading: isLoadingUser,
        error: userError,

        // Actions
        login,
        register,
        forgotPassword,
        resetPassword,
        logout,

        // Mutation states
        isLoggingIn: loginMutation.isPending,
        isRegistering: registerMutation.isPending,
        isSendingResetEmail: forgotPasswordMutation.isPending,
        isResettingPassword: resetPasswordMutation.isPending,
        isLoggingOut: logoutMutation.isPending,

        // Errors
        loginError: loginMutation.error,
        registerError: registerMutation.error,
        forgotPasswordError: forgotPasswordMutation.error,
        resetPasswordError: resetPasswordMutation.error,
        logoutError: logoutMutation.error
    };
};
