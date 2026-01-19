import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export const registerUser = async (email, password, userData) => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User created in Auth:", user.uid);

    // Update user profile
    try {
      await updateProfile(user, {
        displayName: userData.name
      });
      console.log("User profile updated");
    } catch (profileError) {
      console.error("Error updating profile:", profileError);
    }

    // Create user document in Firestore
    try {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        name: userData.name,
        email: email,
        phone: userData.phone || "",
        role: "customer",
        addresses: [],
        createdAt: new Date().toISOString()
      });
      console.log("User document created in Firestore with ID:", user.uid);
    } catch (firestoreError) {
      console.error("Error creating Firestore document:", firestoreError);
      console.error("Firestore error code:", firestoreError.code);
      console.error("Firestore error message:", firestoreError.message);
      return { 
        success: false, 
        error: `Failed to create user profile: ${firestoreError.message}. Please check Firebase security rules.` 
      };
    }

    return { success: true, user };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: error.message };
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUserRole = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data().role;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
};
