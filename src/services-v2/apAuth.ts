import type { AuthResponse, User } from "@supabase/supabase-js";
import supabase, { supabaseUrl } from "./supabase";
import {
  signupSchema,
  loginSchema,
  updateUserSchema,
} from "../schemas/authSchema";
import type {
  SignupArgs,
  LoginArgs,
  UpdateUserArgs,
} from "../schemas/authSchema";

export async function signup(args: SignupArgs): Promise<AuthResponse["data"]> {
  // 1. Validate input
  const { fullName, email, password } = signupSchema.parse(args);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { fullName, avatar: "" },
    },
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function login(args: LoginArgs): Promise<AuthResponse["data"]> {
  // 1. Validate input
  const validated = loginSchema.parse(args);

  const { data, error } = await supabase.auth.signInWithPassword(validated);

  if (error) throw new Error(error.message);
  return data;
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);

  return data?.user;
}

export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function updateCurrentUser(
  args: UpdateUserArgs,
): Promise<{ user: User }> {
  // 1. Validate multi-part input
  const { password, fullName, avatar } = updateUserSchema.parse(args);

  // 2. Update password OR fullName
  // Note: We use an empty string check for password to avoid sending empty updates
  const updateData = password ? { password } : { data: { fullName } };
  const { data, error } = await supabase.auth.updateUser(updateData);

  if (error) throw new Error(error.message);
  if (!avatar) return { user: data.user };

  // 3. Handle Avatar Upload
  const fileName = `avatar-${data.user.id}-${Math.random()}`;

  const { error: storageError } = await supabase.storage
    .from("avatars")
    .upload(fileName, avatar);

  if (storageError) throw new Error(storageError.message);

  // 4. Update avatar URL in user metadata
  const { data: updatedUser, error: error2 } = await supabase.auth.updateUser({
    data: {
      avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
    },
  });

  if (error2) throw new Error(error2.message);
  return { user: updatedUser.user };
}
