import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../Shared/UI/LoadingSpinner';
import ErrorMessage from '../Shared/UI/ErrorMessage';

const Login = () => {
  const { loading, error } = useAuth();

  if (loading) {
    return <LoadingSpinner text="Sistemə giriş edilir..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Növbə Sistemi
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Zəhmət olmasa gözləyin, sistemə avtomatik giriş edilir
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <ErrorMessage message={error} />
          
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-sm text-gray-600">
              Autentifikasiya prosesi davam edir...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;