import supabase from "./supabase";
import { settingsSchema, updateSettingSchema } from "../schemas/settingsSchema";
import type { Settings, UpdateSettingObj } from "../schemas/settingsSchema";

export async function getSettings(): Promise<Settings> {
  const { data, error } = await supabase.from("settings").select("*").single();

  if (error) {
    console.error(error);
    throw new Error("Settings could not be loaded");
  }

  const result = settingsSchema.safeParse(data);

  if (!result.success) {
    console.error("Settings validation error:", result.error.format());
    // Fallback or throw based on your preference
    throw new Error("Invalid settings data received from server");
  }

  return result.data;
}

export async function updateSetting(
  newSetting: UpdateSettingObj,
): Promise<Settings> {
  // 1. Validate the input object
  const validatedInput = updateSettingSchema.parse(newSetting);

  const { data, error } = await supabase
    .from("settings")
    .update(validatedInput)
    .eq("id", 1) // Settings is a single-row table
    .select() // Ensure we select the data back to validate it
    .single();

  if (error) {
    console.error(error);
    throw new Error("Settings could not be updated");
  }

  // 2. Validate the updated data returned from Supabase
  return settingsSchema.parse(data);
}
