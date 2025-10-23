import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { ForgotPasswordForm } from '@/components/forms/ForgotPasswordForm';
import { useAuth } from '@/hooks/useAuth';

export const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/dashboard', { replace: true });
        }
    }, [isLoggedIn, navigate]);

    const handleForgotPasswordSuccess = () => {
        // Form handles success state internally
    };

    return (
        <AuthLayout
            title='Reset your password'
            description="Enter your email address and we'll send you instructions to reset your password"
        >
            <ForgotPasswordForm onSuccess={handleForgotPasswordSuccess} />
        </AuthLayout>
    );
};
