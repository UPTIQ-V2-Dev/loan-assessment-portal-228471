import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { registerSchema, type RegisterFormData } from '@/utils/validation';
import { useAuth } from '@/hooks/useAuth';

interface RegisterFormProps {
    onSuccess?: () => void;
}

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register: registerUser, isRegistering, registerError } = useAuth();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
            acceptTerms: false
        }
    });

    const acceptTerms = watch('acceptTerms');

    const onSubmit = async (data: RegisterFormData) => {
        try {
            await registerUser(data);
            onSuccess?.();
        } catch (error) {
            // Error is handled by the mutation
            console.error('Registration error:', error);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-4'
        >
            {registerError && (
                <Alert variant='destructive'>
                    <AlertDescription>
                        {registerError instanceof Error
                            ? registerError.message
                            : 'Registration failed. Please try again.'}
                    </AlertDescription>
                </Alert>
            )}

            <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                    <Label htmlFor='firstName'>First Name</Label>
                    <Input
                        id='firstName'
                        type='text'
                        placeholder='John'
                        autoComplete='given-name'
                        {...register('firstName')}
                        className={errors.firstName ? 'border-red-500' : ''}
                    />
                    {errors.firstName && (
                        <p className='text-sm text-red-600 dark:text-red-400'>{errors.firstName.message}</p>
                    )}
                </div>

                <div className='space-y-2'>
                    <Label htmlFor='lastName'>Last Name</Label>
                    <Input
                        id='lastName'
                        type='text'
                        placeholder='Doe'
                        autoComplete='family-name'
                        {...register('lastName')}
                        className={errors.lastName ? 'border-red-500' : ''}
                    />
                    {errors.lastName && (
                        <p className='text-sm text-red-600 dark:text-red-400'>{errors.lastName.message}</p>
                    )}
                </div>
            </div>

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
                <Label htmlFor='phone'>Phone Number (Optional)</Label>
                <Input
                    id='phone'
                    type='tel'
                    placeholder='+1 (555) 123-4567'
                    autoComplete='tel'
                    {...register('phone')}
                    className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && <p className='text-sm text-red-600 dark:text-red-400'>{errors.phone.message}</p>}
            </div>

            <div className='space-y-2'>
                <Label htmlFor='password'>Password</Label>
                <div className='relative'>
                    <Input
                        id='password'
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Enter your password'
                        autoComplete='new-password'
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

            <div className='space-y-2'>
                <Label htmlFor='confirmPassword'>Confirm Password</Label>
                <div className='relative'>
                    <Input
                        id='confirmPassword'
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder='Confirm your password'
                        autoComplete='new-password'
                        {...register('confirmPassword')}
                        className={errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
                    />
                    <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? (
                            <EyeOff className='h-4 w-4 text-gray-500' />
                        ) : (
                            <Eye className='h-4 w-4 text-gray-500' />
                        )}
                        <span className='sr-only'>{showConfirmPassword ? 'Hide password' : 'Show password'}</span>
                    </Button>
                </div>
                {errors.confirmPassword && (
                    <p className='text-sm text-red-600 dark:text-red-400'>{errors.confirmPassword.message}</p>
                )}
            </div>

            <div className='flex items-center space-x-2'>
                <Checkbox
                    id='acceptTerms'
                    checked={acceptTerms}
                    onCheckedChange={checked => setValue('acceptTerms', !!checked)}
                />
                <Label
                    htmlFor='acceptTerms'
                    className='text-sm font-normal cursor-pointer'
                >
                    I agree to the{' '}
                    <Link
                        to='/terms'
                        className='text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link
                        to='/privacy'
                        className='text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        Privacy Policy
                    </Link>
                </Label>
            </div>
            {errors.acceptTerms && (
                <p className='text-sm text-red-600 dark:text-red-400'>{errors.acceptTerms.message}</p>
            )}

            <Button
                type='submit'
                className='w-full'
                disabled={isRegistering}
            >
                {isRegistering ? (
                    <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Creating account...
                    </>
                ) : (
                    'Create account'
                )}
            </Button>

            <div className='text-center'>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                    Already have an account?{' '}
                    <Link
                        to='/login'
                        className='text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline'
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </form>
    );
};
