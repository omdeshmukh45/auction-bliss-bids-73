
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUserProfile, UserProfile, subscribeToAuthChanges } from '@/services/authService';
import { Loader } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  isLoading: boolean;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userProfile: null,
  isLoading: true,
  refreshUserProfile: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // First check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const isLoggedIn = !!session;
      setAuthenticated(isLoggedIn);
      
      if (isLoggedIn) {
        getCurrentUserProfile().then(profile => {
          setUserProfile(profile);
          setIsLoading(false);
        }).catch(error => {
          console.error("Error fetching initial user profile:", error);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });
    
    // Then subscribe to auth changes
    const unsubscribe = subscribeToAuthChanges(async (loggedIn) => {
      console.log("Auth state changed:", loggedIn ? "User logged in" : "User logged out");
      setAuthenticated(loggedIn);
      
      if (loggedIn) {
        try {
          console.log("Fetching user profile");
          const profile = await getCurrentUserProfile();
          console.log("Profile fetched:", profile);
          setUserProfile(profile);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
    });

    return () => {
      console.log("Cleaning up auth state listener");
      unsubscribe();
    };
  }, []);

  const refreshUserProfile = async () => {
    if (!authenticated) {
      console.log("No user logged in, cannot refresh profile");
      return;
    }
    
    try {
      console.log("Manually refreshing user profile");
      const profile = await getCurrentUserProfile();
      console.log("Updated profile:", profile);
      setUserProfile(profile);
    } catch (error) {
      console.error("Error refreshing user profile:", error);
    }
  };

  const value = {
    isAuthenticated: authenticated,
    userProfile,
    isLoading,
    refreshUserProfile
  };

  console.log("Auth context state:", { 
    isAuthenticated: authenticated,
    isLoading,
    hasProfile: !!userProfile
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Optional loading component to use with protected routes
export const AuthLoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <Loader className="h-8 w-8 animate-spin mx-auto mb-4" />
      <p>Loading authentication...</p>
    </div>
  </div>
);
