import { z } from "zod";

export const FormInputSchema = z.object({
  firstname: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, "name is too short")
    .max(35, "name can not exceed 35 characters"),
  lastname: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, "name is too short")
    .max(35, "name can not exceed 35 characters"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("email is invalid. please enter a valid email address"),
  tel: z.string().trim().optional(),
  address: z.string().trim().optional(),
  password: z
    .string()
    .trim()
    .min(8, "password too short. password must be 8 or more characters")
    .max(100, "password is too long"),
});

export type SignupBody = z.infer<typeof FormInputSchema>;
