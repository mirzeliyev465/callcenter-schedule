import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, onSnapshot } from 'firebase/firestore';

export const useSchedules = (activeMonth) => {
  const { db, appId } = useAuth();
  const [schedules, setSchedules] = useState({});

  useEffect(() => {
    if (!db) return;

    const schedulesRef = collection(db, 'artifacts', appId, 'public', 'data', 'monthlySchedules');
    const unsubscribeSchedules = onSnapshot(schedulesRef, (snapshot) => {
      const newSchedules = {};
      snapshot.forEach((d) => {
        newSchedules[d.id] = d.data();
      });
      setSchedules(newSchedules);
    }, (err) => {
      console.error("Cədvəl Dinləmə Xətası:", err);
    });

    return () => unsubscribeSchedules();
  }, [db, appId]);

  const currentSchedule = schedules[activeMonth] || { userAssignments: {} };

  return { schedules, currentSchedule };
};