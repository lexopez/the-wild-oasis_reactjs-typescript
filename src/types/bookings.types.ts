import type { Cabin } from "./cabins.types";
import type { Guest } from "./guests.types";

export interface CabinSubset {
  cabins: Pick<Cabin, "name">;
}

export interface GuestSubset {
  guests: Pick<Guest, "fullName" | "email">;
}

export interface Booking {
  id: number;
  created_at: string;
  startDate: string;
  endDate: string;
  numNights: number;
  numGuests: number;
  cabinPrice: number;
  extrasPrice: number;
  totalPrice: number;
  status: "unconfirmed" | "checked-in" | "checked-out";
  hasBreakfast: boolean;
  isPaid: boolean;
  observations: string;
  cabinId: number;
  guestId: number;
}

export type GetApiBookings = Booking & GuestSubset & CabinSubset;

export type GetApiBooking = Booking & { guests: Guest } & { cabins: Cabin };

export type GetApiBookingsAfterDate = Pick<
  Booking,
  "created_at" | "totalPrice" | "extrasPrice"
>;

export type GetApiBookingStaysAfterDate = Booking & {
  guests: Pick<Guest, "fullName">;
};

export type GetApiBookingStaysTodayActivity = Booking & {
  guests: Pick<Guest, "fullName" | "nationality" | "countryFlag">;
};

// Utility types for filtering/sorting
export interface FilterObj {
  field: string;
  value: string;
  method?: "eq" | "gt" | "lt" | "gte" | "lte";
}

export interface SortObj {
  field: string;
  direction: "asc" | "desc";
}

export interface GetBookingsArgs {
  filter: FilterObj | null;
  sortBy: SortObj | null;
  page: number | null;
}
