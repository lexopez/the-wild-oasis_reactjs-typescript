import { useSearchParams } from "react-router-dom";
import type { ChangeEvent } from "react";
import Select from "./Select";
import type { Option } from "../features/cabins/CabinTableOperations";

interface SortByProps {
  options: Option[];
}

function SortBy({ options }: SortByProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get("sortBy") || "";

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    searchParams.set("sortBy", e.target.value);
    setSearchParams(searchParams);
  }

  return (
    <Select
      options={options}
      $type="white" // Note: Added $ for transient prop consistency
      value={sortBy}
      onChange={handleChange}
    />
  );
}

export default SortBy;
