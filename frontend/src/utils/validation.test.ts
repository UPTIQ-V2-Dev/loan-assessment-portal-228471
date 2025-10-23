import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from './validation';

describe('Validation Schemas', () => {
    describe('loginSchema', () => {
        it('should validate correct login data', () => {
            const validData = {
                email: 'test@example.com',
                password: 'Password123!'
            };

            const result = loginSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should reject invalid email', () => {
            const invalidData = {
                email: 'invalid-email',
                password: 'Password123!'
            };

            const result = loginSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toContain('valid email');
            }
        });

        it('should reject short password', () => {
            const invalidData = {
                email: 'test@example.com',
                password: '123'
            };

            const result = loginSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toContain('8 characters');
            }
        });

        it('should reject empty fields', () => {
            const invalidData = {
                email: '',
                password: ''
            };

            const result = loginSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                // Empty strings trigger multiple validation errors per field
                expect(result.error.issues.length).toBeGreaterThanOrEqual(2);
                expect(result.error.issues.some(e => e.message.includes('Email is required'))).toBe(true);
                expect(result.error.issues.some(e => e.message.includes('Password is required'))).toBe(true);
            }
        });
    });

    describe('registerSchema', () => {
        it('should validate correct registration data', () => {
            const validData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '+1234567890',
                password: 'Password123!',
                confirmPassword: 'Password123!',
                acceptTerms: true
            };

            const result = registerSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should validate registration data without phone', () => {
            const validData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'Password123!',
                confirmPassword: 'Password123!',
                acceptTerms: true
            };

            const result = registerSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should reject mismatched passwords', () => {
            const invalidData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'Password123!',
                confirmPassword: 'DifferentPassword123!',
                acceptTerms: true
            };

            const result = registerSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues.some(e => e.message.includes('Passwords do not match'))).toBe(true);
            }
        });

        it('should reject weak password', () => {
            const invalidData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'weakpassword',
                confirmPassword: 'weakpassword',
                acceptTerms: true
            };

            const result = registerSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                const errors = result.error.issues.map(e => e.message);
                expect(errors.some(e => e.includes('uppercase letter'))).toBe(true);
                expect(errors.some(e => e.includes('number'))).toBe(true);
                expect(errors.some(e => e.includes('special character'))).toBe(true);
            }
        });

        it('should reject without accepting terms', () => {
            const invalidData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'Password123!',
                confirmPassword: 'Password123!',
                acceptTerms: false
            };

            const result = registerSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues.some(e => e.message.includes('accept the terms'))).toBe(true);
            }
        });

        it('should reject invalid phone number', () => {
            const invalidData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '123',
                password: 'Password123!',
                confirmPassword: 'Password123!',
                acceptTerms: true
            };

            const result = registerSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues.some(e => e.message.includes('valid phone number'))).toBe(true);
            }
        });

        it('should reject short names', () => {
            const invalidData = {
                firstName: 'J',
                lastName: 'D',
                email: 'john.doe@example.com',
                password: 'Password123!',
                confirmPassword: 'Password123!',
                acceptTerms: true
            };

            const result = registerSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(
                    result.error.issues.some(e => e.message.includes('First name must be at least 2 characters'))
                ).toBe(true);
                expect(
                    result.error.issues.some(e => e.message.includes('Last name must be at least 2 characters'))
                ).toBe(true);
            }
        });
    });

    describe('forgotPasswordSchema', () => {
        it('should validate correct email', () => {
            const validData = {
                email: 'test@example.com'
            };

            const result = forgotPasswordSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should reject invalid email', () => {
            const invalidData = {
                email: 'invalid-email'
            };

            const result = forgotPasswordSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toContain('valid email');
            }
        });

        it('should reject empty email', () => {
            const invalidData = {
                email: ''
            };

            const result = forgotPasswordSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toContain('Email is required');
            }
        });
    });

    describe('resetPasswordSchema', () => {
        it('should validate correct reset data', () => {
            const validData = {
                token: 'reset-token-123',
                password: 'NewPassword123!',
                confirmPassword: 'NewPassword123!'
            };

            const result = resetPasswordSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should reject mismatched passwords', () => {
            const invalidData = {
                token: 'reset-token-123',
                password: 'NewPassword123!',
                confirmPassword: 'DifferentPassword123!'
            };

            const result = resetPasswordSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues.some(e => e.message.includes('Passwords do not match'))).toBe(true);
            }
        });

        it('should reject empty token', () => {
            const invalidData = {
                token: '',
                password: 'NewPassword123!',
                confirmPassword: 'NewPassword123!'
            };

            const result = resetPasswordSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues.some(e => e.message.includes('Reset token is required'))).toBe(true);
            }
        });

        it('should reject weak password', () => {
            const invalidData = {
                token: 'reset-token-123',
                password: 'weak',
                confirmPassword: 'weak'
            };

            const result = resetPasswordSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                const errors = result.error.issues.map(e => e.message);
                expect(errors.some(e => e.includes('8 characters'))).toBe(true);
            }
        });
    });
});
