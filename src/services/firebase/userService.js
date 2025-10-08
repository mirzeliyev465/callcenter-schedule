# User Service
cat > src/services/firebase/userService.js << 'EOF'
import { db, serverTimestamp } from '../../firebaseConfig';
import { collection, doc, setDoc, onSnapshot } from 'firebase/firestore';

const appId = 'callcenter-schedule-app';

export const userService = {
  async createUser(userData) {
    try {
      const userDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', userData.uid);
      await setDoc(userDocRef, {
        ...userData,
        createdAt: serverTimestamp(),
      });
      return { success: true, message: 'İstifadəçi uğurla yaradıldı' };
    } catch (error) {
      throw new Error(`İstifadəçi yaradılmadı: ${error.message}`);
    }
  },

  subscribeToUsers(callback) {
    const usersRef = collection(db, 'artifacts', appId, 'public', 'data', 'users');
    return onSnapshot(usersRef, (snapshot) => {
      const users = {};
      snapshot.forEach((doc) => users[doc.id] = doc.data());
      callback(users);
    });
  }
};
EOF