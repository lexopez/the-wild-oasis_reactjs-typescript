import z from "zod";

export const settingsSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  minBookingLength: z.number().positive(),
  maxBookingLength: z.number().positive(),
  maxGuestsPerBooking: z.number().positive(),
  breakfastPrice: z.number().nonnegative(),
});

export const updateSettingSchema = settingsSchema
  .omit({ id: true, created_at: true })
  .partial();

export type Settings = z.infer<typeof settingsSchema>;
export type UpdateSettingObj = z.infer<typeof updateSettingSchema>;
