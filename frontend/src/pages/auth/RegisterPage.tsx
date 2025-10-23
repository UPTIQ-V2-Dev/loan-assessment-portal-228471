import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { RegisterForm } from '@/components/forms/RegisterForm';
import { useAuth } from '@/hooks/useAuth';

export const RegisterPage = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/dashboard', { replace: true });
        }
    }, [isLoggedIn, navigate]);

    const handleRegisterSuccess = () => {
        navigate('/dashboard', { replace: true });
    };

    return (
        <AuthLayout
            title='Create your account'
            description='Get started with your loan application journey'
        >
            <RegisterForm onSuccess={handleRegisterSuccess} />
        </AuthLayout>
    );
};
