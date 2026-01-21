import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query,
  where,
  orderBy
} from "firebase/firestore";
import { db } from "../firebase";

const PRODUCTS_COLLECTION = "products";

export const addProduct = async (productData, imageFile) => {
  try {
    let imageUrl = "";
    
    if (imageFile) {
      // Convert image to Base64
      const reader = new FileReader();
      imageUrl = await new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });
    }

    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...productData,
      imageUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateProduct = async (productId, productData, imageFile) => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    let updateData = { ...productData, updatedAt: new Date().toISOString() };

    if (imageFile) {
      // Convert image to Base64
      const reader = new FileReader();
      updateData.imageUrl = await new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });
    }

    await updateDoc(productRef, updateData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteProduct = async (productId, imageUrl) => {
  try {
    // No need to delete from storage since images are Base64 strings in Firestore
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getProducts = async (category = null) => {
  try {
    let q = collection(db, PRODUCTS_COLLECTION);
    
    if (category) {
      q = query(q, where("category", "==", category));
    }

    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { success: true, products };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getProductById = async (productId) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { success: true, product: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { success: false, error: "Product not found" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateProductQuantity = async (productId, quantityChange) => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    const docSnap = await getDoc(productRef);
    
    if (!docSnap.exists()) {
      return { success: false, error: "Product not found" };
    }

    const currentQuantity = docSnap.data().quantity || 0;
    const newQuantity = Math.max(0, currentQuantity + quantityChange);

    await updateDoc(productRef, {
      quantity: newQuantity,
      updatedAt: new Date().toISOString()
    });

    return { success: true, newQuantity };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
