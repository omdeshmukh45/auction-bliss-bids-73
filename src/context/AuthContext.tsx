
import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from 'firebase/auth';
import { subscribeToAuthChanges, getCurrentUserProfile, UserProfile } from '@/services/authService';
import { Loader } from 'lucide-react';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  isLoading: true,
  refreshUserProfile: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Setting up auth state listener");
    const unsubscribe = subscribeToAuthChanges(async (user) => {
      console.log("Auth state changed:", user ? "User logged in" : "User logged out");
      setCurrentUser(user);
      
      if (user) {
        try {
          console.log("Fetching user profile for:", user.uid);
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
      
      setIsLoading(false);
    });

    return () => {
      console.log("Cleaning up auth state listener");
      unsubscribe();
    };
  }, []);

  const refreshUserProfile = async () => {
    if (!currentUser) {
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
    currentUser,
    userProfile,
    isLoading,
    refreshUserProfile
  };

  console.log("Auth context state:", { 
    isAuthenticated: !!currentUser,
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
