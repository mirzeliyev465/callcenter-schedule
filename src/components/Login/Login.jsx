import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const { login, setShowLogin, loginForm, setLoginForm } = useAuth();
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const result = login(loginForm.email, loginForm.password);
    if (!result.success) {
      setError(result.error);
    }
  };

  const demoUsers = [
    { email: 'admin@example.com', password: '123456', role: 'admin', name: 'Fərid Hüseynov' },
    { email: 'gunay@example.com', password: '123456', role: 'operator', name: 'Günay Quliyeva' },
    { email: 'ali@example.com', password: '123456', role: 'operator', name: 'Əli Məmmədov' }
  ];

  const fillDemoCredentials = (user) => {
    setLoginForm({ email: user.email, password: user.password });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Növbə Sisteminə Giriş</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="email@example.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Şifrə</label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Şifrə"
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 font-medium"
          >
            Daxil Ol
          </button>
        </form>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Demo Giriş Məlumatları:</h3>
          <div className="space-y-2">
            {demoUsers.map((demoUser, index) => (
              <button
                key={index}
                onClick={() => fillDemoCredentials(demoUser)}
                className="w-full text-left text-sm text-blue-600 hover:text-blue-800 p-2 border rounded hover:bg-blue-50"
              >
                <strong>{demoUser.name}</strong> ({demoUser.role})<br />
                <span className="text-gray-600">{demoUser.email} / {demoUser.password}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowLogin(false)}
          className="w-full mt-4 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
        >
          Bağla
        </button>
      </div>
    </div>
  );
};

export default Login;