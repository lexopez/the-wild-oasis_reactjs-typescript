import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import Input from "../../components/Input";
import Form from "../../components/Form";
import Button from "../../components/Button";
import FileInput from "../../components/FileInput";
import Textarea from "../../components/Textarea";
import FormRow from "../../components/FormRow";

import { useCreateCabin } from "./useCreateCabin";
import { useEditCabin } from "./useEditCabin";
import { cabinWithFileSchema } from "../../schemas/cabinSchema";
import type { Cabin } from "../../schemas/cabinSchema";

// 1. Extend our base schema for form-specific logic (like the discount check)
const cabinFormSchema = cabinWithFileSchema.refine(
  (data) => Number(data.discount) <= Number(data.regularPrice),
  {
    message: "Discount should be less than regular price",
    path: ["discount"],
  },
);

type CabinFormData = z.infer<typeof cabinFormSchema>;

interface CreateCabinFormProps {
  cabinToEdit?: Partial<Cabin>;
  onCloseModal?: () => void;
}

function CreateCabinForm({
  cabinToEdit = {},
  onCloseModal,
}: CreateCabinFormProps) {
  const { isCreating, createCabin } = useCreateCabin();
  const { isEditing, editCabin } = useEditCabin();
  const isWorking = isCreating || isEditing;

  const { id: editId, ...editValues } = cabinToEdit;
  const isEditSession = Boolean(editId);

  // 2. Setup useForm with Zod resolver
  const { register, handleSubmit, reset, formState } = useForm<CabinFormData>({
    resolver: zodResolver(cabinFormSchema),
    defaultValues: isEditSession
      ? (editValues as CabinFormData)
      : { discount: 0 },
  });

  const { errors } = formState;

  const onSubmit: SubmitHandler<CabinFormData> = (data) => {
    // 3. Handle the image input
    // React Hook Form provides a FileList for file inputs, we take the first file
    const image = typeof data.image === "string" ? data.image : data.image[0];

    const actionOptions = {
      onSuccess: () => {
        reset();
        onCloseModal?.();
      },
    };

    if (isEditSession && editId) {
      editCabin({ ...data, image, id: editId }, actionOptions);
    } else {
      createCabin({ ...data, image }, actionOptions);
    }
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      $type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Cabin name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("name")}
        />
      </FormRow>

      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isWorking}
          {...register("maxCapacity", { valueAsNumber: true })}
        />
      </FormRow>

      <FormRow label="Regular price" error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          disabled={isWorking}
          {...register("regularPrice", { valueAsNumber: true })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          disabled={isWorking}
          {...register("discount", { valueAsNumber: true })}
        />
      </FormRow>

      <FormRow label="Description" error={errors?.description?.message}>
        <Textarea
          id="description"
          disabled={isWorking}
          {...register("description")}
        />
      </FormRow>

      <FormRow label="Cabin photo" error={errors?.image?.message}>
        <FileInput
          id="image"
          accept="image/*"
          disabled={isWorking}
          {...register("image")}
        />
      </FormRow>

      <FormRow>
        <>
          <Button
            $variation="secondary"
            type="reset"
            onClick={() => onCloseModal?.()}
          >
            Cancel
          </Button>
          <Button disabled={isWorking}>
            {isEditSession ? "Edit cabin" : "Create new cabin"}
          </Button>
        </>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
