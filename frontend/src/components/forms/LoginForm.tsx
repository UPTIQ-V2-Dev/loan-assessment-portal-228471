import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { loginSchema, type LoginFormData } from '@/utils/validation';
import { useAuth } from '@/hooks/useAuth';

interface LoginFormProps {
    onSuccess?: () => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoggingIn, loginError } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            await login(data);
            onSuccess?.();
        } catch (error) {
            // Error is handled by the mutation
            console.error('Login error:', error);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-4'
        >
            {loginError && (
                <Alert variant='destructive'>
                    <AlertDescription>
                        {loginError instanceof Error ? loginError.message : 'Login failed. Please try again.'}
                    </AlertDescription>
                </Alert>
            )}

            <div className='space-y-2'>
                <Label htmlFor='email'>Email Address</Label>
                <Input
                    id='email'
                    type='email'
                    placeholder='john.doe@example.com'
                    autoComplete='email'
                    {...register('email')}
                    className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className='text-sm text-red-600 dark:text-red-400'>{errors.email.message}</p>}
            </div>

            <div className='space-y-2'>
                <Label htmlFor='password'>Password</Label>
                <div className='relative'>
                    <Input
                        id='password'
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Enter your password'
                        autoComplete='current-password'
                        {...register('password')}
                        className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                    />
                    <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <EyeOff className='h-4 w-4 text-gray-500' />
                        ) : (
                            <Eye className='h-4 w-4 text-gray-500' />
                        )}
                        <span className='sr-only'>{showPassword ? 'Hide password' : 'Show password'}</span>
                    </Button>
                </div>
                {errors.password && <p className='text-sm text-red-600 dark:text-red-400'>{errors.password.message}</p>}
            </div>

            <div className='flex items-center justify-between'>
                <Link
                    to='/forgot-password'
                    className='text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline'
                >
                    Forgot your password?
                </Link>
            </div>

            <Button
                type='submit'
                className='w-full'
                disabled={isLoggingIn}
            >
                {isLoggingIn ? (
                    <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Signing in...
                    </>
                ) : (
                    'Sign in'
                )}
            </Button>

            <div className='text-center'>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                    Don't have an account?{' '}
                    <Link
                        to='/register'
                        className='text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline'
                    >
                        Sign up
                    </Link>
                </p>
            </div>

            {/* Development helper */}
            {import.meta.env.DEV && (
                <div className='mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                    <p className='text-xs text-gray-600 dark:text-gray-400 mb-2'>Test Credentials:</p>
                    <div className='text-xs text-gray-500 dark:text-gray-500 space-y-1'>
                        <div>User: john.doe@example.com / Password123!</div>
                        <div>Admin: admin@example.com / Password123!</div>
                    </div>
                </div>
            )}
        </form>
    );
};
