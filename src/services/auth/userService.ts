
import { updateUserProfile } from "./profileService";
import { signIn, signOut, signUp } from "./authenticationService";

// Add missing exported functions
export const loginUser = async (email: string, password: string) => {
  try {
    const result = await signIn(email, password);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const registerUser = async (email: string, password: string, name: string, role: string) => {
  try {
    const result = await signUp(email, password);
    
    if (result.user?.id) {
      // Update the profile with additional information
      await updateUserProfile(result.user.id, { 
        name, 
        role,
        joinDate: new Date().toISOString().split('T')[0]
      });
    }
    
    return { success: true, user: result.user };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const logoutUser = async () => {
  try {
    await signOut();
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
