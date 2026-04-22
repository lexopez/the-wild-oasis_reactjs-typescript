import { useParams } from "react-router-dom";
import { getBooking } from "../../services/apiBookings";
import { useQuery } from "@tanstack/react-query";
import type { GetApiBooking } from "../../types/bookings.types";

export function useBooking() {
  const { bookingId } = useParams<{ bookingId: string }>();

  const {
    isLoading,
    data: booking,
    error,
  } = useQuery<GetApiBooking>({
    queryKey: ["booking", bookingId],
    queryFn: () => {
      if (!bookingId) throw new Error("No booking ID found");
      return getBooking(bookingId);
    },
    retry: false,
  });

  return { isLoading, error, booking };
}
