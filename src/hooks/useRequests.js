import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, onSnapshot } from 'firebase/firestore';

export const useRequests = () => {
  const { db, appId } = useAuth();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!db) return;

    const requestsRef = collection(db, 'artifacts', appId, 'public', 'data', 'requests');
    const unsubscribeRequests = onSnapshot(requestsRef, (snapshot) => {
      const newRequests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(newRequests);
    }, (err) => {
      console.error("Sorğu Dinləmə Xətası:", err);
    });

    return () => unsubscribeRequests();
  }, [db, appId]);

  return { requests };
};