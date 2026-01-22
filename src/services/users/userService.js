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

// ... existing imports

export const addAddress = async (userId, newAddress) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);

    // CASE 1: The new address is NOT default
    // We can just use arrayUnion (cheaper and faster)
    if (!newAddress.isDefault) {
      await updateDoc(userRef, {
        addresses: arrayUnion(newAddress)
      });
      return { success: true };
    }

    // CASE 2: The new address IS default
    // We must fetch data, unset old defaults, and save the whole array
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const currentAddresses = userData.addresses || [];

      // Create a new array where all existing addresses have isDefault: false
      const updatedAddresses = currentAddresses.map(addr => ({
        ...addr,
        isDefault: false
      }));

      // Add the new default address to this updated list
      updatedAddresses.push(newAddress);

      // Overwrite the addresses array in Firestore
      await updateDoc(userRef, {
        addresses: updatedAddresses
      });
      
      return { success: true };
    } else {
      return { success: false, error: "User not found" };
    }

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

export const setAddressAsDefault = async (userId, addressId) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      const currentAddresses = userData.addresses || [];

      // Map through all addresses
      const updatedAddresses = currentAddresses.map(addr => {
        // If this is the ID we want to default, set true, otherwise false
        if (addr.id === addressId) {
            return { ...addr, isDefault: true };
        }
        return { ...addr, isDefault: false };
      });

      await updateDoc(userRef, {
        addresses: updatedAddresses
      });

      return { success: true, addresses: updatedAddresses };
    }
    return { success: false, error: "User not found" };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
