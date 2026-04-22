import { useSearchParams } from "react-router-dom";

import Menus from "../../components/Menus";
import Table from "../../components/Table";
import { useCabins } from "./useCabins";
import CabinRow from "./CabinRow";
import Spinner from "../../components/Spinner";
import Empty from "../../components/Empty";
import type { Cabin } from "../../types/cabins.types";

function CabinTable() {
  const { isLoading, cabins } = useCabins();
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;
  // Explicitly check for cabins existence before accessing length
  if (!cabins?.length) return <Empty resourceName="cabins" />;

  // 1. FILTERING logic
  const filterValue = searchParams.get("discount") || "all";

  let filteredCabins: Cabin[];
  if (filterValue === "all") filteredCabins = cabins;
  else if (filterValue === "no-discount")
    filteredCabins = cabins.filter((cabin) => cabin.discount === 0);
  else if (filterValue === "with-discount")
    filteredCabins = cabins.filter((cabin) => (cabin.discount ?? 0) > 0);
  else filteredCabins = cabins;

  // 2. SORTING logic
  const sortBy = searchParams.get("sortBy") || "startDate-asc";
  const [field, direction] = sortBy.split("-") as [keyof Cabin, "asc" | "desc"];

  const modifier = direction === "asc" ? 1 : -1;

  // Create a copy before sorting to avoid mutating the original array
  const sortedCabins = [...filteredCabins].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];

    // Handle numeric sorting
    if (typeof aValue === "number" && typeof bValue === "number") {
      return (aValue - bValue) * modifier;
    }

    // Handle string sorting (like names)
    if (typeof aValue === "string" && typeof bValue === "string") {
      return aValue.localeCompare(bValue) * modifier;
    }

    return 0;
  });

  return (
    <Menus>
      <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
        <Table.Header>
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={sortedCabins}
          render={(cabin: Cabin) => <CabinRow cabin={cabin} key={cabin.id} />}
        />
      </Table>
    </Menus>
  );
}

export default CabinTable;
