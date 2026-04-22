export interface SignupArgs {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginArgs {
  email: string;
  password: string;
}

export interface UpdateUserArgs {
  password?: string;
  fullName?: string;
  avatar?: File | null;
}
