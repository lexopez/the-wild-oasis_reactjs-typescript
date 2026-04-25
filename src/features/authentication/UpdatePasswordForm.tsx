import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import Button from "../../components/Button";
import Form from "../../components/Form";
import FormRow from "../../components/FormRow";
import Input from "../../components/Input";

import { useUpdateUser } from "./useUpdateUser";

// 1. Create a specific schema for this form
// We take the base update schema but make the password REQUIRED for this specific form
const updatePasswordFormSchema = z
  .object({
    password: z.string().min(8, "Password needs a minimum of 8 characters"),
    passwordConfirm: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords need to match",
    path: ["passwordConfirm"],
  });

type UpdatePasswordValues = z.infer<typeof updatePasswordFormSchema>;

function UpdatePasswordForm() {
  const { updateUser, isUpdating } = useUpdateUser();

  // 2. Initialize with Zod resolver
  const { handleSubmit, formState, reset, control } =
    useForm<UpdatePasswordValues>({
      resolver: zodResolver(updatePasswordFormSchema),
      defaultValues: {
        password: "",
        passwordConfirm: "",
      },
    });

  const { errors } = formState;

  function onSubmit({ password }: UpdatePasswordValues) {
    // No need to check if password exists; Zod ensures it does before onSubmit is called
    updateUser({ password }, { onSettled: () => reset() });
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow
        label="New password (min 8 characters)"
        error={errors?.password?.message}
      >
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input
              {...field} // 👈 This spreads value, onChange, onBlur, AND ref
              type="password"
              id="password"
              disabled={isUpdating}
            />
          )}
        />
      </FormRow>

      <FormRow
        label="Confirm password"
        error={errors?.passwordConfirm?.message}
      >
        <Controller
          name="passwordConfirm"
          control={control}
          render={({ field }) => (
            <Input
              {...field} // 👈 This spreads value, onChange, onBlur, AND ref
              type="password"
              id="passwordConfirm"
              disabled={isUpdating}
            />
          )}
        />
      </FormRow>

      <FormRow>
        <>
          <Button
            onClick={() => reset()}
            type="reset"
            $variation="secondary"
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button disabled={isUpdating}>Update password</Button>
        </>
      </FormRow>
    </Form>
  );
}

export default UpdatePasswordForm;
