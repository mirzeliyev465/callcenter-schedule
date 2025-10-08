import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Footer = () => {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
        {/* Ultra Compact Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          {/* Left side - Minimal logo */}
          <div className="flex items-center">
            <div className="w-5 h-5 bg-red-600 rounded flex items-center justify-center mr-1">
              <span className="text-white text-[10px] font-bold">NS</span>
            </div>
            <span className="text-white text-xs">Növbə Sistemi</span>
          </div>

          {/* Center - Copyright */}
          <div className="text-gray-400 text-[11px]">
            &copy; {currentYear}
          </div>

          {/* Right side - Status & Social */}
          <div className="flex items-center space-x-2">
            {/* System Status */}
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span className="text-gray-400 text-[10px]">Online</span>
            </div>
            
            {/* Social icons - very small */}
            <div className="flex space-x-1 ml-1">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3.5 8.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5c0 .829-.672 1.5-1.5 1.5s-1.5-.671-1.5-1.5zm-1.5 5.5h-4v-1h4v1zm5.5 3.5h-14v-1h14v1zm0-3h-5v-1h5v1zm0-3h-6v-1h6v1z"/>
                </svg>
              </a>
            </div>

            {/* User Role Badge */}
            {user && (
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                user.role === 'admin' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-blue-600 text-white'
              }`}>
                {user.role === 'admin' ? 'Admin' : 'Op'}
              </span>
            )}
          </div>
        </div>

        {/* Minimal bottom links */}
        <div className="mt-1 pt-1 border-t border-gray-800 flex justify-center">
          <div className="flex space-x-3 text-[10px] text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Kömək</a>
            <a href="#" className="hover:text-white transition-colors">Əlaqə</a>
            <a href="#" className="hover:text-white transition-colors">Qaydalar</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;