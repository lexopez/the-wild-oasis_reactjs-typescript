import { useForm } from "react-hook-form";
import Button from "../../components/Button";
import Form from "../../components/Form";
import FormRow from "../../components/FormRow";
import Input from "../../components/Input";

import { useUpdateUser } from "./useUpdateUser";

// 1. Define the shape of the form data
interface UpdatePasswordValues {
  password?: string;
  passwordConfirm?: string;
}

function UpdatePasswordForm() {
  // 2. Pass the interface as a generic to useForm
  const { register, handleSubmit, formState, getValues, reset } =
    useForm<UpdatePasswordValues>();

  const { errors } = formState;

  const { updateUser, isUpdating } = useUpdateUser();

  // 3. Destructure with types inferred from the interface
  function onSubmit({ password }: UpdatePasswordValues) {
    if (!password) return;
    updateUser({ password }, { onSuccess: () => reset() });
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow
        label="New password (min 8 characters)"
        error={errors?.password?.message}
      >
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          disabled={isUpdating}
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 8,
              message: "Password needs a minimum of 8 characters",
            },
          })}
        />
      </FormRow>

      <FormRow
        label="Confirm password"
        error={errors?.passwordConfirm?.message}
      >
        <Input
          type="password"
          autoComplete="new-password"
          id="passwordConfirm"
          disabled={isUpdating}
          {...register("passwordConfirm", {
            required: "This field is required",
            validate: (value) =>
              getValues().password === value || "Passwords need to match",
          })}
        />
      </FormRow>

      <FormRow>
        {/* Using $variation to match your styled-components interface */}
        <>
          <Button onClick={() => reset()} type="reset" $variation="secondary">
            Cancel
          </Button>
          <Button disabled={isUpdating}>Update password</Button>
        </>
      </FormRow>
    </Form>
  );
}

export default UpdatePasswordForm;
