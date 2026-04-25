import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import Button from "../../components/Button";
import Form from "../../components/Form";
import FormRow from "../../components/FormRow";
import Input from "../../components/Input";

import { useSignup } from "./useSignup";
import { signupSchema } from "../../schemas/authSchema";

// 1. Extend the global schema to include password confirmation
const signupFormSchema = signupSchema
  .extend({
    passwordConfirm: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords need to match",
    path: ["passwordConfirm"], // This ensures the error appears on the correct field
  });

// 2. Infer the type directly from the schema
type SignupFormValues = z.infer<typeof signupFormSchema>;

function SignupForm() {
  const { signup, isLoading } = useSignup();

  // 3. Initialize useForm with the zodResolver
  const { formState, handleSubmit, reset, control } = useForm<SignupFormValues>(
    {
      resolver: zodResolver(signupFormSchema),
      defaultValues: {
        fullName: "",
        email: "",
        password: "",
        passwordConfirm: "",
      },
    },
  );

  const { errors } = formState;

  const onSubmit: SubmitHandler<SignupFormValues> = (data) => {
    console.log(data);
    // Zod has already validated that passwords match, so we just send the base data
    signup(
      { fullName: data.fullName, email: data.email, password: data.password },
      {
        onSettled: () => reset(),
      },
    );
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Full name" error={errors?.fullName?.message}>
        <Controller
          name="fullName"
          control={control}
          render={({ field }) => (
            <Input
              {...field} // 👈 This spreads value, onChange, onBlur, AND ref
              type="password"
              id="fullName"
              disabled={isLoading}
            />
          )}
        />
      </FormRow>

      <FormRow label="Email address" error={errors?.email?.message}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field} // 👈 This spreads value, onChange, onBlur, AND ref
              type="email"
              id="email"
              disabled={isLoading}
            />
          )}
        />
      </FormRow>

      <FormRow
        label="Password (min 8 characters)"
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
              disabled={isLoading}
            />
          )}
        />
      </FormRow>

      <FormRow label="Repeat password" error={errors?.passwordConfirm?.message}>
        <Controller
          name="passwordConfirm"
          control={control}
          render={({ field }) => (
            <Input
              {...field} // 👈 This spreads value, onChange, onBlur, AND ref
              type="password"
              id="passwordConfirm"
              disabled={isLoading}
            />
          )}
        />
      </FormRow>

      <FormRow>
        {/* Using a fragment is fine, but styled-components usually handle this spacing */}
        <>
          <Button
            $variation="secondary"
            type="reset"
            disabled={isLoading}
            onClick={() => reset()}
          >
            Cancel
          </Button>
          <Button disabled={isLoading}>Create new user</Button>
        </>
      </FormRow>
    </Form>
  );
}

export default SignupForm;
