import { useQuery } from "@tanstack/react-query";
import { getCabins } from "../../services/apiCabins";
import type { Cabin } from "../../types/cabins.types";

export function useCabins() {
  const {
    isLoading,
    data: cabins,
    error,
  } = useQuery<Cabin[]>({
    queryKey: ["cabins"],
    queryFn: getCabins,
  });

  return { isLoading, error, cabins };
}
