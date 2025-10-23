import { LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
    const { user, logout, isLoggingOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <header className='bg-white dark:bg-gray-800 shadow'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex justify-between items-center py-6'>
                        <div>
                            <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Loan Assessment Portal</h1>
                            <p className='text-gray-600 dark:text-gray-400'>
                                Welcome back, {user?.firstName} {user?.lastName}
                            </p>
                        </div>
                        <Button
                            variant='outline'
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className='flex items-center gap-2'
                        >
                            <LogOut className='h-4 w-4' />
                            {isLoggingOut ? 'Signing out...' : 'Sign out'}
                        </Button>
                    </div>
                </div>
            </header>

            <main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
                <div className='px-4 py-6 sm:px-0'>
                    <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                        <Card>
                            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                <CardTitle className='text-sm font-medium'>Profile</CardTitle>
                                <User className='h-4 w-4 text-muted-foreground' />
                            </CardHeader>
                            <CardContent>
                                <div className='text-2xl font-bold'>
                                    {user?.firstName} {user?.lastName}
                                </div>
                                <p className='text-xs text-muted-foreground'>{user?.email}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                <CardTitle className='text-sm font-medium'>Role</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className='text-2xl font-bold'>{user?.role}</div>
                                <p className='text-xs text-muted-foreground'>Access level</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                <CardTitle className='text-sm font-medium'>Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className='text-2xl font-bold'>{user?.isActive ? 'Active' : 'Inactive'}</div>
                                <p className='text-xs text-muted-foreground'>Account status</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className='mt-8'>
                        <Card>
                            <CardHeader>
                                <CardTitle>Getting Started</CardTitle>
                                <CardDescription>
                                    Welcome to the Loan Assessment Portal. Here's what you can do:
                                </CardDescription>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <div className='grid gap-4 md:grid-cols-2'>
                                    <div className='p-4 border rounded-lg'>
                                        <h3 className='font-semibold mb-2'>Apply for a Loan</h3>
                                        <p className='text-sm text-muted-foreground mb-3'>
                                            Start your loan application process with our streamlined form.
                                        </p>
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            disabled
                                        >
                                            Coming Soon
                                        </Button>
                                    </div>

                                    <div className='p-4 border rounded-lg'>
                                        <h3 className='font-semibold mb-2'>View Applications</h3>
                                        <p className='text-sm text-muted-foreground mb-3'>
                                            Track the status of your existing loan applications.
                                        </p>
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            disabled
                                        >
                                            Coming Soon
                                        </Button>
                                    </div>

                                    <div className='p-4 border rounded-lg'>
                                        <h3 className='font-semibold mb-2'>Assessment Tools</h3>
                                        <p className='text-sm text-muted-foreground mb-3'>
                                            Access risk assessment and evaluation tools.
                                        </p>
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            disabled
                                        >
                                            Coming Soon
                                        </Button>
                                    </div>

                                    <div className='p-4 border rounded-lg'>
                                        <h3 className='font-semibold mb-2'>Reports & Analytics</h3>
                                        <p className='text-sm text-muted-foreground mb-3'>
                                            View detailed reports and analytics on loan performance.
                                        </p>
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            disabled
                                        >
                                            Coming Soon
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};
