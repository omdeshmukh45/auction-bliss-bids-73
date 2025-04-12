
import { User } from "@supabase/supabase-js";

export interface AuthError {
  message: string;
}

export interface SignUpResponse {
  success: boolean;
  error?: string;
  data?: any;
  user?: User | null;
}

export interface SignInResponse {
  success: boolean;
  error?: string;
  data?: any;
  user?: User | null;
}

export interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
  created_at: string | null;
  phone?: string | null;
  address?: string | null;
  avatar?: string | null;
  avatar_url?: string | null;
  joinDate?: string | null;
}

export type Profile = UserProfile;
