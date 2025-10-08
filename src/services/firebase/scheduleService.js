# Schedule Service
cat > src/services/firebase/scheduleService.js << 'EOF'
import { db, serverTimestamp } from '../../firebaseConfig';
import { collection, doc, setDoc, onSnapshot, runTransaction } from 'firebase/firestore';

const appId = 'callcenter-schedule-app';

export const scheduleService = {
  async saveUserShifts(month, userId, shifts, assignedBy) {
    try {
      const monthDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'monthlySchedules', month);
      
      await runTransaction(db, async (transaction) => {
        const monthDoc = await transaction.get(monthDocRef);
        const existingAssignments = monthDoc.exists() ? monthDoc.data().userAssignments || {} : {};
        
        const offCount = Object.values(shifts).filter(s => s === 'OFF' || s === 'M').length;
        
        transaction.set(monthDocRef, {
          userAssignments: {
            ...existingAssignments,
            [userId]: {
              userId,
              shifts,
              offCount,
              assignedBy,
              timestamp: serverTimestamp(),
            }
          }
        }, { merge: true });
      });
      
      return { success: true, message: 'Növbələr uğurla yadda saxlanıldı' };
    } catch (error) {
      throw new Error(`Növbələr saxlanılmadı: ${error.message}`);
    }
  },

  subscribeToSchedules(callback) {
    const schedulesRef = collection(db, 'artifacts', appId, 'public', 'data', 'monthlySchedules');
    return onSnapshot(schedulesRef, (snapshot) => {
      const schedules = {};
      snapshot.forEach((doc) => schedules[doc.id] = doc.data());
      callback(schedules);
    });
  }
};
EOF