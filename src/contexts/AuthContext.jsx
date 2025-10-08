import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Demo istifadəçilər
const demoUsers = [
  { id: 1, name: 'Fərid', surname: 'Hüseynov', email: 'admin@example.com', password: '123456', role: 'admin' },
  { id: 2, name: 'Günay', surname: 'Quliyeva', email: 'gunay@example.com', password: '123456', role: 'operator' },
  { id: 3, name: 'Əli', surname: 'Məmmədov', email: 'ali@example.com', password: '123456', role: 'operator' },
  { id: 4, name: 'Aygün', surname: 'Əliyeva', email: 'aygun@example.com', password: '123456', role: 'operator' }
];

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  useEffect(() => {
    // 2 saniyə sonra avtomatik admin girişi (test üçün)
    const timer = setTimeout(() => {
      const demoUser = demoUsers[0]; // Admin
      setUser(demoUser);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const login = (email, password) => {
    const foundUser = demoUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      setShowLogin(false);
      setLoginForm({ email: '', password: '' });
      return { success: true, user: foundUser };
    } else {
      return { success: false, error: 'Email və ya şifrə yanlışdır!' };
    }
  };

  const logout = () => {
    setUser(null);
    setShowLogin(true);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    showLogin,
    setShowLogin,
    loginForm,
    setLoginForm
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;