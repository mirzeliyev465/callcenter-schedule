# Auth Service
cat > src/services/firebase/authService.js << 'EOF'
import { auth } from '../../firebaseConfig';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

export const authService = {
  async anonymousLogin() {
    try {
      const userCredential = await signInAnonymously(auth);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback);
  }
};
EOF