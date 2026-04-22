import SortBy from "../../components/SortBy";
import Filter from "../../components/Filter";
import TableOperations from "../../components/TableOperations";
import type { Option } from "../cabins/CabinTableOperations";

function BookingTableOperations() {
  const filterOptions: Option[] = [
    { value: "all", label: "All" },
    { value: "checked-out", label: "Checked out" },
    { value: "checked-in", label: "Checked in" },
    { value: "unconfirmed", label: "Unconfirmed" },
  ];

  const sortOptions: Option[] = [
    { value: "startDate-desc", label: "Sort by date (recent first)" },
    { value: "startDate-asc", label: "Sort by date (earlier first)" },
    {
      value: "totalPrice-desc",
      label: "Sort by amount (high first)",
    },
    { value: "totalPrice-asc", label: "Sort by amount (low first)" },
  ];
  return (
    <TableOperations>
      {/* filterField here targets the 'discount' logic in your cabin data */}
      <Filter filterField="status" options={filterOptions} />

      <SortBy options={sortOptions} />
    </TableOperations>
  );
}

export default BookingTableOperations;
