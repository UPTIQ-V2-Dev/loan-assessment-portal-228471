import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { LoginForm } from '@/components/forms/LoginForm';
import { useAuth } from '@/hooks/useAuth';

export const LoginPage = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/dashboard', { replace: true });
        }
    }, [isLoggedIn, navigate]);

    const handleLoginSuccess = () => {
        navigate('/dashboard', { replace: true });
    };

    return (
        <AuthLayout
            title='Welcome back'
            description='Sign in to your account to continue'
        >
            <LoginForm onSuccess={handleLoginSuccess} />
        </AuthLayout>
    );
};
