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
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase";

const PRODUCTS_COLLECTION = "products";

export const addProduct = async (productData, imageFile) => {
  try {
    let imageUrl = "";
    
    if (imageFile) {
      const imageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef);
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
      const imageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      updateData.imageUrl = await getDownloadURL(imageRef);
    }

    await updateDoc(productRef, updateData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteProduct = async (productId, imageUrl) => {
  try {
    if (imageUrl) {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    }

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
