import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CheckCircle, Loader2, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/utils/validation';
import { useAuth } from '@/hooks/useAuth';

interface ForgotPasswordFormProps {
    onSuccess?: () => void;
}

export const ForgotPasswordForm = ({ onSuccess }: ForgotPasswordFormProps) => {
    const { forgotPassword, isSendingResetEmail, forgotPasswordError } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitSuccessful }
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: ''
        }
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        try {
            await forgotPassword(data);
            onSuccess?.();
        } catch (error) {
            // Error is handled by the mutation
            console.error('Forgot password error:', error);
        }
    };

    if (isSubmitSuccessful && !forgotPasswordError) {
        return (
            <div className='text-center space-y-4'>
                <div className='mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center'>
                    <CheckCircle className='h-6 w-6 text-green-600 dark:text-green-400' />
                </div>
                <div>
                    <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>Email Sent!</h3>
                    <p className='text-sm text-gray-600 dark:text-gray-400 mt-2'>
                        We've sent password reset instructions to your email address. Please check your inbox and follow
                        the link to reset your password.
                    </p>
                </div>
                <div className='space-y-2'>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                        Didn't receive the email? Check your spam folder or try again.
                    </p>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => window.location.reload()}
                        className='w-full'
                    >
                        <Mail className='mr-2 h-4 w-4' />
                        Resend Email
                    </Button>
                </div>
                <Link to='/login'>
                    <Button
                        variant='ghost'
                        size='sm'
                        className='w-full'
                    >
                        <ArrowLeft className='mr-2 h-4 w-4' />
                        Back to Sign In
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-4'
        >
            {forgotPasswordError && (
                <Alert variant='destructive'>
                    <AlertDescription>
                        {forgotPasswordError instanceof Error
                            ? forgotPasswordError.message
                            : 'Failed to send reset email. Please try again.'}
                    </AlertDescription>
                </Alert>
            )}

            <div className='space-y-2'>
                <Label htmlFor='email'>Email Address</Label>
                <Input
                    id='email'
                    type='email'
                    placeholder='Enter your email address'
                    autoComplete='email'
                    {...register('email')}
                    className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className='text-sm text-red-600 dark:text-red-400'>{errors.email.message}</p>}
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                    We'll send password reset instructions to this email address.
                </p>
            </div>

            <Button
                type='submit'
                className='w-full'
                disabled={isSendingResetEmail}
            >
                {isSendingResetEmail ? (
                    <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Sending...
                    </>
                ) : (
                    <>
                        <Mail className='mr-2 h-4 w-4' />
                        Send Reset Instructions
                    </>
                )}
            </Button>

            <div className='text-center'>
                <Link to='/login'>
                    <Button
                        variant='ghost'
                        size='sm'
                        className='w-full'
                    >
                        <ArrowLeft className='mr-2 h-4 w-4' />
                        Back to Sign In
                    </Button>
                </Link>
            </div>
        </form>
    );
};
