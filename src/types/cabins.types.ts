export interface Cabin {
  id: number;
  created_at: string;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
  image: string;
}

// For creating/editing, the image might be a File object from an input
export interface CabinWithFile extends Omit<
  Cabin,
  "id" | "created_at" | "image"
> {
  id?: number;
  image: string | File; // Can be string (URL) or File (Upload)
}
