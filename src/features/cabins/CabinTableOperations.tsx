import React from "react";
import Filter from "../../components/Filter";
import SortBy from "../../components/SortBy";
import TableOperations from "../../components/TableOperations";

// Ideally, import this from your Filter or a common types file
export interface Option {
  value: string;
  label: string;
}

function CabinTableOperations(): React.JSX.Element {
  const filterOptions: Option[] = [
    { value: "all", label: "All" },
    { value: "no-discount", label: "No discount" },
    { value: "with-discount", label: "With discount" },
  ];

  const sortOptions: Option[] = [
    { value: "name-asc", label: "Sort by name (A-Z)" },
    { value: "name-desc", label: "Sort by name (Z-A)" },
    { value: "regularPrice-asc", label: "Sort by price (low first)" },
    { value: "regularPrice-desc", label: "Sort by price (high first)" },
    { value: "maxCapacity-asc", label: "Sort by capacity (low first)" },
    { value: "maxCapacity-desc", label: "Sort by capacity (high first)" },
  ];

  return (
    <TableOperations>
      {/* filterField here targets the 'discount' logic in your cabin data */}
      <Filter filterField="discount" options={filterOptions} />

      <SortBy options={sortOptions} />
    </TableOperations>
  );
}

export default CabinTableOperations;
