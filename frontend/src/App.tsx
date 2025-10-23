import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { DashboardPage } from '@/pages/DashboardPage';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: 1
        }
    }
});

export const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <BrowserRouter>
                    <div className='min-h-screen bg-background text-foreground'>
                        <Routes>
                            {/* Public routes */}
                            <Route
                                path='/login'
                                element={<LoginPage />}
                            />
                            <Route
                                path='/register'
                                element={<RegisterPage />}
                            />
                            <Route
                                path='/forgot-password'
                                element={<ForgotPasswordPage />}
                            />

                            {/* Protected routes */}
                            <Route
                                path='/dashboard'
                                element={
                                    <ProtectedRoute>
                                        <DashboardPage />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Default redirect */}
                            <Route
                                path='/'
                                element={
                                    <Navigate
                                        to='/dashboard'
                                        replace
                                    />
                                }
                            />
                            <Route
                                path='*'
                                element={
                                    <Navigate
                                        to='/dashboard'
                                        replace
                                    />
                                }
                            />
                        </Routes>
                        <Toaster />
                    </div>
                </BrowserRouter>
            </ThemeProvider>
        </QueryClientProvider>
    );
};
