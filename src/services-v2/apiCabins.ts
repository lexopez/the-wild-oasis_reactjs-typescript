import supabase, { supabaseUrl } from "./supabase";
import { cabinSchema, cabinWithFileSchema } from "../schemas/cabinSchema";
import type { Cabin, CabinWithFile } from "../schemas/cabinSchema";
import z from "zod";

export async function getCabins(): Promise<Cabin[]> {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded.");
  }

  const result = z.array(cabinSchema).safeParse(data);

  if (!result.success) {
    console.error("Cabin validation error:", result.error.format());
    return data as Cabin[];
  }

  return result.data;
}

export async function createEditCabin(newCabin: CabinWithFile): Promise<Cabin> {
  // Validate the incoming object from the form
  const validatedCabin = cabinWithFileSchema.parse(newCabin);
  const { id, ...cabinData } = validatedCabin;

  const hasImagePath =
    typeof cabinData.image === "string" &&
    cabinData.image.startsWith(supabaseUrl);

  const imageName = `${Math.random()}`.replaceAll(".", "");
  const imagePath = hasImagePath
    ? (cabinData.image as string)
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  const query = supabase.from("cabins");

  // Perform Insert or Update
  const { data, error } = !id
    ? await query
        .insert([{ ...cabinData, image: imagePath }])
        .select()
        .single()
    : await query
        .update({ ...cabinData, image: imagePath })
        .eq("id", id)
        .select()
        .single();

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be created/updated");
  }

  // If a new image was provided (it's a File object), upload it to Storage
  if (!hasImagePath && cabinData.image instanceof File) {
    const { error: storageError } = await supabase.storage
      .from("cabin-images")
      .upload(imageName, cabinData.image);

    if (storageError) {
      await supabase.from("cabins").delete().eq("id", data.id);
      console.error(storageError);
      throw new Error("Image upload failed; cabin creation rolled back.");
    }
  }

  // Validate the final returned object
  return cabinSchema.parse(data);
}

export async function deleteCabin(id: number): Promise<void> {
  const { error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be deleted");
  }
}
