import React, { useState, useMemo } from 'react';
import { useUsers } from '../../hooks/useUsers';
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { APP_ID } from '../../constants/roles';
import LoadingSpinner from '../../components/Shared/UI/LoadingSpinner';
import ErrorMessage from '../../components/Shared/UI/ErrorMessage';

const AdminUserManagement = ({ setLoading }) => {
  const { users, loading, error } = useUsers();
  const [newUser, setNewUser] = useState({ uid: '', name: '', surname: '', fatherName: '', email: '', role: 'operator' });
  const [message, setMessage] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  const handleCreateUser = async (user) => {
    setLoading(true);
    try {
      const userDocRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'users', user.uid);
      await setDoc(userDocRef, { ...user, createdAt: serverTimestamp() }, { merge: true });
      return true;
    } catch (e) {
      console.error("İstifadəçi Yaratma Xətası:", e);
      setMessage("Yeni istifadəçi yaratmaq mümkün olmadı.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userUid, updates) => {
    setLoading(true);
    try {
      const userDocRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'users', userUid);
      await updateDoc(userDocRef, updates);
      return true;
    } catch (e) {
      console.error("İstifadəçi Yenilənməsi Xətası:", e);
      setMessage("İstifadəçi məlumatlarını yeniləmək mümkün olmadı.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNewUser = async () => {
    if (!newUser.name || !newUser.uid || !newUser.email) {
      setMessage('Ad, ID və Email boş ola bilməz.');
      return;
    }
    const success = await handleCreateUser(newUser);
    if (success) {
      setMessage(`İstifadəçi ${newUser.name} uğurla yaradıldı.`);
      setNewUser({ uid: '', name: '', surname: '', fatherName: '', email: '', role: 'operator' });
    }
  };
  
  const handleUpdateExistingUser = async () => {
    if (!editingUser) return;
    const success = await handleUpdateUser(editingUser.uid, {
      name: editingUser.name,
      surname: editingUser.surname,
      fatherName: editingUser.fatherName,
      email: editingUser.email,
      role: editingUser.role,
    });
    if (success) {
      setMessage(`${editingUser.name} məlumatları yeniləndi.`);
      setEditingUser(null);
    }
  };
  
  const sortedUsers = useMemo(() => {
    return Object.values(users).sort((a, b) => (a.role === 'admin' ? -1 : 1));
  }, [users]);

  const UserRow = ({ user }) => (
    <tr key={user.uid}>
      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name} {user.surname}</td>
      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.fatherName}</td>
      <td className={`px-3 py-4 whitespace-nowrap text-sm font-medium ${user.role === 'admin' ? 'text-red-600' : 'text-green-600'}`}>
        {user.role}
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-xs text-gray-500 break-words max-w-xs">{user.uid}</td>
      <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button 
          onClick={() => setEditingUser(user)} 
          className="text-red-600 hover:text-red-900 text-xs font-semibold"
        >
          Dəyiş
        </button>
      </td>
    </tr>
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <ErrorMessage message={error} />
      
      <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-red-600">
        <h3 className="text-2xl font-semibold mb-4 text-red-700">Yeni İstifadəçi Yarat</h3>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Ad" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} className="p-2 border rounded-lg" />
          <input type="text" placeholder="Soyad" value={newUser.surname} onChange={(e) => setNewUser({...newUser, surname: e.target.value})} className="p-2 border rounded-lg" />
          <input type="text" placeholder="Ata Adı" value={newUser.fatherName} onChange={(e) => setNewUser({...newUser, fatherName: e.target.value})} className="p-2 border rounded-lg" />
          <input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} className="p-2 border rounded-lg" />
          <input type="text" placeholder="İstifadəçi ID" value={newUser.uid} onChange={(e) => setNewUser({...newUser, uid: e.target.value})} className="p-2 border rounded-lg col-span-1" />
          <select value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})} className="p-2 border rounded-lg">
            <option value="operator">Operator</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button onClick={handleSaveNewUser} className="mt-4 w-full py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700">
          İstifadəçini Yarat
        </button>
        {message && <p className="mt-2 text-sm text-green-600 font-medium">{message}</p>}
      </div>
      
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-96">
            <h3 className="text-xl font-bold mb-4 text-red-700">İstifadəçi Məlumatlarını Dəyiş</h3>
            <input type="text" placeholder="Ad" value={editingUser.name} onChange={(e) => setEditingUser({...editingUser, name: e.target.value})} className="w-full p-2 border rounded-lg mb-2" />
            <input type="text" placeholder="Soyad" value={editingUser.surname} onChange={(e) => setEditingUser({...editingUser, surname: e.target.value})} className="w-full p-2 border rounded-lg mb-2" />
            <input type="text" placeholder="Ata Adı" value={editingUser.fatherName} onChange={(e) => setEditingUser({...editingUser, fatherName: e.target.value})} className="w-full p-2 border rounded-lg mb-2" />
            <input type="email" placeholder="Email" value={editingUser.email} onChange={(e) => setEditingUser({...editingUser, email: e.target.value})} className="w-full p-2 border rounded-lg mb-2" />
            <select value={editingUser.role} onChange={(e) => setEditingUser({...editingUser, role: e.target.value})} className="w-full p-2 border rounded-lg mb-4">
              <option value="operator">Operator</option>
              <option value="admin">Admin</option>
            </select>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setEditingUser(null)} className="py-2 px-4 bg-gray-300 rounded-lg">Ləğv Et</button>
              <button onClick={handleUpdateExistingUser} className="py-2 px-4 bg-red-600 text-white rounded-lg">Yadda Saxla</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-red-600">
        <h3 className="text-2xl font-semibold mb-4 text-red-700">Bütün İstifadəçilər ({sortedUsers.length})</h3>
        <div className="max-h-96 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad Soyad</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ata Adı</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Əməliyyat</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedUsers.map((user) => <UserRow key={user.uid} user={user} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;