import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().min(1),
    password: z.string().min(1),
    next: z.string()
});

export type LoginSchema = typeof loginSchema;

export const registerSchema = z
    .object({
        email: z.string().email(),
        first_name: z.string().min(3),
        last_name: z.string().min(3),
        password: z.string().min(8),
        confirm_password: z.string().min(8),
        is_join_home: z.boolean().default(true),
        join_id: z.string().min(12).max(12).optional()
    })
    .superRefine(({ confirm_password, password }, ctx) => {
        if (confirm_password !== password) {
            ctx.addIssue({
                code: 'custom',
                message: 'The passwords did not match',
                path: ['confirm_password']
            });
        }
    })
    .superRefine(({ password }, checkPassComplexity) => {
        const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
        const containsLowercase = (ch: string) => /[a-z]/.test(ch);
        const containsSpecialChar = (ch: string) =>
            /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
        let countOfUpperCase = 0,
            countOfLowerCase = 0,
            countOfNumbers = 0,
            countOfSpecialChar = 0;
        for (let i = 0; i < password.length; i++) {
            let ch = password.charAt(i);
            if (!isNaN(+ch)) countOfNumbers++;
            else if (containsUppercase(ch)) countOfUpperCase++;
            else if (containsLowercase(ch)) countOfLowerCase++;
            else if (containsSpecialChar(ch)) countOfSpecialChar++;
        }
        if (
            countOfLowerCase < 1 ||
            countOfUpperCase < 1 ||
            countOfSpecialChar < 1 ||
            countOfNumbers < 1
        ) {
            checkPassComplexity.addIssue({
                code: 'custom',
                message:
                    'Password should contain at least one uppercase, one lowercase, one number and one special character',
                path: ['password']
            });
        }
    });

export type RegisterSchema = typeof registerSchema;

export const registerHouseSchema = z.object({
    house_name: z.string().min(1)
});

export type RegisterHouseSchema = typeof registerHouseSchema;
