import React, { useState, useMemo } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useRequests } from '../../../hooks/useRequests';
import { runTransaction, serverTimestamp, doc } from 'firebase/firestore';

const AdminRequestManagement = () => {
  const { db, userId, isAdmin, appId, setLoading, setError } = useAuth();
  const { requests } = useRequests();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRequestTab, setActiveRequestTab] = useState('Gözləmədə');

  const filteredRequests = useMemo(() => {
    let filtered = requests.filter(r => r.status === activeRequestTab);
    
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        r.userName?.toLowerCase().includes(lowerCaseQuery) ||
        r.type?.toLowerCase().includes(lowerCaseQuery) ||
        r.month?.includes(lowerCaseQuery)
      );
    }
    return filtered.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
  }, [requests, activeRequestTab, searchQuery]);

  const handleProcessRequest = async (request, status) => {
    if (!db || !isAdmin) return setError("İcazəniz yoxdur.");
    setLoading(true);

    const requestDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'requests', request.id);
    const monthDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'monthlySchedules', request.month);

    try {
      await runTransaction(db, async (transaction) => {
        transaction.update(requestDocRef, { status, processedAt: serverTimestamp(), processedBy: userId });

        if (status === 'Təsdiqləndi') {
          const monthDoc = await transaction.get(monthDocRef);
          const existingAssignments = monthDoc.exists() ? monthDoc.data().userAssignments || {} : {};
          const targetUserAssignment = existingAssignments[request.userId] || { shifts: {}, offCount: 0 };
          let newShifts = { ...targetUserAssignment.shifts };

          if (request.type === 'Mezuniyyet') {
            const rangeMatch = request.details.match(/(\d+)\s*-\s*(\d+)/);
            if (rangeMatch) {
              const start = parseInt(rangeMatch[1]);
              const end = parseInt(rangeMatch[2]);
              for (let day = start; day <= end; day++) {
                newShifts[day.toString()] = 'M';
              }
            }
          }

          const newOffCount = Object.values(newShifts).filter(s => s === 'OFF' || s === 'M').length;

          transaction.set(monthDocRef, {
            userAssignments: {
              ...existingAssignments,
              [request.userId]: {
                shifts: newShifts,
                offCount: newOffCount,
                userId: request.userId,
                timestamp: serverTimestamp(),
              },
            }
          }, { merge: true });
        }
      });
    } catch (e) {
      console.error("Sorğu Emalı Xətası:", e);
      setError("Sorğunun emalı zamanı xəta baş verdi.");
    } finally {
      setLoading(false);
    }
  };

  const RequestRow = ({ request }) => (
    <div className="p-4 bg-white shadow rounded-lg border border-gray-100 mb-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-lg font-bold text-red-700">{request.type}: {request.userName}</p>
          <p className="text-sm text-gray-600">Ay: <span className="font-semibold">{request.month}</span> | Status: <span className={`font-semibold ${request.status === 'Gözləmədə' ? 'text-blue-500' : request.status === 'Təsdiqləndi' ? 'text-green-500' : 'text-red-500'}`}>{request.status}</span></p>
        </div>
        {request.status === 'Gözləmədə' && (
          <div className="flex space-x-2">
            <button
              onClick={() => handleProcessRequest(request, 'Təsdiqləndi')}
              className="py-1 px-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Təsdiqlə
            </button>
            <button
              onClick={() => handleProcessRequest(request, 'Ləğv edildi')}
              className="py-1 px-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Ləğv Et
            </button>
          </div>
        )}
      </div>
      <div className="mt-2 p-2 bg-gray-50 rounded-lg text-sm text-gray-800 border-l-2 border-red-300">
        <strong className="font-medium">Təfərrüatlar:</strong> {request.details}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="Operator adı, ay və ya növ üzrə axtar..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow p-3 border border-red-300 rounded-lg focus:ring-red-500"
        />
        {['Gözləmədə', 'Təsdiqləndi', 'Ləğv edildi'].map(status => (
          <button
            key={status}
            onClick={() => setActiveRequestTab(status)}
            className={`py-2 px-4 rounded-lg font-medium transition ${
              activeRequestTab === status ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status} ({requests.filter(r => r.status === status).length})
          </button>
        ))}
      </div>

      <div className="max-h-[60vh] overflow-y-auto pr-2">
        {filteredRequests.length === 0 ? (
          <p className="text-center text-gray-500 italic">Bu kateqoriyada sorğu tapılmadı.</p>
        ) : (
          filteredRequests.map(r => <RequestRow key={r.id} request={r} />)
        )}
      </div>
    </div>
  );
};

export default AdminRequestManagement;