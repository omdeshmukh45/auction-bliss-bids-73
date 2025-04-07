
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joined: string;
  phone?: string;
  address?: string;
  joinDate?: string; // Added for backward compatibility
}

// Mock user profile for demo purposes
const MOCK_USER_PROFILE: UserProfile = {
  id: "user-123",
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  joined: "January 2023",
  joinDate: "January 2023", // For backward compatibility
  phone: "555-123-4567",
  address: "123 Main St, Anytown, USA"
};

// Mock authentication check
export function isAuthenticated(): boolean {
  const authToken = localStorage.getItem('auction_auth_token');
  return !!authToken;
}

// Mock login function
export async function loginUser(email: string, password: string): Promise<{ success: boolean; message?: string }> {
  // For demo, accept any email with a password longer than 5 chars
  if (password.length < 6) {
    return { success: false, message: "Password must be at least 6 characters" };
  }
  
  // Set mock auth token
  localStorage.setItem('auction_auth_token', 'mock-jwt-token');
  localStorage.setItem('auction_user_email', email);
  
  return { success: true };
}

// Mock signup function
export async function registerUser(name: string, email: string, password: string): Promise<{ success: boolean; message?: string }> {
  // For demo, accept any email with a password longer than 5 chars
  if (password.length < 6) {
    return { success: false, message: "Password must be at least 6 characters" };
  }
  
  // Set mock auth token
  localStorage.setItem('auction_auth_token', 'mock-jwt-token');
  localStorage.setItem('auction_user_email', email);
  localStorage.setItem('auction_user_name', name);
  
  return { success: true };
}

// Mock logout function
export async function logoutUser(): Promise<void> {
  localStorage.removeItem('auction_auth_token');
  localStorage.removeItem('auction_user_email');
  localStorage.removeItem('auction_user_name');
}

// Get current user profile
export async function getCurrentUserProfile(): Promise<UserProfile> {
  // In a real app, this would fetch from API
  return MOCK_USER_PROFILE;
}

// Update user profile
export async function updateUserProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
  // In a real app, this would update the profile via API
  const updatedProfile = {
    ...MOCK_USER_PROFILE,
    ...profileData
  };
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return updatedProfile;
}

// Mock auth state listener
export function subscribeToAuthChanges(callback: (isLoggedIn: boolean) => void): () => void {
  // Call the callback with the current auth state
  callback(isAuthenticated());
  
  // Set up event listener for storage changes (logout/login from other tabs)
  const storageListener = () => {
    callback(isAuthenticated());
  };
  
  window.addEventListener('storage', storageListener);
  
  // Return unsubscribe function
  return () => {
    window.removeEventListener('storage', storageListener);
  };
}
