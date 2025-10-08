import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, query, where, orderBy, collectionGroup, onSnapshot } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAq7snrwhyM0Smp7RTAnH9PcgwDdp2DovE",
  authDomain: "callcenter-schedule.firebaseapp.com",
  projectId: "callcenter-schedule",
  storageBucket: "callcenter-schedule.firebasestorage.app",
  messagingSenderId: "257340791235",
  appId: "1:257340791235:web:a02aac12fd4f2dec588576",
  measurementId: "G-FX3V173LS5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Export Firebase funksiyaları
export { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where,
  orderBy,
  collectionGroup, 
  onSnapshot 
};

export default app;