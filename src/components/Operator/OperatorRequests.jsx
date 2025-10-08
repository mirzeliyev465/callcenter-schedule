import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRequests } from '../../hooks/useRequests';
import { setDoc, collection, doc, serverTimestamp } from 'firebase/firestore';

const OperatorRequests = ({ activeMonth }) => {
  const { db, userId, users, appId, setError, setLoading } = useAuth();
  const { requests } = useRequests();
  
  const [type, setType] = useState('Smen Dəyişimi');
  const [details, setDetails] = useState('');
  const [message, setMessage] = useState('');

  const operatorRequests = useMemo(() => {
    return requests.filter(r => r.userId === userId)
      .sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
  }, [requests, userId]);

  const handleSubmitRequest = async (type, month, details) => {
    if (!db || !userId) return setError("Zəhmət olmasa, əvvəlcə daxil olun.");
    setLoading(true);
    const userName = users[userId]?.name + ' ' + (users[userId]?.surname || '');

    try {
      const requestsRef = collection(db, 'artifacts', appId, 'public', 'data', 'requests');
      await setDoc(doc(requestsRef), {
        type,
        userId,
        userName,
        month,
        details,
        status: 'Gözləmədə',
        createdAt: serverTimestamp(),
      });
      return true;
    } catch (e) {
      console.error("Sorğu Göndərmə Xətası:", e);
      setError("Sorğunu göndərmək mümkün olmadı.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!details) {
      setMessage('Zəhmət olmasa, sorğu təfərrüatlarını daxil edin.');
      return;
    }
    const success = await handleSubmitRequest(type, activeMonth, details);
    if (success) {
      setMessage('Sorğu müvəffəqiyyətlə göndərildi və Adminin təsdiqini gözləyir!');
      setDetails('');
    } else {
      setMessage('Sorğunu göndərərkən xəta baş verdi.');
    }
  };

  return (
    <div className="space-y-8 p-8">
      <h2 className="text-3xl font-bold text-red-800 border-b pb-2">Sorğu Göndərmə</h2>
      
      <div className="bg-red-50 p-6 rounded-xl shadow-lg border-t-4 border-red-600">
        <h3 className="text-xl font-semibold mb-4 text-red-700">1. Yeni Sorğu Formu</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sorğu Növü</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-2 border rounded-lg">
              <option value="Smen Dəyişimi">Smen Dəyişimi</option>
              <option value="Mezuniyyet">Mezuniyyet</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aktiv Ay</label>
            <input type="text" value={activeMonth} disabled className="w-full p-2 border rounded-lg bg-gray-100" />
          </div>
        </div>
        
        <label className="block text-sm font-medium text-gray-700 mb-1">Təfərrüatlar</label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows="4"
          placeholder={type === 'Mezuniyyet' ? "Məs: 10-15 (6 gün) məzuniyyət istəyirəm." : "Məs: Ayın 5-dəki 9-5 smenimi 8-dəki 12-8 smeni ilə dəyişmək istəyirəm."}
          className="w-full p-3 border border-red-300 rounded-lg text-gray-800"
        />
        <button onClick={handleSend} className="mt-4 w-full py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700">
          Sorğunu Göndər
        </button>
        {message && <p className="mt-2 text-sm text-green-600 font-medium">{message}</p>}
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-red-600">
        <h3 className="text-xl font-semibold mb-4 text-red-700">2. Mənim Sorğularım ({operatorRequests.length})</h3>
        <div className="max-h-60 overflow-y-auto">
          {operatorRequests.map(r => (
            <div key={r.id} className="p-3 mb-2 border rounded-lg bg-gray-50">
              <p className="font-semibold">{r.month} - {r.type}</p>
              <p className={`text-sm font-medium ${r.status === 'Gözləmədə' ? 'text-blue-500' : r.status === 'Təsdiqləndi' ? 'text-green-500' : 'text-red-500'}`}>
                Status: {r.status}
              </p>
              <p className="text-xs text-gray-600 mt-1">Təfərrüat: {r.details}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OperatorRequests;