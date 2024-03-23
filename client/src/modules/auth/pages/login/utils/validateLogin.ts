import { z } from "zod";

export const loginInputSchema = z.object({
  email: z.string().email("Invalid Email").toLowerCase().trim(),
  password: z.string().trim(),
});

export const loginSuccessResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  userToken: z.string(),
});

export const loginErrorResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
