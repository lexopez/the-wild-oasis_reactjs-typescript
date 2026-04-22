import type { Cabin, CabinWithFile } from "../types/cabins.types";
import supabase, { supabaseUrl } from "./supabase";

export async function getCabins(): Promise<Cabin[]> {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.log(error);
    throw new Error("Cabins could not be loaded.");
  }

  return data as Cabin[];
}

export async function createEditCabin(newCabin: CabinWithFile): Promise<Cabin> {
  const { id, ...cabin } = newCabin;

  // Check if image is already a URL (editing without changing image)
  const hasImagePath =
    typeof cabin.image === "string" && cabin.image.startsWith(supabaseUrl);

  const imageName = `${Math.random()}`.replaceAll("/", "");

  const imagePath = hasImagePath
    ? cabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // 1. Prepare the query base
  const query = supabase.from("cabins");

  // 2. Perform the action (Insert or Update)
  // We await the specific action directly to get the response
  const { data, error } = !id
    ? await query
        .insert([{ ...cabin, image: imagePath }])
        .select()
        .single()
    : await query
        .update({ ...cabin, image: imagePath })
        .eq("id", id)
        .select()
        .single();

  // Now TypeScript knows 'data' and 'error' exist because they
  // come directly from the result of a Supabase call.
  if (error) {
    console.error(error);
    throw new Error("Cabin could not be created/updated");
  }

  if (hasImagePath) return data as Cabin;

  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, cabin.image);

  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.error(storageError);
    throw new Error(
      "Cabin image could not be uploaded and the cabin was not created",
    );
  }

  return data as Cabin;
}

export async function deleteCabin(id: number): Promise<void> {
  const { error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be deleted");
  }
}
