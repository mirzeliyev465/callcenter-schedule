import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useAuth } from '../../contexts/AuthContext';

const LogoutButton = () => {
  const { auth } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
    >
      Çıxış
    </button>
  );
};

export default LogoutButton;