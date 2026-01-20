import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

const USERS_COLLECTION = "users";

export const getUserProfile = async (userId) => {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { success: true, user: docSnap.data() };
    } else {
      return { success: false, error: "User not found" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, userData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const addAddress = async (userId, address) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      addresses: arrayUnion(address)
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const removeAddress = async (userId, address) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      addresses: arrayRemove(address)
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getAllUsers = async () => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const querySnapshot = await getDocs(usersRef);
    const users = [];
    
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, users };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateUserRole = async (userId, role) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      role: role
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const disableUserAccount = async (userId, disabled = true) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      disabled: disabled
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
