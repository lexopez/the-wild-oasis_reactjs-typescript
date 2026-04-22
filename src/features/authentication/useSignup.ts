import { useMutation } from "@tanstack/react-query";
import { signup as signupApi } from "../../services/apiAuth";
import toast from "react-hot-toast";
import type { AuthResponse } from "@supabase/supabase-js";
import type { SignupArgs } from "../../types/auth.types";

export function useSignup() {
  const { mutate: signup, isPending: isLoading } = useMutation<
    AuthResponse["data"],
    Error,
    SignupArgs
  >({
    mutationFn: signupApi,
    onSuccess: () => {
      toast.success(
        "Account successfully created! please verify the new account from the user's email address.",
      );
    },
  });

  return { signup, isLoading };
}
