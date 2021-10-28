import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  getAuth,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const auth = getAuth();

export const loginUserGoogle = async () => {
  const googleProvider = new GoogleAuthProvider();

  try {
    const { user } = await signInWithPopup(auth, googleProvider);

    const userData = {
      name: user.displayName,
      email: user.email,
      profilePicUrl: user.photoURL,
      lastSeen: serverTimestamp(),
      online: true,
    };

    const result = await setDoc(doc(db, "users", user.uid), userData, {
      merge: true,
    });
    return user;
  } catch (err) {
    console.error(err);
  }
};

export const loginUserFacebook = async () => {
  const fbProvider = new FacebookAuthProvider();

  try {
    const { user } = await signInWithPopup(auth, fbProvider);

    const userData = {
      name: user.displayName,
      email: user.email,
      profilePicUrl: user.photoURL,
      lastSeen: serverTimestamp(),
      online: true,
    };

    const result = await setDoc(doc(db, "users", user.uid), userData, {
      merge: true,
    });
    return user;
  } catch (err) {
    console.error(err);
  }
};

export const logoutUser = async (user) => {
  const userData = {
    lastSeen: serverTimestamp(),
    online: false,
  };

  const result = await setDoc(doc(db, "users", user.uid), userData, {
    merge: true,
  });
  await signOut(auth);
};
