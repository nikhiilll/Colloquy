import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  setDoc,
} from "firebase/firestore";

export const getUserData = async (userId) => {
  const docSnap = await getDoc(doc(db, "users", userId));
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
};

export const getUserConversations = async (userId, setChats) => {
  const q = query(
    collection(db, "conversations"),
    where("participants", "array-contains", userId)
  );
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const tempChats = [];
    querySnapshot.forEach((doc) => {
      tempChats.push({ id: doc.id, ...doc.data() });
    });

    setChats([...tempChats]);
  });
};

export const changeUserStatus = async (userId, updatedStatus) => {
  try {
    const userData = {
      status: updatedStatus,
    };

    const result = await setDoc(doc(db, "users", userId), userData, {
      merge: true,
    });
    return result;
  } catch (err) {
    console.error(err);
  }
};
