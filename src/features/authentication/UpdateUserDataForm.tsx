import { useState, type FormEvent } from "react";

import Button from "../../components/Button";
import FileInput from "../../components/FileInput";
import Form from "../../components/Form";
import FormRow from "../../components/FormRow";
import Input from "../../components/Input";

import { useUser } from "./useUser";
import { useUpdateUser } from "./useUpdateUser";

function UpdateUserDataForm() {
  // 1. Destructuring with an assumption that useUser returns a typed User object
  // If user is undefined initially, we use optional chaining or a guard
  const { user } = useUser();

  const email = user?.email;
  const currentFullName = user?.user_metadata?.fullName;

  const { updateUser, isUpdating } = useUpdateUser();

  // 2. State typing: avatar can be a File object or null
  const [fullName, setFullName] = useState<string>(currentFullName || "");
  const [avatar, setAvatar] = useState<File | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!fullName) return;

    // 3. updateUser expects an object matching the User update schema
    updateUser(
      { fullName, avatar },
      {
        onSuccess: () => {
          setAvatar(null);
          // Type casting to access the form reset method
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
          // 4. File input handling with null-safety
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
