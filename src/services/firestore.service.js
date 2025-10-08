import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase.config';

class FirestoreService {
  constructor() {
    this.db = db;
  }

  // ========== GENERIC METHODS ==========

  // Bütün sənədləri almaq
  async getAll(collectionName) {
    try {
      const querySnapshot = await getDocs(collection(this.db, collectionName));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Error getting ${collectionName}:`, error);
      throw error;
    }
  }

  // Sənəd almaq ID ilə
  async getById(collectionName, id) {
    try {
      const docRef = doc(this.db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      } else {
        throw new Error(`Document not found in ${collectionName}`);
      }
    } catch (error) {
      console.error(`Error getting ${collectionName} by ID:`, error);
      throw error;
    }
  }

  // Yeni sənəd əlavə etmək
  async create(collectionName, data) {
    try {
      const docRef = await addDoc(collection(this.db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return {
        id: docRef.id,
        ...data
      };
    } catch (error) {
      console.error(`Error creating ${collectionName}:`, error);
      throw error;
    }
  }

  // Sənədi yeniləmək
  async update(collectionName, id, data) {
    try {
      const docRef = doc(this.db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      return {
        id,
        ...data
      };
    } catch (error) {
      console.error(`Error updating ${collectionName}:`, error);
      throw error;
    }
  }

  // Sənədi silmək
  async delete(collectionName, id) {
    try {
      const docRef = doc(this.db, collectionName, id);
      await deleteDoc(docRef);
      return { id };
    } catch (error) {
      console.error(`Error deleting ${collectionName}:`, error);
      throw error;
    }
  }

  // Real-time dinləmə
  subscribe(collectionName, callback, filters = []) {
    let q = query(collection(this.db, collectionName), ...filters);
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(data);
    }, (error) => {
      console.error(`Error listening to ${collectionName}:`, error);
    });

    return unsubscribe;
  }

  // ========== USER METHODS ==========

  // Bütün istifadəçiləri almaq
  async getAllUsers() {
    return this.getAll('users');
  }

  // İstifadəçi almaq ID ilə
  async getUserById(userId) {
    return this.getById('users', userId);
  }

  // İstifadəçi almaq email ilə
  async getUserByEmail(email) {
    try {
      const q = query(
        collection(this.db, 'users'), 
        where('email', '==', email)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  // Yeni istifadəçi əlavə etmək
  async createUser(userData) {
    return this.create('users', userData);
  }

  // İstifadəçi məlumatlarını yeniləmək
  async updateUser(userId, userData) {
    return this.update('users', userId, userData);
  }

  // İstifadəçini silmək
  async deleteUser(userId) {
    return this.delete('users', userId);
  }

  // ========== SCHEDULE METHODS ==========

  // Bütün növbələri almaq
  async getAllSchedules() {
    return this.getAll('schedules');
  }

  // Növbə almaq ID ilə
  async getScheduleById(scheduleId) {
    return this.getById('schedules', scheduleId);
  }

  // İstifadəçinin növbələrini almaq
  async getSchedulesByUser(userId) {
    try {
      const q = query(
        collection(this.db, 'schedules'),
        where('operatorId', '==', userId),
        orderBy('date', 'asc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting schedules by user:', error);
      throw error;
    }
  }

  // Tarixə görə növbələri almaq
  async getSchedulesByDate(date) {
    try {
      const q = query(
        collection(this.db, 'schedules'),
        where('date', '==', date),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting schedules by date:', error);
      throw error;
    }
  }

  // Yeni növbə əlavə etmək
  async createSchedule(scheduleData) {
    return this.create('schedules', scheduleData);
  }

  // Növbəni yeniləmək
  async updateSchedule(scheduleId, scheduleData) {
    return this.update('schedules', scheduleId, scheduleData);
  }

  // Növbəni silmək
  async deleteSchedule(scheduleId) {
    return this.delete('schedules', scheduleId);
  }

  // ========== APPROVAL METHODS ==========

  // Bütün təsdiq tələblərini almaq
  async getAllApprovalRequests() {
    return this.getAll('approvalRequests');
  }

  // Gözləyən təsdiq tələblərini almaq
  async getPendingApprovals() {
    try {
      const q = query(
        collection(this.db, 'approvalRequests'),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'asc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting pending approvals:', error);
      throw error;
    }
  }

  // İstifadəçinin təsdiq tələblərini almaq
  async getUserApprovalRequests(userId) {
    try {
      const q = query(
        collection(this.db, 'approvalRequests'),
        where('operatorId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting user approval requests:', error);
      throw error;
    }
  }

  // Yeni təsdiq tələbi əlavə etmək
  async createApprovalRequest(requestData) {
    return this.create('approvalRequests', requestData);
  }

  // Təsdiq tələbini yeniləmək
  async updateApprovalRequest(requestId, requestData) {
    return this.update('approvalRequests', requestId, requestData);
  }

  // Təsdiq tələbini silmək
  async deleteApprovalRequest(requestId) {
    return this.delete('approvalRequests', requestId);
  }

  // ========== SHIFT METHODS ==========

  // Bütün smən növlərini almaq
  async getAllShifts() {
    return this.getAll('shifts');
  }

  // Smən əlavə etmək
  async createShift(shiftData) {
    return this.create('shifts', shiftData);
  }

  // Smən yeniləmək
  async updateShift(shiftId, shiftData) {
    return this.update('shifts', shiftId, shiftData);
  }

  // Smən silmək
  async deleteShift(shiftId) {
    return this.delete('shifts', shiftId);
  }

  // ========== BATCH OPERATIONS ==========

  // Çoxlu sənəd əlavə etmək
  async batchCreate(collectionName, items) {
    try {
      const results = [];
      for (const item of items) {
        const result = await this.create(collectionName, item);
        results.push(result);
      }
      return results;
    } catch (error) {
      console.error(`Error batch creating ${collectionName}:`, error);
      throw error;
    }
  }

  // Çoxlu sənəd yeniləmək
  async batchUpdate(collectionName, updates) {
    try {
      const results = [];
      for (const update of updates) {
        const result = await this.update(collectionName, update.id, update.data);
        results.push(result);
      }
      return results;
    } catch (error) {
      console.error(`Error batch updating ${collectionName}:`, error);
      throw error;
    }
  }
}

// Singleton instance
export const firestoreService = new FirestoreService();
export default firestoreService;