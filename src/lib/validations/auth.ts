// lib/validations/auth.ts
// Shared between Server Actions (server) and React Hook Form (client).
// One source of truth — validation rules are never duplicated.

import { z } from "zod";

const emailField = z
  .string()
  .min(1, "Email is required.")
  .email("Enter a valid email address.")
  .toLowerCase()
  .trim();

const passwordBase = z
  .string()
  .min(1, "Password is required.")
  .min(8, "Password must be at least 8 characters.")
  .max(72, "Password is too long."); // bcrypt hard limit

const strongPassword = passwordBase
  .regex(/[A-Z]/, "Must contain at least one uppercase letter.")
  .regex(/[0-9]/, "Must contain at least one number.")
  .regex(/[^A-Za-z0-9]/, "Must contain at least one special character.");

export const loginSchema = z.object({
  email:    emailField,
  password: passwordBase, // not "strong" — existing users may predate the rules
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name:            z.string().min(1, "Name is required.").min(2, "At least 2 characters.").max(60).trim(),
    email:           emailField,
    password:        strongPassword,
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match.",
    path:    ["confirmPassword"],
  });
export type RegisterInput = z.infer<typeof registerSchema>;