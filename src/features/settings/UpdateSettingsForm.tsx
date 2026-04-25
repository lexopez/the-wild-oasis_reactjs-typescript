import Form from "../../components/Form";
import FormRow from "../../components/FormRow";
import Input from "../../components/Input";
import Spinner from "../../components/Spinner";

import { useSettings } from "./useSettings";
import { useUpdateSetting } from "./useUpdateSetting";
import { updateSettingSchema } from "../../schemas/settingsSchema";
import type { Settings } from "../../schemas/settingsSchema";

function UpdateSettingsForm() {
  // 1. settings is now typed via Zod inference
  const { isLoading, settings } = useSettings();
  const { isUpdating, updateSetting } = useUpdateSetting();

  if (isLoading || !settings) return <Spinner />;

  const {
    minBookingLength,
    maxBookingLength,
    maxGuestsPerBooking,
    breakfastPrice,
  } = settings;

  function handleUpdate(
    e: React.FocusEvent<HTMLInputElement>,
    field: keyof Settings,
  ) {
    const { value } = e.target;

    if (!value) return;

    // 2. Optimization: Don't update if the value hasn't changed
    const newValue = Number(value);
    if (newValue === settings?.[field]) return;

    // 3. Validation: Use safeParse to validate the specific field update
    const result = updateSettingSchema.safeParse({ [field]: newValue });

    if (!result.success) {
      // You could display a toast error here using the formatted error
      console.error(result.error);
      // Optional: Reset the input value to the previous valid state from 'settings'
      e.target.value = String(settings?.[field]);
      return;
    }

    // 4. Submit the validated data
    updateSetting(result.data);
  }

  return (
    <Form>
      <FormRow label="Minimum nights/booking">
        <Input
          type="number"
          id="min-nights"
          defaultValue={minBookingLength}
          disabled={isUpdating}
          onBlur={(e) => handleUpdate(e, "minBookingLength")}
        />
      </FormRow>

      <FormRow label="Maximum nights/booking">
        <Input
          type="number"
          id="max-nights"
          defaultValue={maxBookingLength}
          disabled={isUpdating}
          onBlur={(e) => handleUpdate(e, "maxBookingLength")}
        />
      </FormRow>

      <FormRow label="Maximum guests/booking">
        <Input
          type="number"
          id="max-guests"
          defaultValue={maxGuestsPerBooking}
          disabled={isUpdating}
          onBlur={(e) => handleUpdate(e, "maxGuestsPerBooking")}
        />
      </FormRow>

      <FormRow label="Breakfast price">
        <Input
          type="number"
          id="breakfast-price"
          defaultValue={breakfastPrice}
          disabled={isUpdating}
          onBlur={(e) => handleUpdate(e, "breakfastPrice")}
        />
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;
