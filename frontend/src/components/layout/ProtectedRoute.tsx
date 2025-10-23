import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isLoggedIn, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-center'>
                    <Loader2 className='h-8 w-8 animate-spin mx-auto mb-4' />
                    <p className='text-gray-600 dark:text-gray-400'>Loading...</p>
                </div>
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <Navigate
                to='/login'
                state={{ from: location }}
                replace
            />
        );
    }

    return <>{children}</>;
};
