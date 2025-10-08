import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { setDoc, serverTimestamp, doc } from 'firebase/firestore';

const UserFormModal = ({ isOpen, onClose, editingUser, onUserUpdated }) => {
  const { db, appId, setError } = useAuth();
  const [formData, setFormData] = React.useState({
    uid: '',
    name: '',
    surname: '',
    fatherName: '',
    email: '',
    role: 'operator'
  });

  React.useEffect(() => {
    if (editingUser) {
      setFormData(editingUser);
    } else {
      setFormData({
        uid: '',
        name: '',
        surname: '',
        fatherName: '',
        email: '',
        role: 'operator'
      });
    }
  }, [editingUser, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const userDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', formData.uid);
      await setDoc(userDocRef, {
        ...formData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });

      onUserUpdated();
      onClose();
    } catch (error) {
      console.error('User save error:', error);
      setError('İstifadəçi məlumatları saxlanılmadı');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {editingUser ? 'İstifadəçi Məlumatlarını Dəyiş' : 'Yeni İstifadəçi'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
              <input
                type="text"
                value={formData.surname}
                onChange={(e) => setFormData(prev => ({ ...prev, surname: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ata Adı</label>
              <input
                type="text"
                value={formData.fatherName}
                onChange={(e) => setFormData(prev => ({ ...prev, fatherName: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">İstifadəçi ID</label>
              <input
                type="text"
                value={formData.uid}
                onChange={(e) => setFormData(prev => ({ ...prev, uid: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
                disabled={!!editingUser}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="operator">Operator</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Ləğv et
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                {editingUser ? 'Yadda Saxla' : 'Yarat'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserFormModal;