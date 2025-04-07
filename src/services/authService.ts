
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  onAuthStateChanged,
  User,
  UserCredential
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

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
): Promise<UserCredential> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Update the user's profile
  await updateProfile(userCredential.user, {
    displayName: name
  });
  
  // Create a user document in Firestore
  await setDoc(doc(db, "users", userCredential.user.uid), {
    uid: userCredential.user.uid,
    email: userCredential.user.email,
    name: name,
    joinDate: serverTimestamp(),
    createdAt: serverTimestamp(),
  });
  
  return userCredential;
};

// Login user
export const loginUser = async (
  email: string, 
  password: string
): Promise<UserCredential> => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  return await signOut(auth);
};

// Get current user profile
export const getCurrentUserProfile = async (): Promise<UserProfile | null> => {
  const user = auth.currentUser;
  
  if (!user) return null;
  
  const userDoc = await getDoc(doc(db, "users", user.uid));
  
  if (userDoc.exists()) {
    const userData = userDoc.data();
    return {
      uid: user.uid,
      email: user.email,
      name: user.displayName || userData.name,
      phone: userData.phone || "",
      address: userData.address || "",
      avatar: userData.avatar || "",
      joinDate: userData.joinDate ? new Date(userData.joinDate.toDate()).toLocaleDateString() : new Date().toLocaleDateString(),
    };
  }
  
  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    joinDate: new Date().toLocaleDateString(),
  };
};

// Update user profile
export const updateUserProfile = async (data: Partial<UserProfile>): Promise<void> => {
  const user = auth.currentUser;
  
  if (!user) throw new Error("No user logged in");
  
  // Update display name if provided
  if (data.name) {
    await updateProfile(user, {
      displayName: data.name
    });
  }
  
  // Update user document in Firestore
  await setDoc(doc(db, "users", user.uid), {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

// Subscribe to auth state changes
export const subscribeToAuthChanges = (
  callback: (user: User | null) => void
) => {
  return onAuthStateChanged(auth, callback);
};
