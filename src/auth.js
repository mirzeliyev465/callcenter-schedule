import { auth } from './firebase.js';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';

// İstifadəçi qeydiyyatı
export const registerUser = async (email, password, fullName) => {
  try {
    console.log('Qeydiyyat başladı:', email);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Profili yenilə
    await updateProfile(user, {
      displayName: fullName
    });

    console.log('Qeydiyyat uğurla tamamlandı:', user.uid);
    return user;
  } catch (error) {
    console.error('Qeydiyyat xətası:', error);
    
    let errorMessage = 'Xəta baş verdi';
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'Bu email artıq istifadə olunub';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Yanlış email formatı';
        break;
      case 'auth/weak-password':
        errorMessage = 'Şifrə çox zəifdir (minimum 6 simvol)';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Şəbəkə xətası. İnternet bağlantınızı yoxlayın';
        break;
      default:
        errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

// İstifadəçi girişi
export const loginUser = async (email, password) => {
  try {
    console.log('Giriş başladı:', email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('Giriş uğurlu:', user.uid);
    return user;
  } catch (error) {
    console.error('Giriş xətası:', error);
    
    let errorMessage = 'Xəta baş verdi';
    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = 'Yanlış email formatı';
        break;
      case 'auth/user-disabled':
        errorMessage = 'Bu hesab dayandırılıb';
        break;
      case 'auth/user-not-found':
        errorMessage = 'İstifadəçi tapılmadı';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Yanlış şifrə';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Şəbəkə xətası. İnternet bağlantınızı yoxlayın';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Çox sayda uğursuz cəhd. Bir müddət sonra təkrar yoxlayın';
        break;
      default:
        errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

// Çıxış
export const logoutUser = async () => {
  try {
    console.log('Çıxış edilir...');
    await signOut(auth);
    console.log('Çıxış uğurlu');
  } catch (error) {
    console.error('Çıxış xətası:', error);
    throw new Error('Çıxış zamanı xəta baş verdi: ' + error.message);
  }
};

// Cari istifadəçini almaq
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, 
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
};

// Auth statusunu izləmək
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Şifrə sıfırlama (əlavə funksiya)
export const resetPassword = async (email) => {
  try {
    const { sendPasswordResetEmail } = await import('firebase/auth');
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error('Şifrə sıfırlama xətası:', error);
    throw new Error(error.message);
  }
};

// Profili yenilə
export const updateUserProfile = async (updates) => {
  try {
    const user = auth.currentUser;
    if (user) {
      await updateProfile(user, updates);
      return true;
    }
    throw new Error('İstifadəçi tapılmadı');
  } catch (error) {
    console.error('Profil yeniləmə xətası:', error);
    throw new Error(error.message);
  }
};

// Token almaq
export const getIdToken = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  } catch (error) {
    console.error('Token alma xətası:', error);
    throw new Error(error.message);
  }
};

// Test funksiyası - Firebase bağlantısını yoxlamaq
export const testFirebaseConnection = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      return {
        connected: true,
        user: user.email,
        token: token ? 'Mövcuddur' : 'Yoxdur'
      };
    }
    return {
      connected: true,
      user: null,
      token: null
    };
  } catch (error) {
    console.error('Firebase bağlantı testi uğursuz:', error);
    return {
      connected: false,
      error: error.message
    };
  }
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  onAuthStateChange,
  resetPassword,
  updateUserProfile,
  getIdToken,
  testFirebaseConnection
};