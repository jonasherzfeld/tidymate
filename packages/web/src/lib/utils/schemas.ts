import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
    next: z.string()
});
export type LoginSchema = typeof loginSchema;

export const registerSchema = z
    .object({
        email: z.string().email('Invalid email address'),
        first_name: z.string().min(3, 'First name should be at least 3 characters'),
        last_name: z.string().min(3, 'Last name should be at least 3 characters'),
        password: z.string().min(8, 'Password should be at least 8 characters'),
        confirm_password: z.string().min(8, 'Password should be at least 8 characters'),
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
                    ' Password should contain at least one uppercase, one lowercase, one number and one special character',
                path: ['password']
            });
        }
    });
export type RegisterSchema = typeof registerSchema;

export const registerHouseSchema = z.object({
    house_name: z.string().min(3, 'House name should be at least 3 characters')
});
export type RegisterHouseSchema = typeof registerHouseSchema;

// User Profile
export const emailSchema = z.object({
    email: z.string().email('Invalid email address')
});
export type EmailSchema = typeof emailSchema;

export const firstNameSchema = z.object({
    first_name: z.string().min(3, 'First name should be at least 3 characters')
});
export type FirstNameSchema = typeof firstNameSchema;

export const lastNameSchema = z.object({
    last_name: z.string().min(3, 'Last name should be at least 3 characters')
});
export type LastNameSchema = typeof lastNameSchema;

// House Profile
export const houseNamechema = z.object({
    name: z.string().min(3, 'House name should be at least 3 characters')
});
export type HouseNamechema = typeof houseNamechema;

export const houseCitySchema = z.object({
    city: z.string()
});
export type HouseCitychema = typeof houseCitySchema;

export const houseCountrySchema = z.object({
    country: z.string()
});
export type HouseCountrySchema = typeof houseCountrySchema;

export const houseJoinIdSchema = z.object({
    join_id: z.string()
});
export type HouseJoinIdSchema = typeof houseJoinIdSchema;
