export interface Settings {
  id: number;
  created_at: string;
  minBookingLength: number;
  maxBookingLength: number;
  maxGuestsPerBooking: number;
  breakfastPrice: number;
}

export type UpdateSettingObj = Partial<Omit<Settings, "id" | "created_at">>;
