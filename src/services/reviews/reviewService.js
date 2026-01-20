import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  where,
  orderBy,
  updateDoc
} from "firebase/firestore";
import { db } from "../firebase";

const REVIEWS_COLLECTION = "reviews";

export const addReview = async (reviewData) => {
  try {
    const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), {
      ...reviewData,
      createdAt: new Date().toISOString()
    });

    return { success: true, reviewId: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteReview = async (reviewId) => {
  try {
    await deleteDoc(doc(db, REVIEWS_COLLECTION, reviewId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getProductReviews = async (productId) => {
  try {
    const q = query(
      collection(db, REVIEWS_COLLECTION),
      where("productId", "==", productId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const reviews = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { success: true, reviews };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getAllReviews = async () => {
  try {
    const q = query(
      collection(db, REVIEWS_COLLECTION),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const reviews = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { success: true, reviews };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const approveReview = async (reviewId) => {
  try {
    await updateDoc(doc(db, REVIEWS_COLLECTION, reviewId), {
      approved: true,
      approvedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateReviewContent = async (reviewId, newContent) => {
  try {
    await updateDoc(doc(db, REVIEWS_COLLECTION, reviewId), {
      comment: newContent,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
