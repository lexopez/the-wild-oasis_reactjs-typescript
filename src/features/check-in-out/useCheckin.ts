import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { updateBooking } from "../../services/apiBookings";
import type { Booking } from "../../types/bookings.types";
import type { CheckinVariables } from "../../types/check-in-out";

export function useCheckin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // useMutation<ReturnType, ErrorType, VariablesType>
  const { mutate: checkin, isPending: isCheckingIn } = useMutation<
    Booking,
    Error,
    CheckinVariables
  >({
    mutationFn: ({ bookingId, breakfast }) =>
      updateBooking(bookingId, {
        status: "checked-in",
        isPaid: true,
        ...breakfast,
      }),

    onSuccess: (data) => {
      // Because we typed the ReturnType as Booking,
      // TS knows data.id exists and is a number/string.
      toast.success(`Booking #${data.id} successfully checked in`);

      // invalidateQueries({ active: true }) refetches all queries currently in use
      queryClient.invalidateQueries({ type: "active" });
      navigate("/");
    },
    onError: () => toast.error("There was an error while checking in"),
  });

  return { checkin, isCheckingIn };
}
