import {
  HiOutlineBanknotes,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
} from "react-icons/hi2";
import Stat from "./Stat";
import { formatCurrency } from "../../utils/helpers";
import {
  type GetApiBookingsAfterDate,
  type GetApiBookingStaysAfterDate,
} from "../../types/bookings.types";

// 1. Define the interface for the props
interface StatsProps {
  // We use the same Booking type for both since they share the basic structure
  bookings: GetApiBookingsAfterDate[];
  confirmedStays: GetApiBookingStaysAfterDate[];
  numDays: number;
  cabinCount: number;
}

function Stats({ bookings, confirmedStays, numDays, cabinCount }: StatsProps) {
  // 1. Total number of bookings
  const numBookings = bookings.length;

  // 2. Total sales (Sum of all totalPrice)
  const sales = bookings.reduce((acc, cur) => acc + (cur.totalPrice || 0), 0);

  // 3. Total check-ins (Confirmed stays)
  const checkins = confirmedStays.length;

  // 4. Occupancy rate
  // Formula: (num checked in nights) / (all available nights)
  // Available nights = (num days * num cabins)
  const occupation =
    confirmedStays.reduce((acc, cur) => acc + (cur.numNights || 0), 0) /
    (numDays * cabinCount);

  return (
    <>
      <Stat
        title="Bookings"
        color="blue"
        icon={<HiOutlineBriefcase />}
        value={numBookings}
      />
      <Stat
        title="Sales"
        color="green"
        icon={<HiOutlineBanknotes />}
        value={formatCurrency(sales)}
      />
      <Stat
        title="Check ins"
        color="indigo"
        icon={<HiOutlineCalendarDays />}
        value={checkins}
      />
      <Stat
        title="Occupancy rate"
        color="yellow"
        icon={<HiOutlineChartBar />}
        value={Math.round(occupation * 100) + "%"}
      />
    </>
  );
}

export default Stats;
