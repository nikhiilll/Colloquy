import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // Add your firebase config here
};

export const firebase = initializeApp(firebaseConfig);
export const db = getFirestore();
export const storage = getStorage();
