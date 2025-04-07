
import { api, isAuthenticated } from "./apiService";

export interface UserProfile {
  uid: string;
  email: string | null;
  name: string | null;
  phone?: string;
  address?: string;
  avatar?: string;
  joinDate: string;
}

// Register a new user
export const registerUser = async (
  email: string, 
  password: string, 
  name: string
) => {
  if (!email || !password || !name) {
    throw new Error("Please provide all required information");
  }
  
  try {
    return await api.auth.register(name, email, password);
  } catch (error: any) {
    throw new Error(error.message || "Failed to register. Please try again.");
  }
};

// Login user with improved error handling
export const loginUser = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error("Please enter email and password");
  }
  
  try {
    return await api.auth.login(email, password);
  } catch (error: any) {
    // Map API errors to user-friendly messages
    const errorMsg = error.message?.toLowerCase() || '';
    
    if (errorMsg.includes('not found') || errorMsg.includes('no user')) {
      throw new Error("Email not found. Please check your email or register a new account.");
    } else if (errorMsg.includes('incorrect password') || errorMsg.includes('wrong password')) {
      throw new Error("Incorrect password. Please try again.");
    } else if (errorMsg.includes('invalid') && (errorMsg.includes('credential') || errorMsg.includes('email'))) {
      throw new Error("Invalid email or password. Please try again.");
    } else if (errorMsg.includes('too many') && errorMsg.includes('attempt')) {
      throw new Error("Too many failed login attempts. Please try again later.");
    } else {
      throw new Error(error.message || "Failed to login. Please try again.");
    }
  }
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  await api.auth.logout();
};

// Get current user profile
export const getCurrentUserProfile = async (): Promise<UserProfile | null> => {
  if (!isAuthenticated()) return null;
  
  try {
    const userData = await api.auth.getProfile();
    
    return {
      uid: userData.id,
      email: userData.email,
      name: userData.name,
      phone: userData.phone || "",
      address: userData.address || "",
      avatar: userData.avatar || "",
      joinDate: userData.joinDate || new Date().toLocaleDateString(),
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (data: Partial<UserProfile>): Promise<void> => {
  if (!isAuthenticated()) {
    throw new Error("No user logged in");
  }
  
  try {
    await api.auth.updateProfile(data);
  } catch (error: any) {
    console.error("Error updating profile:", error);
    throw new Error(error.message || "Failed to update profile. Please try again.");
  }
};

// Custom hook for checking authentication status changes
export const subscribeToAuthChanges = (
  callback: (isLoggedIn: boolean) => void
) => {
  // Initial check
  callback(isAuthenticated());
  
  // Setup event listener for storage changes (for multi-tab support)
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === 'auth_token') {
      callback(isAuthenticated());
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
};
