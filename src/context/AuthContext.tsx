
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { setupAuthListener, UserProfile, getProfile } from "@/services/auth";
import { Loader2 } from "lucide-react";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userProfile: UserProfile | null;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,
  userProfile: null,
  refreshUserProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthLoadingScreen: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Loading...</p>
      </div>
    </div>
  );
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUserProfile = async () => {
    if (user) {
      try {
        // Call getProfile without arguments - it will get the current user's profile
        const updatedProfile = await getProfile();
        setProfile(updatedProfile);
      } catch (error) {
        console.error("Error refreshing user profile:", error);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = setupAuthListener((authState) => {
      setUser(authState.user);
      setSession(authState.session);
      setProfile(authState.profile);
      setIsAuthenticated(authState.isAuthenticated);
      setIsLoading(authState.isLoading);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isAuthenticated,
        isLoading,
        userProfile: profile,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
