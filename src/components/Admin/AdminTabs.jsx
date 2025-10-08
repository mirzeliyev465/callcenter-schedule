import React from 'react';

const AdminTabs = ({ activeTab, setActiveTab }) => (
  <div className="flex border-b border-red-300">
    {['Təyinatlar', 'Sorğular', 'İstifadəçilər'].map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`py-3 px-6 text-sm font-semibold transition duration-200 ${
          activeTab === tab 
          ? 'border-b-4 border-red-600 text-red-700 bg-red-100'
          : 'text-gray-600 hover:bg-red-50'
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
);

export default AdminTabs;