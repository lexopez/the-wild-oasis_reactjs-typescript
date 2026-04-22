import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiAuth";
import type { User } from "@supabase/supabase-js";

export function useUser() {
  const {
    isLoading,
    data: user,
    fetchStatus,
  } = useQuery<User | null>({
    queryKey: ["user"],
    queryFn: getCurrentUser,
  });

  return {
    isLoading,
    user,
    isAuthenticated: user?.role === "authenticated", // Adding fetchStatus helps distinguish between 'loading for the first time'
    // and 're-fetching in the background'
    isFetching: fetchStatus === "fetching",
  };
}
