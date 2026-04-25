import z from "zod";

export const guestSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  email: z.email("Invalid email address"),
  nationalID: z.string(),
  nationality: z.string(),
  countryFlag: z.url(),
});

export type Guest = z.infer<typeof guestSchema>;
