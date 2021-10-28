import {
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  updateDoc,
  query,
  where,
  getDocs,
  getDoc,
  documentId,
  addDoc,
} from "@firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";

export const getUserChats = async (docId, setChatData) => {
  const unsubscribe = onSnapshot(doc(db, "messages", docId), (doc) => {
    setChatData(doc.data());
  });

  return unsubscribe;
};

export const sendChatMessage = async (docId, messageData) => {
  const result = await updateDoc(doc(db, "messages", docId), {
    message: arrayUnion(messageData),
  });
};

export const getChatParticipants = async (participants) => {
  const q = query(
    collection(db, "users"),
    where(documentId(), "in", participants)
  );
  const querySnapshot = await getDocs(q);

  let res = [];
  querySnapshot.forEach((doc) => {
    res.push({ id: doc.id, ...doc.data() });
  });
  return res;
};

export const getUsersList = async () => {
  const querySnapshot = await getDocs(collection(db, "users"));
  const res = [];
  querySnapshot.forEach((doc) => {
    res.push({ id: doc.id, ...doc.data() });
  });
  return res;
};

export const createNewDualChat = async (userid1, userid2) => {
  const q = query(
    collection(db, "conversations"),
    where("group", "==", false),
    where("participants", "in", [
      [userid1, userid2],
      [userid2, userid1],
    ])
  );

  const querySnapshot = await getDocs(q);
  // conversation already exists
  let docData;
  querySnapshot.forEach((doc) => {
    docData = doc.data();
  });
  if (docData) {
    return docData;
  } else {
    // No conversation exists
    const messageRef = await addDoc(collection(db, "messages"), {
      message: [],
    });
    const docRef = await addDoc(collection(db, "conversations"), {
      group: false,
      messagesRef: messageRef.id,
      participants: [userid1, userid2],
    });

    const docSnap = await getDoc(doc(db, "conversations", docRef.id));

    return docSnap.data();
  }
};

export const createNewGroupChat = async (participants, groupName) => {
  const messageRef = await addDoc(collection(db, "messages"), {
    message: [],
  });

  const docRef = await addDoc(collection(db, "conversations"), {
    name: groupName,
    group: true,
    messagesRef: messageRef.id,
    participants: participants,
  });

  const docSnap = await getDoc(doc(db, "conversations", docRef.id));
  return docSnap.data();
};

export const sendImageMessage = async (file) => {
  const storageRef = ref(storage, "images/" + uuidv4());
  const uploadFile = await uploadBytes(storageRef, file);
  const fileURL = await getDownloadURL(storageRef);
  return fileURL;
};

export const addParticipantsGroup = async (docId, addedUsers) => {
  const result = await updateDoc(doc(db, "conversations", docId), {
    participants: arrayUnion(...addedUsers),
  });

  return result;
};
