import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    description?: string;
    className?: string;
}

export const AuthLayout = ({ children, title, description, className }: AuthLayoutProps) => {
    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4'>
            <div className='w-full max-w-md'>
                <div className='text-center mb-8'>
                    <div className='mx-auto h-12 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4'>
                        <svg
                            className='h-6 w-6 text-white'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                            />
                        </svg>
                    </div>
                    <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>Loan Assessment Portal</h1>
                    <p className='text-gray-600 dark:text-gray-400 mt-2'>Streamline your loan application process</p>
                </div>

                <Card className={cn('shadow-xl border-0', className)}>
                    <CardHeader className='space-y-1'>
                        <CardTitle className='text-2xl font-semibold tracking-tight'>{title}</CardTitle>
                        {description && (
                            <CardDescription className='text-sm text-gray-600 dark:text-gray-400'>
                                {description}
                            </CardDescription>
                        )}
                    </CardHeader>
                    <CardContent className='grid gap-6'>{children}</CardContent>
                </Card>

                <div className='text-center mt-6'>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                        © 2024 Loan Assessment Portal. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};
