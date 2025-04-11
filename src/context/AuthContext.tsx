
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { setupAuthListener, UserProfile } from "@/services/authService";
import { Loader2 } from "lucide-react";

// Define the shape of the auth context
interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userProfile: UserProfile | null; // Adding userProfile alias for backward compatibility
  refreshUserProfile: () => Promise<void>; // Add refresh method
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,
  userProfile: null,
  refreshUserProfile: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Loading screen component
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

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for auth data
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Function to refresh user profile
  const refreshUserProfile = async () => {
    if (user) {
      try {
        const updatedProfile = await getUserProfile(user.id);
        setProfile(updatedProfile);
      } catch (error) {
        console.error("Error refreshing user profile:", error);
      }
    }
  };

  // Set up auth listener on mount
  useEffect(() => {
    const unsubscribe = setupAuthListener((authState) => {
      setUser(authState.user);
      setSession(authState.session);
      setProfile(authState.profile);
      setIsAuthenticated(authState.isAuthenticated);
      setIsLoading(authState.isLoading);
    });

    // Clean up on unmount
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
        userProfile: profile, // Alias profile as userProfile for backward compatibility
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Import getUserProfile function from authService.ts
import { getUserProfile } from "@/services/authService";
