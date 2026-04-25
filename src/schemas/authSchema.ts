import z from "zod";

export const signupSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  email: z.string().email("Please provide a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Please provide a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const updateUserSchema = z.object({
  password: z.string().min(8).optional().or(z.literal("")),
  fullName: z.string().min(3).optional(),
  avatar: z.instanceof(File).nullable().optional(),
});

export type SignupArgs = z.infer<typeof signupSchema>;
export type LoginArgs = z.infer<typeof loginSchema>;
export type UpdateUserArgs = z.infer<typeof updateUserSchema>;
