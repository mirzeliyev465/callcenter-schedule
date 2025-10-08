# Request Service
cat > src/services/firebase/requestService.js << 'EOF'
import { db, serverTimestamp } from '../../firebaseConfig';
import { collection, doc, setDoc, onSnapshot } from 'firebase/firestore';

const appId = 'callcenter-schedule-app';

export const requestService = {
  async createShiftSwapRequest(requestData) {
    try {
      const requestsRef = collection(db, 'artifacts', appId, 'public', 'data', 'requests');
      const newDocRef = doc(requestsRef);
      
      await setDoc(newDocRef, {
        type: 'Smen Dəyişməsi',
        ...requestData,
        status: 'Gözləmədə',
        createdAt: serverTimestamp(),
      });
      
      return { success: true, message: 'Smen dəyişmə sorğusu göndərildi' };
    } catch (error) {
      throw new Error(`Sorğu göndərilmədi: ${error.message}`);
    }
  },

  async createLeaveRequest(requestData) {
    try {
      const requestsRef = collection(db, 'artifacts', appId, 'public', 'data', 'requests');
      const newDocRef = doc(requestsRef);
      
      await setDoc(newDocRef, {
        type: 'Məzuniyyət',
        ...requestData,
        status: 'Gözləmədə',
        createdAt: serverTimestamp(),
      });
      
      return { success: true, message: 'Məzuniyyət sorğusu göndərildi' };
    } catch (error) {
      throw new Error(`Sorğu göndərilmədi: ${error.message}`);
    }
  },

  subscribeToRequests(callback) {
    const requestsRef = collection(db, 'artifacts', appId, 'public', 'data', 'requests');
    return onSnapshot(requestsRef, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(requests);
    });
  }
};
EOF