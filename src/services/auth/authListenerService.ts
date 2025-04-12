
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "./types";
import { getProfile } from "./profileService";

// Function to set up authentication state listener
export const setupAuthListener = (
  callback: (authState: {
    user: User | null;
    session: any | null;
    profile: UserProfile | null;
    isAuthenticated: boolean;
    isLoading: boolean;
  }) => void
) => {
  let isLoading = true;

  supabase.auth.getSession().then(({ data: { session } }) => {
    const user = session?.user;

    if (user) {
      getProfile()
        .then((profile) => {
          isLoading = false;
          callback({
            user,
            session,
            profile: profile || null,
            isAuthenticated: true,
            isLoading,
          });
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
          isLoading = false;
          callback({
            user,
            session,
            profile: null,
            isAuthenticated: true,
            isLoading,
          });
        });
    } else {
      isLoading = false;
      callback({
        user: null,
        session: null,
        profile: null,
        isAuthenticated: false,
        isLoading,
      });
    }
  });

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      const user = session?.user;

      if (user) {
        try {
          const profile = await getProfile();
          callback({
            user,
            session,
            profile: profile || null,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error("Error fetching user profile:", error);
          callback({
            user,
            session,
            profile: null,
            isAuthenticated: true,
            isLoading: false,
          });
        }
      } else {
        callback({
          user: null,
          session: null,
          profile: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    }
  );

  return () => {
    subscription.unsubscribe();
  };
};
