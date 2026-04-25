import z from "zod";

export const cabinSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  name: z.string().min(1, "Name is required"),
  maxCapacity: z.number().min(1),
  regularPrice: z.number().positive(),
  discount: z.number().nonnegative(),
  description: z.string(),
  image: z.string(),
});

export const cabinWithFileSchema = cabinSchema
  .omit({ id: true, created_at: true, image: true })
  .extend({
    id: z.number().optional(),
    image: z.union([
      // 1. Existing image URL string
      z.string().min(1, "Image URL is required"),

      // 2. New FileList upload
      z
        .custom<FileList>((val) => val instanceof FileList, "Image is required")
        .refine((files) => files.length > 0, "Please upload an image"),
    ]),
  });

export type Cabin = z.infer<typeof cabinSchema>;
export type CabinWithFile = z.infer<typeof cabinWithFileSchema>;
