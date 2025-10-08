import React from 'react';

const UserForm = ({ formData, onChange, onSubmit, onCancel, isEditing = false }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onChange({ ...formData, name: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
          <input
            type="text"
            value={formData.surname}
            onChange={(e) => onChange({ ...formData, surname: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ata Adı</label>
        <input
          type="text"
          value={formData.fatherName}
          onChange={(e) => onChange({ ...formData, fatherName: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => onChange({ ...formData, email: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">İstifadəçi ID</label>
        <input
          type="text"
          value={formData.uid}
          onChange={(e) => onChange({ ...formData, uid: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg"
          required
          disabled={isEditing}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
        <select
          value={formData.role}
          onChange={(e) => onChange({ ...formData, role: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg"
        >
          <option value="operator">Operator</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
        >
          Ləğv et
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
        >
          {isEditing ? 'Yenilə' : 'Yarat'}
        </button>
      </div>
    </form>
  );
};

export default UserForm;