import React, { useEffect, useState } from 'react';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  onSnapshot,
  serverTimestamp,
  collectionGroup
} from 'firebase/firestore';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  updateProfile 
} from 'firebase/auth';

// Styles
const styles = {
  dashboard: { 
    minHeight: '100vh', 
    background: '#f8fafc',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
  },
  header: { 
    background: 'white', 
    padding: '20px', 
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  nav: { 
    background: 'white', 
    padding: '15px 20px', 
    borderBottom: '1px solid #e2e8f0', 
    display: 'flex', 
    gap: '10px', 
    flexWrap: 'wrap' 
  },
  content: { 
    padding: '20px', 
    maxWidth: '1400px', 
    margin: '0 auto' 
  },
  button: { 
    padding: '10px 20px', 
    border: 'none', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    fontSize: '14px', 
    fontWeight: '500', 
    transition: 'all 0.2s' 
  },
  input: { 
    padding: '12px', 
    border: '1px solid #d1d5db', 
    borderRadius: '8px', 
    fontSize: '14px', 
    width: '100%', 
    marginBottom: '15px' 
  },
  table: { 
    width: '100%', 
    background: 'white', 
    borderRadius: '10px', 
    overflow: 'hidden', 
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)' 
  },
  card: { 
    background: 'white', 
    padding: '20px', 
    borderRadius: '10px', 
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)', 
    marginBottom: '20px' 
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalContent: {
    background: 'white',
    padding: '30px',
    borderRadius: '15px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto'
  }
};

const departments = {
  customer_service: { name: 'Müştəri Xidmətləri', color: '#3B82F6' },
  technical_support: { name: 'Texniki Dəstək', color: '#10B981' },
  sales: { name: 'Satış', color: '#F59E0B' },
  info_sale: { name: 'İnfo Sale', color: '#8B5CF6' },
  technical: { name: 'Texniki', color: '#EF4444' },
  management: { name: 'İdarəetmə', color: '#6B7280' }
};

const AdminDashboard = ({ user, userProfile, onLogout }) => {
  const [currentView, setCurrentView] = useState("overview");
  const [users, setUsers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [shiftTypes, setShiftTypes] = useState([]);
  const [shiftChanges, setShiftChanges] = useState([]);
  const [vacations, setVacations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showUserModal, setShowUserModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  
  // Form states
  const [newUser, setNewUser] = useState({
    name: '', surname: '', email: '', password: '123456', role: 'operator', department: 'customer_service'
  });
  const [newSchedule, setNewSchedule] = useState({
    date: '', shiftType: '', userId: ''
  });
  const [newShift, setNewShift] = useState({
    name: '', startTime: '', endTime: '', color: '#3B82F6'
  });

  const db = getFirestore();
  const auth = getAuth();

  // Firebase-dən məlumatları yüklə
  useEffect(() => {
    loadFirebaseData();
  }, []);

  const loadFirebaseData = async () => {
    try {
      console.log("🔄 Firebase data yüklənir...");

      // AdminDashboard komponentində useEffect
useEffect(() => {
  // Real-time collectionGroup listener
  const profilesQuery = query(collectionGroup(db, "profile"));
  const unsubscribe = onSnapshot(profilesQuery, (snapshot) => {
    const usersData = snapshot.docs.map(doc => ({
      id: doc.ref.parent.parent.id,
      ...doc.data()
    }));
    console.log("🔄 Real-time users update:", usersData.length);
    setUsers(usersData);
  });

  return () => unsubscribe();
}, []);
          // Fallback: Manual yükləmə
          const usersSnapshot = await getDocs(collection(db, "users"));
          const usersData = [];
          
          for (const userDoc of usersSnapshot.docs) {
            try {
              const profileRef = doc(db, "users", userDoc.id, "profile", "userProfile");
              const profileDoc = await getDoc(profileRef);
              
              if (profileDoc.exists()) {
                usersData.push({
                  id: userDoc.id,
                  ...profileDoc.data()
                });
              }
            } catch (userError) {
              console.error("User load error:", userError);
            }
          }
          setUsers(usersData);
        }
      };

      await loadUsers();

      // Schedules
      const schedulesQuery = query(collection(db, 'schedules'), orderBy('date', 'asc'));
      onSnapshot(schedulesQuery, (snapshot) => {
        const schedulesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSchedules(schedulesData);
      });

      // Shift Types
      const shiftsSnapshot = await getDocs(collection(db, 'shiftTypes'));
      const shiftsData = shiftsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setShiftTypes(shiftsData);

      // Shift Changes
      const changesQuery = query(collection(db, 'shiftChanges'), orderBy('createdAt', 'desc'));
      onSnapshot(changesQuery, (snapshot) => {
        const changesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setShiftChanges(changesData);
      });

      // Vacations
      const vacationsQuery = query(collection(db, 'vacations'), orderBy('createdAt', 'desc'));
      onSnapshot(vacationsQuery, (snapshot) => {
        const vacationsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setVacations(vacationsData);
      });

    } catch (error) {
      console.error('Data load error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debug funksiyası
  const debugUsers = async () => {
    try {
      console.log("🔍 Debug users...");
      
      const profilesQuery = query(collectionGroup(db, "profile"));
      const snapshot = await getDocs(profilesQuery);
      console.log("📊 CollectionGroup users:", snapshot.docs.map(doc => ({
        id: doc.ref.parent.parent.id,
        ...doc.data()
      })));
      
    } catch (error) {
      console.error("🔥 Debug error:", error);
    }
  };

  // İstatistikalar
  const stats = {
    totalUsers: users.length,
    totalSchedules: schedules.length,
    activeShifts: shiftTypes.length,
    pendingApprovals: shiftChanges.filter(c => c.status === 'pending').length + vacations.filter(v => v.status === 'pending').length,
    todaySchedules: schedules.filter(s => s.date === new Date().toISOString().split('T')[0]).length
  };

  // Yeni istifadəçi əlavə et
  const addNewUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert('Ad, email və şifrə mütləq doldurulmalıdır!');
      return;
    }

    try {
      // Firebase Auth-da istifadəçi yarat
      const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
      const userId = userCredential.user.uid;

      // Firestore-da profil yarat - YENİ STRUCTURE
      await setDoc(doc(db, 'users', userId, 'profile', 'userProfile'), {
        name: newUser.name,
        surname: newUser.surname,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        status: 'active',
        createdAt: serverTimestamp(),
        fullName: `${newUser.name} ${newUser.surname}`
      });

      setShowUserModal(false);
      setNewUser({
        name: '', surname: '', email: '', password: '123456', role: 'operator', department: 'customer_service'
      });
      
      alert('✅ İstifadəçi uğurla əlavə edildi!');
    } catch (error) {
      console.error('User creation error:', error);
      alert('❌ Xəta: ' + error.message);
    }
  };

  // İstifadəçi sil
  const deleteUser = async (userId) => {
    if (window.confirm('İstifadəçini silmək istədiyinizdən əminsiniz?')) {
      try {
        await deleteDoc(doc(db, 'users', userId, 'profile', 'userProfile'));
        alert('✅ İstifadəçi uğurla silindi!');
      } catch (error) {
        console.error('Delete user error:', error);
        alert('❌ Xəta: ' + error.message);
      }
    }
  };

  // Yeni növbə əlavə et
  const addNewSchedule = async () => {
    if (!newSchedule.date || !newSchedule.shiftType || !newSchedule.userId) {
      alert('Bütün sahələr doldurulmalıdır!');
      return;
    }

    try {
      const user = users.find(u => u.id === newSchedule.userId);
      const shift = shiftTypes.find(s => s.id === newSchedule.shiftType);

      if (!user || !shift) {
        alert('İstifadəçi və ya smən tapılmadı!');
        return;
      }

      await addDoc(collection(db, 'schedules'), {
        userId: newSchedule.userId,
        userName: user.fullName || `${user.name} ${user.surname}`,
        userDepartment: user.department,
        date: newSchedule.date,
        shiftType: newSchedule.shiftType,
        shiftName: shift.name,
        startTime: shift.startTime,
        endTime: shift.endTime,
        status: 'confirmed',
        createdAt: serverTimestamp()
      });

      setShowScheduleModal(false);
      setNewSchedule({ date: '', shiftType: '', userId: '' });
      
      alert('✅ Növbə uğurla əlavə edildi!');
    } catch (error) {
      console.error('Add schedule error:', error);
      alert('❌ Xəta: ' + error.message);
    }
  };

  // Növbə sil
  const deleteSchedule = async (scheduleId) => {
    if (window.confirm('Növbəni silmək istədiyinizdən əminsiniz?')) {
      try {
        await deleteDoc(doc(db, 'schedules', scheduleId));
        alert('✅ Növbə uğurla silindi!');
      } catch (error) {
        console.error('Delete schedule error:', error);
        alert('❌ Xəta: ' + error.message);
      }
    }
  };

  // Yeni smən əlavə et
  const addNewShift = async () => {
    if (!newShift.name || !newShift.startTime || !newShift.endTime) {
      alert('Bütün sahələr doldurulmalıdır!');
      return;
    }

    try {
      const shiftId = `shift_${newShift.name.replace(/\s+/g, '_').toLowerCase()}`;
      
      await setDoc(doc(db, 'shiftTypes', shiftId), {
        name: newShift.name,
        startTime: newShift.startTime,
        endTime: newShift.endTime,
        color: newShift.color,
        active: true,
        createdAt: serverTimestamp()
      });

      setShowShiftModal(false);
      setNewShift({ name: '', startTime: '', endTime: '', color: '#3B82F6' });
      
      alert('✅ Smən uğurla əlavə edildi!');
    } catch (error) {
      console.error('Add shift error:', error);
      alert('❌ Xəta: ' + error.message);
    }
  };

  // Təsdiq göndərişlərini idarə et
  const handleApproval = async (requestId, approved, type = 'shiftChange') => {
    try {
      if (type === 'shiftChange') {
        await updateDoc(doc(db, 'shiftChanges', requestId), {
          status: approved ? 'approved' : 'rejected',
          approvedAt: serverTimestamp(),
          approvedBy: userProfile.name
        });
        
        alert(`✅ Növbə dəyişikliyi ${approved ? 'təsdiqləndi' : 'rədd edildi'}!`);
      } else {
        await updateDoc(doc(db, 'vacations', requestId), {
          status: approved ? 'approved' : 'rejected',
          approvedAt: serverTimestamp(),
          approvedBy: userProfile.name
        });
        
        alert(`✅ Məzuniyyət ${approved ? 'təsdiqləndi' : 'rədd edildi'}!`);
      }
    } catch (error) {
      console.error('Approval error:', error);
      alert('❌ Xəta: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div style={styles.dashboard}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div>Yüklənir...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.dashboard}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={{ color: '#1e293b', margin: 0 }}>
          👑 Admin Panel - {departments[userProfile?.department]?.name}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            onClick={debugUsers}
            style={{ ...styles.button, background: '#8b5cf6', color: 'white' }}
          >
            🐛 Debug
          </button>
          <span style={{ 
            color: '#64748b', 
            background: '#fef3c7', 
            padding: '5px 10px', 
            borderRadius: '20px', 
            fontSize: '14px' 
          }}>
            {userProfile?.name} • Users: {users.length}
          </span>
          <button 
            onClick={onLogout} 
            style={{ ...styles.button, background: '#ef4444', color: 'white' }}
          >
            Çıxış
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav style={styles.nav}>
        {[
          { id: 'overview', label: '📊 Ümumi Baxış' },
          { id: 'users', label: '👥 İstifadəçilər' },
          { id: 'schedules', label: '📅 Növbələr' },
          { id: 'shifts', label: '⏰ Smənlər' },
          { id: 'approvals', label: `✅ Təsdiqlər (${stats.pendingApprovals})` }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setCurrentView(tab.id)} 
            style={{ 
              ...styles.button, 
              background: currentView === tab.id ? '#3b82f6' : '#e2e8f0', 
              color: currentView === tab.id ? 'white' : '#64748b' 
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <div style={styles.content}>
        {currentView === "overview" && (
          <div>
            <h2 style={{ color: '#1e293b', marginBottom: '20px' }}>Ümumi Statistika</h2>
            
            {/* Statistik Kartlar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div style={{ ...styles.card, textAlign: 'center', borderLeft: '4px solid #3B82F6' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3B82F6' }}>{stats.totalUsers}</div>
                <div style={{ color: '#64748b', fontWeight: '500' }}>Ümumi İstifadəçi</div>
              </div>
              <div style={{ ...styles.card, textAlign: 'center', borderLeft: '4px solid #10B981' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10B981' }}>{stats.totalSchedules}</div>
                <div style={{ color: '#64748b', fontWeight: '500' }}>Təyin Edilmiş Növbə</div>
              </div>
              <div style={{ ...styles.card, textAlign: 'center', borderLeft: '4px solid #8B5CF6' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8B5CF6' }}>{stats.activeShifts}</div>
                <div style={{ color: '#64748b', fontWeight: '500' }}>Smən Növü</div>
              </div>
              <div style={{ ...styles.card, textAlign: 'center', borderLeft: '4px solid #F59E0B' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#F59E0B' }}>{stats.pendingApprovals}</div>
                <div style={{ color: '#64748b', fontWeight: '500' }}>Gözləyən Təsdiq</div>
              </div>
            </div>

            {/* Son Təsdiq Göndərişləri */}
            <div style={styles.card}>
              <h3 style={{ marginBottom: '15px' }}>Son Təsdiq Göndərişləri</h3>
              <div style={styles.table}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr', gap: '10px', padding: '15px', background: '#f8fafc', fontWeight: '600' }}>
                  <div>Növ</div>
                  <div>İstifadəçi</div>
                  <div>Tarix</div>
                  <div>Status</div>
                </div>
                
                {[...shiftChanges, ...vacations]
                  .sort((a, b) => new Date(b.createdAt?.toDate()) - new Date(a.createdAt?.toDate()))
                  .slice(0, 5)
                  .map(item => (
                  <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr', gap: '10px', padding: '15px', borderBottom: '1px solid #e2e8f0', alignItems: 'center' }}>
                    <div>
                      <span style={{
                        background: item.type ? '#fce7f3' : '#dbeafe',
                        color: item.type ? '#be185d' : '#1e40af',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {item.type ? 'Məzuniyyət' : 'Növbə Dəyiş'}
                      </span>
                    </div>
                    <div style={{ fontWeight: '500' }}>
                      {item.userName || item.fromUserName}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '14px' }}>
                      {item.date || item.startDate}
                    </div>
                    <div>
                      <span style={{
                        background: item.status === 'pending' ? '#fef3c7' : 
                                   item.status === 'approved' ? '#dcfce7' : '#fee2e2',
                        color: item.status === 'pending' ? '#92400e' : 
                              item.status === 'approved' ? '#166534' : '#dc2626',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {item.status === 'pending' ? 'Gözləyir' : item.status === 'approved' ? 'Təsdiqləndi' : 'Rədd edildi'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentView === "users" && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#1e293b' }}>İstifadəçi İdarəetməsi</h2>
              <button 
                onClick={() => setShowUserModal(true)} 
                style={{ ...styles.button, background: '#10b981', color: 'white' }}
              >
                + Yeni İstifadəçi
              </button>
            </div>

            {/* İstifadəçi əlavə etmə modalı */}
            {showUserModal && (
              <div style={styles.modal}>
                <div style={styles.modalContent}>
                  <h3 style={{ marginBottom: '20px' }}>Yeni İstifadəçi Əlavə Et</h3>
                  <input 
                    style={styles.input} 
                    type="text" 
                    placeholder="Ad" 
                    value={newUser.name} 
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})} 
                  />
                  <input 
                    style={styles.input} 
                    type="text" 
                    placeholder="Soyad" 
                    value={newUser.surname} 
                    onChange={(e) => setNewUser({...newUser, surname: e.target.value})} 
                  />
                  <input 
                    style={styles.input} 
                    type="email" 
                    placeholder="Email" 
                    value={newUser.email} 
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})} 
                  />
                  <input 
                    style={styles.input} 
                    type="password" 
                    placeholder="Şifrə" 
                    value={newUser.password} 
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})} 
                  />
                  <select 
                    style={styles.input} 
                    value={newUser.role} 
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  >
                    <option value="operator">Operator</option>
                    <option value="admin">Admin</option>
                  </select>
                  <select 
                    style={styles.input} 
                    value={newUser.department} 
                    onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                  >
                    {Object.entries(departments).map(([key, dept]) => (
                      <option key={key} value={key}>{dept.name}</option>
                    ))}
                  </select>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button onClick={addNewUser} style={{ ...styles.button, background: '#10b981', color: 'white', flex: 1 }}>Əlavə Et</button>
                    <button onClick={() => setShowUserModal(false)} style={{ ...styles.button, background: '#6b7280', color: 'white', flex: 1 }}>Ləğv Et</button>
                  </div>
                </div>
              </div>
            )}

            <div style={styles.card}>
              <div style={styles.table}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr', gap: '10px', padding: '15px', background: '#f8fafc', fontWeight: '600' }}>
                  <div>Ad Soyad</div>
                  <div>Email</div>
                  <div>Rol</div>
                  <div>Şöbə</div>
                  <div>Status</div>
                  <div>Əməliyyatlar</div>
                </div>
                // AdminDashboard-a əlavə edin
const testRulesAndData = async () => {
  try {
    console.log("=== FIREBASE RULES TEST ===");
    
    // 1. Current user profile
    const currentProfile = await getDoc(doc(db, "users", auth.currentUser.uid, "profile", "userProfile"));
    console.log("👤 Current User:", currentProfile.exists() ? currentProfile.data() : "NO PROFILE");
    
    // 2. CollectionGroup test
    try {
      const profilesQuery = query(collectionGroup(db, "profile"));
      const groupSnapshot = await getDocs(profilesQuery);
      console.log("🔍 CollectionGroup result:", groupSnapshot.docs.length, "profiles");
      groupSnapshot.docs.forEach(doc => {
        console.log("   -", doc.ref.path, "=>", doc.data().name, doc.data().role);
      });
    } catch (groupError) {
      console.log("❌ CollectionGroup failed:", groupError.message);
    }
    
    // 3. Manual users test
    const usersSnapshot = await getDocs(collection(db, "users"));
    console.log("📁 Users collection:", usersSnapshot.docs.length, "documents");
    
    console.log("=== TEST COMPLETE ===");
    
  } catch (error) {
    console.error("🔥 Test error:", error);
  }
};
                {users.map(user => (
                  <div key={user.id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr', gap: '10px', padding: '15px', borderBottom: '1px solid #e2e8f0', alignItems: 'center' }}>
                    <div style={{ fontWeight: '500' }}>
                      {user.fullName || `${user.name} ${user.surname}`}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '14px' }}>{user.email}</div>
                    <div>
                      <span style={{
                        background: user.role === 'admin' ? '#fef3c7' : '#dbeafe',
                        color: user.role === 'admin' ? '#92400e' : '#1e40af',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {user.role === 'admin' ? 'Admin' : 'Operator'}
                      </span>
                    </div>
                    <div>
                      <span style={{
                        background: departments[user.department]?.color + '20',
                        color: departments[user.department]?.color,
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {departments[user.department]?.name}
                      </span>
                    </div>
                    <div>
                      <span style={{
                        background: user.status === 'active' ? '#dcfce7' : '#fee2e2',
                        color: user.status === 'active' ? '#166534' : '#dc2626',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {user.status === 'active' ? 'Aktiv' : 'Deaktiv'}
                      </span>
                    </div>
                    <div>
                      <button 
                        onClick={() => deleteUser(user.id)} 
                        style={{ ...styles.button, background: '#ef4444', color: 'white', padding: '8px 12px', fontSize: '12px' }}
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Digər view-lər üçün eyni struktur... */}
        {/* Schedules, Shifts, Approvals view-ləri əlavə edilə bilər */}
      </div>
    </div>
  );
};

export default AdminDashboard;