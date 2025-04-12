
import { User } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  full_name?: string;
  avatar_url?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  joinDate?: string;
  role?: string;
  // Add other profile fields as necessary
}
