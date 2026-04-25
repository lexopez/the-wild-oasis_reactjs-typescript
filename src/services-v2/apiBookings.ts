import z from "zod";
import {
  bookingSchema,
  getApiBookingsAfterDateSchema,
  getApiBookingSchema,
  getApiBookingsSchema,
  getApiBookingStaysAfterDateSchema,
  getApiBookingStaysTodayActivitySchema,
  type Booking,
  type GetApiBooking,
  type GetApiBookings,
  type GetApiBookingsAfterDate,
  type GetApiBookingStaysAfterDate,
  type GetApiBookingStaysTodayActivity,
} from "../schemas/bookingSchema";
import type { GetBookingsArgs } from "../types/bookings.types";
import { PAGE_SIZE } from "../utils/constants";
import { getToday } from "../utils/helpers";
import supabase from "./supabase";

export async function getBookings({
  filter,
  sortBy,
  page,
}: GetBookingsArgs): Promise<{ data: GetApiBookings[]; count: number | null }> {
  let query = supabase
    .from("bookings")
    .select(
      "id, created_at, startDate, endDate, numNights, numGuests, status, totalPrice, cabins(name), guests(fullName, email)",
      { count: "exact" },
    );

  // filtering
  if (filter) {
    const { method, field, value } = filter;

    if (!method || method === "eq") {
      query = query.eq(field, value);
    } else if (method === "gte") {
      query = query.gte(field, value);
    } else if (method === "lte") {
      query = query.lte(field, value);
    }
    // Add other methods as needed for your app logic
  }

  //sorting
  if (sortBy)
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === "asc",
    });

  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;
  if (error) throw new Error("Bookings could not be loaded");

  const result = z.array(getApiBookingsSchema).safeParse(data);

  if (!result.success) {
    console.error("Data validation failed:", result.error);
    return { data: [], count: 0 }; // Safe fallback
  }

  return { data: result.data, count };
}

export async function getBooking(id: string | number): Promise<GetApiBooking> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(*), guests(*)")
    .eq("id", id)
    .single();

  if (error) throw new Error("Booking not found");

  const result = getApiBookingSchema.safeParse(data);
  if (!result.success) {
    console.error("Booking validation failed:", result.error);
    throw new Error("Received invalid booking data from server");
  }

  return result.data;
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
export async function getBookingsAfterDate(
  date: string,
): Promise<GetApiBookingsAfterDate[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("created_at, totalPrice, extrasPrice")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }));

  if (error) throw new Error("Booking could not be loaded");

  const result = z.array(getApiBookingsAfterDateSchema).safeParse(data);

  if (!result.success) {
    console.error("Data validation failed:", result.error);
    return [];
  }

  return result.data;
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(
  date: string,
): Promise<GetApiBookingStaysAfterDate[]> {
  const { data, error } = await supabase
    .from("bookings")
    // .select('*')
    .select("*, guests(fullName)")
    .gte("startDate", date)
    .lte("startDate", getToday());

  if (error) throw new Error("Booking could not be loaded");

  const result = z.array(getApiBookingStaysAfterDateSchema).safeParse(data);

  if (!result.success) {
    console.error("Data validation failed:", result.error);
    return [];
  }

  return result.data;
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity(): Promise<
  GetApiBookingStaysTodayActivity[]
> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName, nationality, countryFlag)")
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`,
    )
    .order("created_at");

  // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) throw new Error("Booking could not be loaded");

  const result = z.array(getApiBookingStaysTodayActivitySchema).safeParse(data);

  if (!result.success) {
    console.error("Data validation failed:", result.error);
    return [];
  }

  return result.data;
}

export async function updateBooking(
  id: number,
  obj: Partial<Booking>,
): Promise<Booking> {
  const { data, error } = await supabase
    .from("bookings")
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error("Booking could not be updated");

  return bookingSchema.parse(data);
}

export async function deleteBooking(id: number): Promise<void> {
  // REMEMBER RLS POLICIES
  const { error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
}
