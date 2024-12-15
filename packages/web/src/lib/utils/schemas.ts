import { getLocalTimeZone, now, ZonedDateTime } from '@internationalized/date';
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
        password: z
            .string()
            .min(8, 'Password should be at least 8 to 60 characters')
            .max(60, 'Password should be at least 8 to 60 characters'),
        confirm_password: z
            .string()
            .min(8, 'Password should be at least 8 to 60 characters')
            .max(60, 'Password should be at least 8 to 60 characters'),
        is_join_home: z.boolean().default(true),
        join_id: z
            .string()
            .min(12, 'Join ID should have 12 characters')
            .max(12, 'Join ID should have 12 characters')
            .optional()
    })
    .superRefine(({ confirm_password, password }, ctx) => {
        if (confirm_password !== password) {
            ctx.addIssue({
                code: 'custom',
                message: ' The passwords did not match',
                path: ['confirm_password']
            });
        }
    })
    .superRefine(({ is_join_home, join_id }, ctx) => {
        if (is_join_home && !join_id) {
            ctx.addIssue({
                code: 'custom',
                message: 'Join ID is required',
                path: ['join_id']
            });
        }
    });
export type RegisterSchema = typeof registerSchema;

export const registerHouseSchema = z.object({
    house_name: z.string().min(3, 'House name should be at least 3 characters'),
    house_city: z.string().optional(),
    house_country: z.string().optional()
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

export const todoItemSchema = z
    .object({
        id: z.string(),
        data: z.string().min(1).max(255),
        assignee: z.string().optional(),
        deadline: z.date().optional()
    })
    .superRefine(({ deadline }, ctx) => {
        let current_date: Date = new Date(new Date().toDateString());
        if (deadline && deadline < current_date) {
            ctx.addIssue({
                code: 'custom',
                path: ['deadline'],
                message: 'Deadline must be before today'
            });
        }
    });
export type TodoItemSchema = typeof todoItemSchema;

export const choreItemSchema = z
    .object({
        id: z.string(),
        data: z.string().min(1).max(255),
        frequency: z.number().int().min(1).max(365).optional(),
        assignee: z.string().optional(),
        deadline: z.date().optional(),
        last_done: z.date().optional(),
        room: z.string().optional(),
        severity: z.number().int().min(0).max(2).optional()
    })
    .superRefine(({ deadline }, ctx) => {
        let current_date: Date = new Date(new Date().toDateString());
        if (deadline && deadline < current_date) {
            ctx.addIssue({
                code: 'custom',
                path: ['deadline'],
                message: 'Deadline must be before today'
            });
        }
    });
export type ChoreItemSchema = typeof choreItemSchema;
