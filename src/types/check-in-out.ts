export interface CheckinVariables {
  bookingId: number;
  breakfast: {
    hasBreakfast?: boolean;
    extrasPrice?: number;
    totalPrice?: number;
  };
}
