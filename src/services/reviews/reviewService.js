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
  try {
    const reviewsRef = collection(db, REVIEWS_COLLECTION);
    const newReviewRef = doc(reviewsRef);

    await runTransaction(db, async (tx) => {
      tx.set(newReviewRef, {
        ...reviewData,
        approved: false,              // ⬅️ important
        createdAt: serverTimestamp(),
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
    const reviewRef = doc(db, REVIEWS_COLLECTION, reviewId);

    await runTransaction(db, async (tx) => {
      const reviewSnap = await tx.get(reviewRef);
      if (!reviewSnap.exists()) {
        throw new Error("Review not found");
      }

      const review = reviewSnap.data();

      // ⛔ Prevent double approval
      if (review.approved) return;

      const productRef = doc(db, PRODUCTS_COLLECTION, review.productId);
      const productSnap = await tx.get(productRef);
      if (!productSnap.exists()) {
        throw new Error("Product not found");
      }

      const { ratingAvg = 0, ratingCount = 0 } = productSnap.data();

      const newCount = ratingCount + 1;
      const newAvg = (ratingAvg * ratingCount + review.rating) / newCount;

      // 1️⃣ approve review
      tx.update(reviewRef, {
        approved: true,
        approvedAt: serverTimestamp(),
      });

      // 2️⃣ update product rating
      tx.update(productRef, {
        ratingCount: newCount,
        ratingAvg: newAvg,
      });
    });

    return { success: true };
  } catch (error) {
    console.error("Approve review failed:", error);
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
