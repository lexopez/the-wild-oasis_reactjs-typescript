import { useState } from "react";

import Button from "../../components/Button";
import FileInput from "../../components/FileInput";
import Form from "../../components/Form";
import FormRow from "../../components/FormRow";
import Input from "../../components/Input";

import { useUser } from "./useUser";
import { useUpdateUser } from "./useUpdateUser";
import { updateUserSchema } from "../../schemas/authSchema";

function UpdateUserDataForm() {
  const { user } = useUser();
  const { updateUser, isUpdating } = useUpdateUser();

  const email = user?.email;
  const currentFullName = user?.user_metadata?.fullName;

  // 1. State is typed based on our schema needs
  const [fullName, setFullName] = useState<string>(currentFullName || "");
  const [avatar, setAvatar] = useState<File | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // 2. On-demand validation using Zod
    // We validate the current state against our schema
    const result = updateUserSchema.safeParse({ fullName, avatar });

    if (!result.success) {
      // You could map these errors to a local 'errors' state if needed
      console.error("Validation failed:", result.error.format());
      return;
    }

    // 3. Send the validated data
    updateUser(
      { fullName: result.data.fullName, avatar: result.data.avatar },
      {
        onSuccess: () => {
          setAvatar(null);
          // Standard DOM reset for the file input field
          (e.target as HTMLFormElement).reset();
        },
      },
    );
  }

  function handleCancel() {
    setFullName(currentFullName || "");
    setAvatar(null);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label="Email address">
        <Input value={email} disabled />
      </FormRow>

      <FormRow label="Full name">
        <Input
          type="text"
          value={fullName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFullName(e.target.value)
          }
          id="fullName"
          disabled={isUpdating}
        />
      </FormRow>

      <FormRow label="Avatar image">
        <FileInput
          id="avatar"
          accept="image/*"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAvatar(e.target.files ? e.target.files[0] : null)
          }
          disabled={isUpdating}
        />
      </FormRow>

      <FormRow>
        <>
          <Button
            type="reset"
            $variation="secondary"
            disabled={isUpdating}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button disabled={isUpdating}>Update account</Button>
        </>
      </FormRow>
    </Form>
  );
}

export default UpdateUserDataForm;
