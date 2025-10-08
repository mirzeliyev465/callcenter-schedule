import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { APP_ID } from '../constants/roles';

export const useFirestore = (collectionPath) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fullPath = `artifacts/${APP_ID}/public/data/${collectionPath}`;
    const collectionRef = collection(db, fullPath);
    
    const unsubscribe = onSnapshot(collectionRef, 
      (snapshot) => {
        const newData = {};
        snapshot.forEach((doc) => {
          newData[doc.id] = { id: doc.id, ...doc.data() };
        });
        setData(newData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionPath]);

  return { data, loading, error };
};

export const useDocument = (collectionPath, docId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fullPath = `artifacts/${APP_ID}/public/data/${collectionPath}/${docId}`;
    const docRef = doc(db, fullPath);
    
    const unsubscribe = onSnapshot(docRef, 
      (docSnap) => {
        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() });
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionPath, docId]);

  return { data, loading, error };
};