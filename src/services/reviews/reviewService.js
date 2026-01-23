import { 
  collection, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  runTransaction,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";

const REVIEWS_COLLECTION = "reviews";
const PRODUCTS_COLLECTION = "products";

export const addReview = async (reviewData) => {
  const { productId, rating } = reviewData;

  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    const reviewsRef = collection(db, REVIEWS_COLLECTION);

    await runTransaction(db, async (tx) => {
      const productSnap = await tx.get(productRef);

      if (!productSnap.exists()) {
        throw new Error("Product does not exist");
      }

      const productData = productSnap.data();
      const oldCount = productData.ratingCount || 0;
      const oldAvg = productData.ratingAvg || 0;

      const newCount = oldCount + 1;
      const newAvg = (oldAvg * oldCount + rating) / newCount;

      // 1️⃣ create review
      const newReviewRef = doc(reviewsRef);
      tx.set(newReviewRef, {
        ...reviewData,
        createdAt: serverTimestamp(),
      });

      // 2️⃣ update product aggregates
      tx.update(productRef, {
        ratingCount: newCount,
        ratingAvg: newAvg,
      });
    });

    return { success: true };
  } catch (error) {
    console.error("Add review failed:", error);
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
      collection(db, "reviews"),
      where("productId", "==", productId),
      where("approved", "==", true),
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
