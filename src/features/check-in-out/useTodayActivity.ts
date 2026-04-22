import { useQuery } from "@tanstack/react-query";
import { getStaysTodayActivity } from "../../services/apiBookings";
import type { GetApiBookingStaysTodayActivity } from "../../types/bookings.types";

export function useTodayActivity() {
  const { isLoading, data: activities } = useQuery<
    GetApiBookingStaysTodayActivity[],
    Error
  >({
    queryFn: getStaysTodayActivity,
    queryKey: ["today-activity"],
  });

  return { activities, isLoading };
}
