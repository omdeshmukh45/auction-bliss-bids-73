
// Re-export everything from the individual modules
export * from "./types";
export * from "./authListenerService";
export * from "./authenticationService";
export * from "./profileService";
export * from "./userService";

// Export signIn and signOut with alias names for backward compatibility
import { signIn, signOut } from "./authenticationService";
export { signIn as loginUser, signIn as signInWithEmail };
export { signOut as logoutUser, signOut as signOutUser };

// Export signUp with alias for backward compatibility
import { signUp } from "./authenticationService";
export { signUp as registerUser, signUp as signUpWithEmail };
