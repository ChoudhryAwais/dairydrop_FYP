import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs, 
  getDoc,
  query,
  where,
  orderBy
} from "firebase/firestore";
import { db } from "../firebase";

const ORDERS_COLLECTION = "orders";

export const createOrder = async (orderData) => {
  try {
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
      ...orderData,
      status: "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return { success: true, orderId: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: new Date().toISOString()
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUserOrders = async (userId) => {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { success: true, orders };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getAllOrders = async () => {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { success: true, orders };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getOrderById = async (orderId) => {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { success: true, order: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { success: false, error: "Order not found" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};
