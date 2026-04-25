import { z } from "zod";
import { guestSchema } from "./guestSchema";
import { cabinSchema } from "./cabinSchema";

export const bookingSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  numNights: z.number(),
  numGuests: z.number(),
  cabinPrice: z.number(),
  extrasPrice: z.number(),
  totalPrice: z.number(),
  status: z.enum(["unconfirmed", "checked-in", "checked-out"]),
  hasBreakfast: z.boolean(),
  isPaid: z.boolean(),
  observations: z.string().nullable(),
  cabinId: z.number(),
  guestId: z.number(),
});

export const getApiBookingsSchema = bookingSchema
  .pick({
    id: true,
    created_at: true,
    startDate: true,
    endDate: true,
    numNights: true,
    numGuests: true,
    status: true,
    totalPrice: true,
  })
  .extend({
    guests: guestSchema.pick({ fullName: true, email: true }),
    cabins: cabinSchema.pick({ name: true }),
  });

export const getApiBookingSchema = bookingSchema.extend({
  guests: guestSchema,
  cabins: cabinSchema,
});

export const getApiBookingsAfterDateSchema = bookingSchema.pick({
  created_at: true,
  totalPrice: true,
  extrasPrice: true,
});

export const getApiBookingStaysAfterDateSchema = bookingSchema.extend({
  guests: guestSchema.pick({ fullName: true }),
});

export const getApiBookingStaysTodayActivitySchema = bookingSchema.extend({
  guests: guestSchema.pick({
    fullName: true,
    nationality: true,
    countryFlag: true,
  }),
});

export type Booking = z.infer<typeof bookingSchema>;
export type GetApiBookings = z.infer<typeof getApiBookingsSchema>;
export type GetApiBooking = z.infer<typeof getApiBookingSchema>;
export type GetApiBookingsAfterDate = z.infer<
  typeof getApiBookingsAfterDateSchema
>;
export type GetApiBookingStaysAfterDate = z.infer<
  typeof getApiBookingStaysAfterDateSchema
>;
export type GetApiBookingStaysTodayActivity = z.infer<
  typeof getApiBookingStaysTodayActivitySchema
>;
