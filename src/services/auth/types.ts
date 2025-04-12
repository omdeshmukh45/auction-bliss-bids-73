
import { User } from "@supabase/supabase-js";

export interface AuthError {
  message: string;
}

export interface SignUpResponse {
  user: User | null;
  error: AuthError | null;
}

export interface SignInResponse {
  user: User | null;
  error: AuthError | null;
}

export interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
  created_at: string | null;
}

export type Profile = UserProfile;
