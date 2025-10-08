import React, { useEffect, useState, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
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
  where, 
  orderBy,
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';

// Firebase konfiqurasiyası
const firebaseConfig = {
  apiKey: "AIzaSyAq7snrwhyM0Smp7RTAnH9PcgwDdp2DovE",
  authDomain: "callcenter-schedule.firebaseapp.com",
  projectId: "callcenter-schedule",
  storageBucket: "callcenter-schedule.firebasestorage.app",
  messagingSenderId: "257340791235",
  appId: "1:257340791235:web:a02aac12fd4f2dec588576",
  measurementId: "G-FX3V173LS5"
};

// Firebase initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Professional Stil Konstantları
const styles = {
  app: { 
    minHeight: '100vh', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif' 
  },
  loadingScreen: { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh', 
    color: 'white', 
    textAlign: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  loginContainer: { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '100vh', 
    padding: '20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  loginForm: { 
    background: 'rgba(255, 255, 255, 0.95)', 
    backdropFilter: 'blur(10px)',
    padding: '40px', 
    borderRadius: '20px', 
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)', 
    width: '100%', 
    maxWidth: '400px',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  dashboard: { 
    minHeight: '100vh', 
    background: '#f8fafc',
    backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
  },
  header: { 
    background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)', 
    padding: '20px 30px', 
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderBottom: '3px solid rgba(255,255,255,0.1)'
  },
  nav: { 
    background: 'white', 
    padding: '20px 30px', 
    borderBottom: '1px solid #e2e8f0', 
    display: 'flex', 
    gap: '12px', 
    flexWrap: 'wrap',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
  },
  content: { 
    padding: '30px', 
    maxWidth: '1400px', 
    margin: '0 auto' 
  },
  button: { 
    padding: '12px 24px', 
    border: 'none', 
    borderRadius: '12px', 
    cursor: 'pointer', 
    fontSize: '14px', 
    fontWeight: '600', 
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  input: { 
    padding: '14px 16px', 
    border: '2px solid #e2e8f0', 
    borderRadius: '12px', 
    fontSize: '14px', 
    width: '100%', 
    marginBottom: '20px',
    transition: 'all 0.3s ease',
    background: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  table: { 
    width: '100%', 
    background: 'white', 
    borderRadius: '16px', 
    overflow: 'hidden', 
    boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
    border: '1px solid #f1f5f9'
  },
  card: { 
    background: 'white', 
    padding: '24px', 
    borderRadius: '16px', 
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)', 
    marginBottom: '24px',
    border: '1px solid #f1f5f9'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(8px)'
  },
  modalContent: {
    background: 'white',
    padding: '32px',
    borderRadius: '20px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
    border: '1px solid rgba(255,255,255,0.2)'
  },
  searchBox: {
    padding: '14px 20px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '14px',
    width: '100%',
    marginBottom: '24px',
    background: 'white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease'
  },
  badge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px'
  },
  grid2col: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '24px'
  },
  grid3col: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px'
  }
};

// Şöbələr
const departments = {
  info_sale: { name: 'İnfo Sale', color: '#3B82F6', bgColor: '#dbeafe' },
  technical: { name: 'Texniki', color: '#DC2626', bgColor: '#fee2e2' },
  management: { name: 'İdarəetmə', color: '#F59E0B', bgColor: '#fef3c7' }
};

// Rollar
const roles = {
  operator: { name: 'Operator', color: '#3B82F6', bgColor: '#dbeafe' },
  admin: { name: 'Qrup Rəhbəri', color: '#DC2626', bgColor: '#fee2e2' }
};

// Növbə növləri - Genişləndirilmiş
const mockShiftTypes = [
  { id: 'shift_morning', name: 'Səhər', startTime: '08:00', endTime: '16:00', color: '#60A5FA', active: true },
  { id: 'shift_evening', name: 'Axşam', startTime: '16:00', endTime: '00:00', color: '#3B82F6', active: true },
  { id: 'shift_night', name: 'Gecə', startTime: '00:00', endTime: '08:00', color: '#1D4ED8', active: true },
  { id: 'shift_9_5', name: '9-5', startTime: '09:00', endTime: '17:00', color: '#10B981', active: true },
  { id: 'shift_9_6', name: '9-6', startTime: '09:00', endTime: '18:00', color: '#059669', active: true },
  { id: 'shift_10_7', name: '10-7', startTime: '10:00', endTime: '19:00', color: '#047857', active: true },
  { id: 'shift_12_8', name: '12-8', startTime: '12:00', endTime: '20:00', color: '#065F46', active: true },
  { id: 'shift_14_22', name: '14-22', startTime: '14:00', endTime: '22:00', color: '#EC4899', active: true },
  { id: 'shift_off', name: 'OFF', startTime: '00:00', endTime: '00:00', color: '#6B7280', active: true },
  { id: 'shift_m', name: 'M', startTime: '00:00', endTime: '00:00', color: '#F59E0B', active: true }
];

// Fasilə konfiqurasiyası - Genişləndirilmiş
const breakConfig = {
  tea: {
    name: 'Çay Fasiləsi',
    color: '#3B82F6',
    times: [
      '10:00-10:10', '10:10-10:20', '10:20-10:30', '10:30-10:40',
      '11:00-11:10', '11:10-11:20', '11:20-11:30', '11:30-11:40',
      '15:00-15:10', '15:10-15:20', '15:20-15:30', '15:30-15:40',
      '16:00-16:10', '16:10-16:20', '16:20-16:30', '16:30-16:40',
      '17:00-17:10', '17:10-17:20', '17:20-17:30', '17:30-17:40',
      '20:00-20:10', '20:10-20:20', '20:20-20:30', '20:30-20:40',
      '21:00-21:10', '21:10-21:20', '21:20-21:30', '21:30-21:40'
    ],
    duration: 10
  },
  lunch: {
    name: 'Nahar Fasiləsi',
    color: '#10B981',
    times: [
      '12:00-12:30', '12:10-12:40', '12:20-12:50', '12:30-13:00',
      '13:00-13:30', '13:10-13:40', '13:20-13:50', '13:30-14:00',
      '14:00-14:30', '14:10-14:40', '14:20-14:50', '14:30-15:00',
      '18:00-18:30', '18:10-18:40', '18:20-18:50', '18:30-19:00',
      '19:00-19:30', '19:10-19:40', '19:20-19:50', '19:30-20:00'
    ],
    duration: 30
  }
};

// Əsas App komponenti
function App() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [users, setUsers] = useState([]);
  const [shiftTypes, setShiftTypes] = useState([]);
  const [shiftChanges, setShiftChanges] = useState([]);
  const [vacations, setVacations] = useState([]);
  const [breaks, setBreaks] = useState([]);
  const [breakRequests, setBreakRequests] = useState([]);
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Real-time listeners
  useEffect(() => {
    if (userProfile) {
      console.log("🔄 Real-time listeners başladı...");
      
      // Users listener
      const usersQuery = query(collection(db, "users"));
      const unsubscribeUsers = onSnapshot(usersQuery, 
        (snapshot) => {
          const usersList = [];
          snapshot.forEach(doc => {
            const userData = doc.data();
            usersList.push({
              id: doc.id,
              name: userData.name || 'Ad yoxdur',
              email: userData.email || 'Email yoxdur',
              role: userData.role || 'operator',
              department: userData.department || 'info_sale',
              status: userData.status || 'active',
              ...userData
            });
          });
          setUsers(usersList);
        },
        (error) => {
          console.error('Users listener xətası:', error);
        }
      );

      // Schedules listener
      const schedulesQuery = query(collection(db, 'schedules'));
      const unsubscribeSchedules = onSnapshot(schedulesQuery,
        (snapshot) => {
          const schedulesList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setSchedules(schedulesList);
        },
        (error) => {
          console.error('Schedules listener xətası:', error);
        }
      );

      // Shift changes listener
      const changesQuery = query(collection(db, 'shiftChanges'));
      const unsubscribeChanges = onSnapshot(changesQuery,
        (snapshot) => {
          const changesList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setShiftChanges(changesList);
        },
        (error) => {
          console.error('Shift changes listener xətası:', error);
        }
      );

      // Vacations listener
      const vacationsQuery = query(collection(db, 'vacations'));
      const unsubscribeVacations = onSnapshot(vacationsQuery,
        (snapshot) => {
          const vacationsList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setVacations(vacationsList);
        },
        (error) => {
          console.error('Vacations listener xətası:', error);
        }
      );

      // Breaks listener
      const breaksQuery = query(collection(db, 'breaks'));
      const unsubscribeBreaks = onSnapshot(breaksQuery,
        (snapshot) => {
          const breaksList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setBreaks(breaksList);
        },
        (error) => {
          console.error('Breaks listener xətası:', error);
        }
      );

      // Break requests listener
      const breakRequestsQuery = query(collection(db, 'breakRequests'));
      const unsubscribeBreakRequests = onSnapshot(breakRequestsQuery,
        (snapshot) => {
          const requestsList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setBreakRequests(requestsList);
        },
        (error) => {
          console.error('Break requests listener xətası:', error);
        }
      );

      return () => {
        unsubscribeUsers();
        unsubscribeSchedules();
        unsubscribeChanges();
        unsubscribeVacations();
        unsubscribeBreaks();
        unsubscribeBreakRequests();
      };
    }
  }, [userProfile]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await loadUserProfile(user);
        await initializeShiftTypes();
      } else {
        setUser(null);
        setUserProfile(null);
        setUsers([]);
        setSchedules([]);
        setShiftChanges([]);
        setVacations([]);
        setBreaks([]);
        setBreakRequests([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadUserProfile = async (user) => {
    try {
      const currentUser = auth.currentUser || user;
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      
      if (userDoc.exists()) {
        const profileData = { id: currentUser.uid, ...userDoc.data() };
        setUserProfile(profileData);
        return profileData;
      } else {
        // Yeni istifadəçi üçün profil yarat
        const defaultProfile = {
          name: currentUser.email.split('@')[0],
          email: currentUser.email,
          role: 'operator',
          department: 'info_sale',
          status: 'active',
          createdAt: serverTimestamp()
        };
  
        await setDoc(doc(db, 'users', currentUser.uid), defaultProfile);
        const newProfile = { id: currentUser.uid, ...defaultProfile };
        setUserProfile(newProfile);
        return newProfile;
      }
    } catch (error) {
      console.error('❌ Profile load error:', error);
      throw error;
    }
  };

  const initializeShiftTypes = async () => {
    try {
      const shiftsSnapshot = await getDocs(collection(db, 'shiftTypes'));
      
      if (shiftsSnapshot.empty) {
        // Əgər shiftTypes boşdursa, mock datanı əlavə et
        for (const shift of mockShiftTypes) {
          await setDoc(doc(db, 'shiftTypes', shift.id), {
            ...shift,
            createdAt: serverTimestamp()
          });
        }
        setShiftTypes(mockShiftTypes);
      } else {
        const shiftsData = shiftsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setShiftTypes(shiftsData);
      }
    } catch (error) {
      console.error('❌ ShiftTypes initialization error:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    } catch (error) {
      setAuthError(error.message);
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingScreen}>
        <div>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>⏳</div>
          <h1 style={{ fontSize: '28px', marginBottom: '10px', fontWeight: '700' }}>NÖVBƏ SİSTEMİ</h1>
          <p style={{ fontSize: '16px', opacity: 0.8 }}>Yüklənir...</p>
          <div style={{ marginTop: '30px' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              border: '4px solid rgba(255,255,255,0.3)', 
              borderTop: '4px solid white', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite', 
              margin: '0 auto' 
            }}></div>
          </div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.app}>
        <div style={styles.loginContainer}>
          <div style={styles.loginForm}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>📊</div>
              <h2 style={{ color: '#1e293b', marginBottom: '10px', fontSize: '24px', fontWeight: '700' }}>
                NÖVBƏ SİSTEMİ
              </h2>
              <p style={{ color: '#64748b', fontSize: '14px' }}>Professional Call Center İdarəetmə Sistemi</p>
            </div>
            
            {authError && (
              <div style={{ 
                background: '#fee2e2', 
                color: '#dc2626', 
                padding: '12px 16px', 
                borderRadius: '12px', 
                marginBottom: '20px', 
                fontSize: '14px',
                border: '1px solid #fecaca',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>⚠️</span>
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '20px' }}>
                <input 
                  style={{ 
                    ...styles.input, 
                    borderColor: loginEmail ? '#3b82f6' : '#e2e8f0',
                    background: loginEmail ? '#f8fafc' : 'white'
                  }} 
                  type="email" 
                  placeholder="📧 Email ünvanınız" 
                  value={loginEmail} 
                  onChange={(e) => setLoginEmail(e.target.value)} 
                  required 
                  disabled={authLoading}
                />
              </div>
              <div style={{ marginBottom: '25px' }}>
                <input 
                  style={{ 
                    ...styles.input, 
                    borderColor: loginPassword ? '#3b82f6' : '#e2e8f0',
                    background: loginPassword ? '#f8fafc' : 'white'
                  }} 
                  type="password" 
                  placeholder="🔒 Şifrəniz" 
                  value={loginPassword} 
                  onChange={(e) => setLoginPassword(e.target.value)} 
                  required 
                  disabled={authLoading}
                />
              </div>
              <button 
                type="submit" 
                disabled={authLoading}
                style={{ 
                  ...styles.button, 
                  background: authLoading ? '#9ca3af' : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', 
                  color: 'white', 
                  width: '100%',
                  opacity: authLoading ? 0.7 : 1,
                  fontSize: '15px',
                  fontWeight: '600',
                  padding: '16px'
                }}
              >
                {authLoading ? (
                  <>
                    <div style={{ 
                      width: '16px', 
                      height: '16px', 
                      border: '2px solid rgba(255,255,255,0.3)', 
                      borderTop: '2px solid white', 
                      borderRadius: '50%', 
                      animation: 'spin 1s linear infinite' 
                    }}></div>
                    Daxil Olunur...
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    Daxil Ol
                  </>
                )}
              </button>
              
              <div style={{ 
                marginTop: '20px', 
                padding: '20px', 
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', 
                borderRadius: '12px', 
                fontSize: '13px', 
                color: '#0369a1',
                border: '1px solid #bae6fd'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🧪</span>
                  <span>Test Hesabları:</span>
                </div>
                <div style={{ lineHeight: '1.6' }}>
                  <div>👑 <strong>admin@callcenter.com</strong> / 123456</div>
                  <div>👤 <strong>operator@callcenter.com</strong> / 123456</div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div style={styles.loadingScreen}>
        <div>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>👤</div>
          <h1 style={{ fontSize: '28px', marginBottom: '10px', fontWeight: '700' }}>NÖVBƏ SİSTEMİ</h1>
          <p style={{ fontSize: '16px', opacity: 0.8 }}>İstifadəçi məlumatları yüklənir...</p>
          <div style={{ marginTop: '30px' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              border: '4px solid rgba(255,255,255,0.3)', 
              borderTop: '4px solid white', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite', 
              margin: '0 auto' 
            }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Routing
  if (userProfile.role === 'admin') {
    return (
      <AdminDashboard 
        user={user}
        userProfile={userProfile}
        users={users}
        schedules={schedules}
        shiftTypes={shiftTypes}
        shiftChanges={shiftChanges}
        vacations={vacations}
        breaks={breaks}
        breakRequests={breakRequests}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <OperatorDashboard 
      user={user}
      userProfile={userProfile}
      users={users}
      schedules={schedules}
      shiftChanges={shiftChanges}
      vacations={vacations}
      breaks={breaks}
      breakRequests={breakRequests}
      onLogout={handleLogout}
    />
  );
}

// OPERATOR DASHBOARD - Professional Design
function OperatorDashboard({ user, userProfile, users, schedules, shiftChanges, vacations, breaks, breakRequests, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [showVacationModal, setShowVacationModal] = useState(false);
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [changeRequest, setChangeRequest] = useState({ toUserId: '', date: '', reason: '' });
  const [vacationRequest, setVacationRequest] = useState({ startDate: '', endDate: '', reason: '' });
  const [breakRequest, setBreakRequest] = useState({ breakType: '', breakTime: '', reason: '' });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  // Operator yalnız öz məlumatlarını görür
  const userSchedules = useMemo(() => 
    schedules.filter(s => s.userId === user.uid), [schedules, user.uid]);
  
  const userChanges = useMemo(() => 
    shiftChanges.filter(c => c.fromUserId === user.uid || c.toUserId === user.uid), [shiftChanges, user.uid]);
  
  const userVacations = useMemo(() => 
    vacations.filter(v => v.userId === user.uid), [vacations, user.uid]);
  
  const userBreaks = useMemo(() => 
    breaks.filter(b => b.userId === user.uid && b.date === selectedDate), [breaks, user.uid, selectedDate]);
  
  // Fasilə sorğuları
  const userBreakRequests = useMemo(() => 
    breakRequests.filter(r => r.userId === user.uid), [breakRequests, user.uid]);
  
  const pendingBreakRequests = useMemo(() => 
    breakRequests.filter(r => r.status === 'pending'), [breakRequests]);

  // Eyni şöbədəki digər operatorlar
  const departmentUsers = useMemo(() => 
    users.filter(u => 
      u.department === userProfile.department && 
      u.id !== user.uid && 
      u.status === 'active' &&
      u.role === 'operator'
    ), [users, userProfile.department, user.uid]);

  // Bugünkü bütün fasilələr
  const allBreaksToday = useMemo(() => 
    breaks.filter(b => b.date === selectedDate), [breaks, selectedDate]);
  
  const teaBreaks = useMemo(() => 
    allBreaksToday.filter(b => b.breakType === 'tea'), [allBreaksToday]);
  
  const lunchBreaks = useMemo(() => 
    allBreaksToday.filter(b => b.breakType === 'lunch'), [allBreaksToday]);

  const handleShiftChange = async () => {
    if (!changeRequest.toUserId || !changeRequest.date) {
      alert('⚠️ Zəhmət olmasa bütün sahələri doldurun!');
      return;
    }

    try {
      const currentSchedule = schedules.find(s => 
        s.userId === user.uid && s.date === changeRequest.date
      );

      const toUserSchedule = schedules.find(s => 
        s.userId === changeRequest.toUserId && s.date === changeRequest.date
      );

      if (!currentSchedule) {
        alert('❌ Seçilmiş tarixdə növbəniz yoxdur!');
        return;
      }

      if (!toUserSchedule) {
        alert('❌ Seçilmiş operatorun həmin tarixdə növbəsi yoxdur!');
        return;
      }

      await addDoc(collection(db, 'shiftChanges'), {
        fromUserId: user.uid,
        fromUserName: userProfile.name,
        fromUserDepartment: userProfile.department,
        toUserId: changeRequest.toUserId,
        toUserName: departmentUsers.find(u => u.id === changeRequest.toUserId)?.name,
        date: changeRequest.date,
        fromShift: currentSchedule.shiftName,
        toShift: toUserSchedule.shiftName,
        reason: changeRequest.reason,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      alert('✅ Növbə dəyişikliyi sorğusu göndərildi!');
      setShowChangeModal(false);
      setChangeRequest({ toUserId: '', date: '', reason: '' });
    } catch (error) {
      console.error('Shift change error:', error);
      alert('❌ Xəta: ' + error.message);
    }
  };

  const handleVacationRequest = async () => {
    if (!vacationRequest.startDate || !vacationRequest.endDate) {
      alert('⚠️ Zəhmət olmasa bütün sahələri doldurun!');
      return;
    }

    try {
      await addDoc(collection(db, 'vacations'), {
        userId: user.uid,
        userName: userProfile.name,
        userDepartment: userProfile.department,
        startDate: vacationRequest.startDate,
        endDate: vacationRequest.endDate,
        reason: vacationRequest.reason,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      alert('✅ Məzuniyyət sorğusu göndərildi!');
      setShowVacationModal(false);
      setVacationRequest({ startDate: '', endDate: '', reason: '' });
    } catch (error) {
      console.error('Vacation request error:', error);
      alert('❌ Xəta: ' + error.message);
    }
  };

  const handleBreakRequest = async () => {
    if (!breakRequest.breakType || !breakRequest.breakTime) {
      alert('⚠️ Zəhmət olmasa bütün sahələri doldurun!');
      return;
    }

    try {
      await addDoc(collection(db, 'breakRequests'), {
        userId: user.uid,
        userName: userProfile.name,
        userDepartment: userProfile.department,
        breakType: breakRequest.breakType,
        breakTime: breakRequest.breakTime,
        date: selectedDate,
        reason: breakRequest.reason,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      alert('✅ Fasilə dəyişikliyi sorğusu göndərildi!');
      setShowBreakModal(false);
      setBreakRequest({ breakType: '', breakTime: '', reason: '' });
    } catch (error) {
      console.error('Break request error:', error);
      alert('❌ Xəta: ' + error.message);
    }
  };

  const approveBreakRequest = async (requestId) => {
    try {
      const request = breakRequests.find(r => r.id === requestId);
      
      if (!request) {
        alert('❌ Sorğu tapılmadı!');
        return;
      }

      // Köhnə fasiləni sil
      const oldBreak = breaks.find(b => 
        b.userId === request.userId && 
        b.date === request.date && 
        b.breakType === request.breakType
      );
      
      if (oldBreak) {
        await deleteDoc(doc(db, 'breaks', oldBreak.id));
      }

      // Yeni fasilə əlavə et
      await addDoc(collection(db, 'breaks'), {
        userId: request.userId,
        userName: request.userName,
        breakType: request.breakType,
        breakTime: request.breakTime,
        date: request.date,
        status: 'confirmed',
        approvedBy: userProfile.name,
        approvedAt: serverTimestamp()
      });

      // Sorğunu təsdiqlə
      await updateDoc(doc(db, 'breakRequests', requestId), {
        status: 'approved',
        approvedBy: userProfile.name,
        approvedAt: serverTimestamp()
      });

      alert('✅ Fasilə dəyişikliyi təsdiqləndi!');
    } catch (error) {
      console.error('Break approval error:', error);
      alert('❌ Xəta: ' + error.message);
    }
  };

  const rejectBreakRequest = async (requestId) => {
    try {
      await updateDoc(doc(db, 'breakRequests', requestId), {
        status: 'rejected',
        approvedBy: userProfile.name,
        approvedAt: serverTimestamp()
      });

      alert('❌ Fasilə dəyişikliyi rədd edildi!');
    } catch (error) {
      console.error('Break rejection error:', error);
      alert('❌ Xəta: ' + error.message);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'schedule':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ color: '#1e293b', margin: 0, fontSize: '24px', fontWeight: '700' }}>Növbə Cədvəlim</h2>
              <div style={{ 
                background: '#f0f9ff', 
                color: '#0369a1', 
                padding: '8px 16px', 
                borderRadius: '12px', 
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>📅</span>
                <span>{userSchedules.length} növbə</span>
              </div>
            </div>
            
            {userSchedules.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                color: '#64748b', 
                padding: '60px 40px',
                background: 'white',
                borderRadius: '16px',
                border: '2px dashed #e2e8f0'
              }}>
                <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>📅</div>
                <h3 style={{ color: '#475569', marginBottom: '12px', fontSize: '20px', fontWeight: '600' }}>Hələlik növbəniz yoxdur</h3>
                <p style={{ fontSize: '15px', opacity: 0.7 }}>Növbə cədvəliniz planlaşdırılanda burada görünəcək</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {userSchedules.map(schedule => (
                  <div key={schedule.id} style={{ 
                    ...styles.card, 
                    borderLeft: `4px solid #3b82f6`,
                    background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ fontWeight: '600', fontSize: '18px', color: '#1e40af' }}>
                        {schedule.shiftName}
                      </div>
                      <div style={{ 
                        background: '#dbeafe', 
                        color: '#1e40af', 
                        padding: '4px 8px', 
                        borderRadius: '8px', 
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {schedule.startTime} - {schedule.endTime}
                      </div>
                    </div>
                    
                    <div style={{ color: '#64748b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>📅</span>
                      <span>{new Date(schedule.date).toLocaleDateString('az-AZ', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    
                    {schedule.assignedBy && (
                      <div style={{ 
                        marginTop: '12px',
                        padding: '8px 12px',
                        background: '#f0f9ff',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: '#0369a1',
                        border: '1px solid #bae6fd'
                      }}>
                        <strong>👤 Təyin edən:</strong> {schedule.assignedBy}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'breaks':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ color: '#1e293b', margin: 0, fontSize: '24px', fontWeight: '700' }}>Fasilələr</h2>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ 
                  background: '#f0f9ff', 
                  color: '#0369a1', 
                  padding: '8px 16px', 
                  borderRadius: '12px', 
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span>📅</span>
                  <span>{selectedDate}</span>
                </div>
                <button 
                  onClick={() => setShowBreakModal(true)}
                  style={{ 
                    ...styles.button, 
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', 
                    color: 'white',
                    fontWeight: '600'
                  }}
                >
                  <span>➕</span>
                  Fasilə Dəyişikliyi
                </button>
              </div>
            </div>

            <div style={styles.grid2col}>
              {/* Öz fasilələrim */}
              <div style={styles.card}>
                <h3 style={{ 
                  color: '#3b82f6', 
                  marginBottom: '20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  fontSize: '18px',
                  fontWeight: '600'
                }}>
                  <span style={{ 
                    background: '#3b82f6', 
                    color: 'white', 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '8px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '16px'
                  }}>👤</span>
                  <span>Mənim Fasilələrim</span>
                </h3>
                {userBreaks.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#64748b', padding: '40px 20px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px', opacity: 0.5 }}>☕</div>
                    <p style={{ fontSize: '15px' }}>Bu gün üçün fasiləniz yoxdur</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {userBreaks.filter(b => b.breakType === 'tea').map((breakItem, index) => (
                      <div key={breakItem.id} style={{ 
                        padding: '16px', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}>
                        <div style={{ 
                          width: '40px',
                          height: '40px',
                          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: '600'
                        }}>
                          ☕
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', color: '#1e40af', fontSize: '15px' }}>
                            {breakItem.breakTime.includes('10:') || breakItem.breakTime.includes('11:') ? '1-ci Çay' : 
                             breakItem.breakTime.includes('15:') || breakItem.breakTime.includes('16:') ? '2-ci Çay' : '3-cü Çay'}
                          </div>
                          <div style={{ color: '#64748b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                            <span>🕐</span>
                            <span>{breakItem.breakTime}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {userBreaks.filter(b => b.breakType === 'lunch').map((breakItem, index) => (
                      <div key={breakItem.id} style={{ 
                        padding: '16px', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}>
                        <div style={{ 
                          width: '40px',
                          height: '40px',
                          background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: '600'
                        }}>
                          🍴
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', color: '#047857', fontSize: '15px' }}>
                            Nahar Fasiləsi
                          </div>
                          <div style={{ color: '#64748b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                            <span>🕐</span>
                            <span>{breakItem.breakTime}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bütün fasilələr */}
              <div style={styles.card}>
                <h3 style={{ 
                  color: '#f59e0b', 
                  marginBottom: '20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  fontSize: '18px',
                  fontWeight: '600'
                }}>
                  <span style={{ 
                    background: '#f59e0b', 
                    color: 'white', 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '8px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '16px'
                  }}>👥</span>
                  <span>Bütün Fasilələr</span>
                </h3>
                
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {/* Çay fasilələri */}
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ 
                      color: '#3b82f6', 
                      fontSize: '15px', 
                      marginBottom: '12px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      fontWeight: '600'
                    }}>
                      <span>☕</span>
                      <span>Çay Fasilələri ({teaBreaks.length})</span>
                    </h4>
                    {teaBreaks.length === 0 ? (
                      <div style={{ 
                        color: '#64748b', 
                        fontSize: '13px', 
                        textAlign: 'center', 
                        padding: '16px', 
                        background: '#f8fafc', 
                        borderRadius: '8px',
                        border: '1px dashed #e2e8f0'
                      }}>
                        Çay fasiləsi yoxdur
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {teaBreaks.map(breakItem => (
                          <div key={breakItem.id} style={{ 
                            padding: '12px 16px', 
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '13px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: 'white',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#f8fafc';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ 
                                width: '8px', 
                                height: '8px', 
                                background: '#3b82f6', 
                                borderRadius: '50%' 
                              }}></div>
                              <strong>{breakItem.userName}</strong>
                            </div>
                            <div style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span>{breakItem.breakTime}</span>
                              <span style={{ 
                                background: '#f1f5f9', 
                                color: '#64748b', 
                                padding: '2px 6px', 
                                borderRadius: '6px', 
                                fontSize: '11px',
                                fontWeight: '500'
                              }}>
                                {breakItem.breakTime.includes('10:') || breakItem.breakTime.includes('11:') ? '1-ci' : 
                                 breakItem.breakTime.includes('15:') || breakItem.breakTime.includes('16:') ? '2-ci' : '3-cü'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Nahar fasilələri */}
                  <div>
                    <h4 style={{ 
                      color: '#10b981', 
                      fontSize: '15px', 
                      marginBottom: '12px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      fontWeight: '600'
                    }}>
                      <span>🍴</span>
                      <span>Nahar Fasilələri ({lunchBreaks.length})</span>
                    </h4>
                    {lunchBreaks.length === 0 ? (
                      <div style={{ 
                        color: '#64748b', 
                        fontSize: '13px', 
                        textAlign: 'center', 
                        padding: '16px', 
                        background: '#f8fafc', 
                        borderRadius: '8px',
                        border: '1px dashed #e2e8f0'
                      }}>
                        Nahar fasiləsi yoxdur
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {lunchBreaks.map(breakItem => (
                          <div key={breakItem.id} style={{ 
                            padding: '12px 16px', 
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '13px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: 'white',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#f8fafc';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ 
                                width: '8px', 
                                height: '8px', 
                                background: '#10b981', 
                                borderRadius: '50%' 
                              }}></div>
                              <strong>{breakItem.userName}</strong>
                            </div>
                            <div style={{ color: '#64748b' }}>
                              {breakItem.breakTime}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Fasilə dəyişiklik sorğuları */}
            <div style={styles.card}>
              <h3 style={{ 
                color: '#ef4444', 
                marginBottom: '20px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                <span style={{ 
                  background: '#ef4444', 
                  color: 'white', 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '8px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '16px'
                }}>📋</span>
                <span>Fasilə Dəyişiklik Sorğuları ({pendingBreakRequests.length})</span>
              </h3>
              
              {pendingBreakRequests.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#64748b', padding: '40px 20px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px', opacity: 0.5 }}>📭</div>
                  <p style={{ fontSize: '15px' }}>Gözləmədə olan sorğu yoxdur</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {pendingBreakRequests.map(request => (
                    <div key={request.id} style={{ 
                      padding: '20px', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '12px', 
                      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{ fontWeight: '600', fontSize: '16px', color: '#1e293b' }}>{request.userName}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            background: request.breakType === 'tea' ? '#dbeafe' : '#dcfce7',
                            color: request.breakType === 'tea' ? '#1e40af' : '#047857',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            {request.breakType === 'tea' ? '☕ Çay' : '🍴 Nahar'}
                          </span>
                        </div>
                      </div>
                      
                      <div style={{ color: '#64748b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>🕐</span>
                          <span>{request.breakTime}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>📅</span>
                          <span>{request.date}</span>
                        </div>
                      </div>
                      
                      {request.reason && (
                        <div style={{ 
                          color: '#64748b', 
                          fontSize: '13px', 
                          marginBottom: '16px', 
                          padding: '12px', 
                          background: 'white', 
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0'
                        }}>
                          <strong>📝 Səbəb:</strong> {request.reason}
                        </div>
                      )}
                      
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button 
                          onClick={() => approveBreakRequest(request.id)}
                          style={{ 
                            ...styles.button, 
                            background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', 
                            color: 'white', 
                            flex: 1,
                            fontWeight: '600',
                            fontSize: '14px'
                          }}
                        >
                          <span>✅</span>
                          Təsdiqlə
                        </button>
                        <button 
                          onClick={() => rejectBreakRequest(request.id)}
                          style={{ 
                            ...styles.button, 
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
                            color: 'white', 
                            flex: 1,
                            fontWeight: '600',
                            fontSize: '14px'
                          }}
                        >
                          <span>❌</span>
                          Rədd Et
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'changes':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ color: '#1e293b', margin: 0, fontSize: '24px', fontWeight: '700' }}>Növbə Dəyişikliklərim</h2>
              <button 
                onClick={() => setShowChangeModal(true)}
                style={{ 
                  ...styles.button, 
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', 
                  color: 'white',
                  fontWeight: '600'
                }}
              >
                <span>➕</span>
                Yeni Dəyişiklik Sorğusu
              </button>
            </div>
            
            <div style={styles.card}>
              {userChanges.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#64748b', padding: '60px 40px' }}>
                  <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>🔄</div>
                  <h3 style={{ color: '#475569', marginBottom: '12px', fontSize: '20px', fontWeight: '600' }}>Hələlik növbə dəyişikliyiniz yoxdur</h3>
                  <p style={{ fontSize: '15px', opacity: 0.7 }}>Növbə dəyişikliyi sorğusu göndərdikdə burada görünəcək</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {userChanges.map(change => (
                    <div key={change.id} style={{ 
                      padding: '20px', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: change.status === 'pending' ? 
                        'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' : 
                        change.status === 'approved' ? 
                        'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : 
                        'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '8px', color: '#1e293b' }}>
                          {change.fromUserId === user.uid ? (
                            <>
                              <span style={{ color: '#3b82f6' }}>Siz</span> → <span style={{ color: '#10b981' }}>{change.toUserName}</span>
                            </>
                          ) : (
                            <>
                              <span style={{ color: '#10b981' }}>{change.fromUserName}</span> → <span style={{ color: '#3b82f6' }}>Siz</span>
                            </>
                          )}
                        </div>
                        <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>📅</span>
                            <span>{change.date}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>🔄</span>
                            <span>{change.fromShift} → {change.toShift}</span>
                          </div>
                        </div>
                        {change.reason && (
                          <div style={{ color: '#64748b', fontSize: '13px', marginTop: '8px', padding: '8px 12px', background: 'rgba(255,255,255,0.7)', borderRadius: '6px' }}>
                            <strong>📝 Səbəb:</strong> {change.reason}
                          </div>
                        )}
                        {change.approvedBy && (
                          <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <strong>👤 Təsdiqləyən:</strong> {change.approvedBy} • {change.approvedAt?.toDate?.().toLocaleDateString('az-AZ')}
                          </div>
                        )}
                      </div>
                      <div>
                        <span style={{
                          background: change.status === 'approved' ? 
                            'linear-gradient(135deg, #10b981 0%, #047857 100%)' : 
                            change.status === 'rejected' ? 
                            'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 
                            'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          minWidth: '100px',
                          justifyContent: 'center'
                        }}>
                          {change.status === 'approved' ? '✅ Təsdiqləndi' : 
                           change.status === 'rejected' ? '❌ Rədd edildi' : '⏳ Gözləyir'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      
      case 'vacations':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ color: '#1e293b', margin: 0, fontSize: '24px', fontWeight: '700' }}>Məzuniyyətlərim</h2>
              <button 
                onClick={() => setShowVacationModal(true)}
                style={{ 
                  ...styles.button, 
                  background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', 
                  color: 'white',
                  fontWeight: '600'
                }}
              >
                <span>🏖️</span>
                Yeni Məzuniyyət Sorğusu
              </button>
            </div>
            
            <div style={styles.card}>
              {userVacations.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#64748b', padding: '60px 40px' }}>
                  <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>🏖️</div>
                  <h3 style={{ color: '#475569', marginBottom: '12px', fontSize: '20px', fontWeight: '600' }}>Hələlik məzuniyyət sorğunuz yoxdur</h3>
                  <p style={{ fontSize: '15px', opacity: 0.7 }}>Məzuniyyət sorğusu göndərdikdə burada görünəcək</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {userVacations.map(vacation => (
                    <div key={vacation.id} style={{ 
                      padding: '20px', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: vacation.status === 'pending' ? 
                        'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' : 
                        vacation.status === 'approved' ? 
                        'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : 
                        'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '8px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>🏖️</span>
                          <span>{vacation.startDate} - {vacation.endDate}</span>
                        </div>
                        {vacation.reason && (
                          <div style={{ color: '#64748b', fontSize: '14px', marginTop: '8px', padding: '8px 12px', background: 'rgba(255,255,255,0.7)', borderRadius: '6px' }}>
                            <strong>📝 Səbəb:</strong> {vacation.reason}
                          </div>
                        )}
                        <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span>📅 {vacation.createdAt?.toDate?.().toLocaleDateString('az-AZ')}</span>
                          {vacation.approvedBy && (
                            <span>• 👤 Təsdiqləyən: {vacation.approvedBy}</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <span style={{
                          background: vacation.status === 'approved' ? 
                            'linear-gradient(135deg, #10b981 0%, #047857 100%)' : 
                            vacation.status === 'rejected' ? 
                            'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 
                            'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          minWidth: '100px',
                          justifyContent: 'center'
                        }}>
                          {vacation.status === 'approved' ? '✅ Təsdiqləndi' : 
                           vacation.status === 'rejected' ? '❌ Rədd edildi' : '⏳ Gözləyir'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ color: '#1e293b', margin: 0, fontSize: '24px', fontWeight: '700' }}>
                Xoş gəlmisiniz, <span style={{ color: '#3b82f6' }}>{userProfile.name}</span>!
              </h2>
              <div style={{ 
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', 
                color: 'white', 
                padding: '8px 16px', 
                borderRadius: '12px', 
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>{departments[userProfile.department]?.name}</span>
                <span>•</span>
                <span>{roles[userProfile.role]?.name}</span>
              </div>
            </div>

            <div style={styles.grid3col}>
              <div style={{ 
                ...styles.card, 
                textAlign: 'center', 
                background: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)',
                border: 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(59, 130, 246, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
                <h3 style={{ color: '#1e40af', marginBottom: '12px', fontSize: '18px', fontWeight: '600' }}>Cari Növbələr</h3>
                <div style={{ fontSize: '36px', fontWeight: '700', color: '#1e40af', marginBottom: '8px' }}>{userSchedules.length}</div>
                <p style={{ color: '#64748b', fontSize: '14px' }}>Aktiv növbələrin sayı</p>
              </div>
              
              <div style={{ 
                ...styles.card, 
                textAlign: 'center', 
                background: 'linear-gradient(135deg, #f3e8ff 0%, #faf5ff 100%)',
                border: 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(168, 85, 247, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>☕</div>
                <h3 style={{ color: '#7c3aed', marginBottom: '12px', fontSize: '18px', fontWeight: '600' }}>Fasilələr</h3>
                <div style={{ fontSize: '36px', fontWeight: '700', color: '#7c3aed', marginBottom: '8px' }}>{userBreaks.length}</div>
                <p style={{ color: '#64748b', fontSize: '14px' }}>Bu gün üçün fasilələr</p>
              </div>
              
              <div style={{ 
                ...styles.card, 
                textAlign: 'center', 
                background: 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)',
                border: 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(245, 158, 11, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                <h3 style={{ color: '#92400e', marginBottom: '12px', fontSize: '18px', fontWeight: '600' }}>Sorğular</h3>
                <div style={{ fontSize: '36px', fontWeight: '700', color: '#92400e', marginBottom: '8px' }}>
                  {userChanges.filter(c => c.status === 'pending').length + userVacations.filter(v => v.status === 'pending').length}
                </div>
                <p style={{ color: '#64748b', fontSize: '14px' }}>Gözləyən sorğular</p>
              </div>
            </div>

            {/* Bugünkü fasilələr */}
            <div style={styles.card}>
              <h3 style={{ 
                marginBottom: '20px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                fontSize: '18px',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                <span style={{ 
                  background: '#3b82f6', 
                  color: 'white', 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '8px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '16px'
                }}>📅</span>
                <span>Bugünkü Fasilələrim</span>
              </h3>
              
              {userBreaks.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#64748b', padding: '40px 20px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px', opacity: 0.5 }}>😴</div>
                  <p style={{ fontSize: '15px' }}>Bu gün üçün fasiləniz yoxdur</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  {userBreaks.filter(b => b.breakType === 'tea').map((breakItem, index) => (
                    <div key={breakItem.id} style={{ 
                      padding: '20px', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)',
                      textAlign: 'center',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}>
                      <div style={{ fontSize: '32px', marginBottom: '12px' }}>☕</div>
                      <div style={{ fontWeight: '600', color: '#1e40af', marginBottom: '8px', fontSize: '16px' }}>
                        {breakItem.breakTime.includes('10:') || breakItem.breakTime.includes('11:') ? '1-ci Çay' : 
                         breakItem.breakTime.includes('15:') || breakItem.breakTime.includes('16:') ? '2-ci Çay' : '3-cü Çay'}
                      </div>
                      <div style={{ color: '#64748b', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <span>🕐</span>
                        <span>{breakItem.breakTime}</span>
                      </div>
                    </div>
                  ))}
                  
                  {userBreaks.filter(b => b.breakType === 'lunch').map((breakItem, index) => (
                    <div key={breakItem.id} style={{ 
                      padding: '20px', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%)',
                      textAlign: 'center',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}>
                      <div style={{ fontSize: '32px', marginBottom: '12px' }}>🍴</div>
                      <div style={{ fontWeight: '600', color: '#047857', marginBottom: '8px', fontSize: '16px' }}>
                        Nahar Fasiləsi
                      </div>
                      <div style={{ color: '#64748b', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <span>🕐</span>
                        <span>{breakItem.breakTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Yaxınlaşan növbələr */}
            {userSchedules.filter(s => new Date(s.date) >= new Date()).length > 0 && (
              <div style={styles.card}>
                <h3 style={{ 
                  marginBottom: '20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1e293b'
                }}>
                  <span style={{ 
                    background: '#10b981', 
                    color: 'white', 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '8px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '16px'
                  }}>🔜</span>
                  <span>Yaxınlaşan Növbələrim</span>
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                  {userSchedules
                    .filter(s => new Date(s.date) >= new Date())
                    .slice(0, 3)
                    .map(schedule => (
                    <div key={schedule.id} style={{ 
                      padding: '20px', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}>
                      <div style={{ fontWeight: '600', fontSize: '16px', color: '#1e40af', marginBottom: '8px' }}>
                        {schedule.shiftName}
                      </div>
                      <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>📅</span>
                        <span>{new Date(schedule.date).toLocaleDateString('az-AZ', { 
                          weekday: 'short',
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      <div style={{ color: '#64748b', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>🕐</span>
                        <span>{schedule.startTime} - {schedule.endTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div style={styles.dashboard}>
      <header style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            background: 'rgba(255,255,255,0.2)', 
            width: '40px', 
            height: '40px', 
            borderRadius: '10px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: '600'
          }}>
            👤
          </div>
          <div>
            <h1 style={{ color: 'white', margin: 0, fontSize: '20px', fontWeight: '700' }}>OPERATOR PANEL</h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '12px' }}>Professional Növbə İdarəetmə Sistemi</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ 
            color: 'white', 
            background: 'rgba(255,255,255,0.15)', 
            padding: '10px 16px', 
            borderRadius: '12px', 
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backdropFilter: 'blur(10px)'
          }}>
            <span style={{ 
              background: departments[userProfile.department]?.color, 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%' 
            }}></span>
            <span>{userProfile?.name}</span>
            <span style={{ opacity: 0.7 }}>•</span>
            <span>{departments[userProfile.department]?.name}</span>
          </div>
          <button 
            onClick={onLogout} 
            style={{ 
              ...styles.button, 
              background: 'rgba(255,255,255,0.9)', 
              color: '#dc2626',
              fontWeight: '600',
              padding: '10px 16px'
            }}
          >
            <span>🚪</span>
            Çıxış
          </button>
        </div>
      </header>

      <nav style={styles.nav}>
        <button 
          onClick={() => setActiveTab('dashboard')} 
          style={{ 
            ...styles.button, 
            background: activeTab === 'dashboard' ? 
              'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : '#f8fafc', 
            color: activeTab === 'dashboard' ? 'white' : '#64748b',
            fontWeight: '600',
            border: activeTab === 'dashboard' ? 'none' : '1px solid #e2e8f0'
          }}
        >
          <span>📊</span>
          Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('schedule')} 
          style={{ 
            ...styles.button, 
            background: activeTab === 'schedule' ? 
              'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : '#f8fafc', 
            color: activeTab === 'schedule' ? 'white' : '#64748b',
            fontWeight: '600',
            border: activeTab === 'schedule' ? 'none' : '1px solid #e2e8f0'
          }}
        >
          <span>📅</span>
          Növbələrim
        </button>
        <button 
          onClick={() => setActiveTab('breaks')} 
          style={{ 
            ...styles.button, 
            background: activeTab === 'breaks' ? 
              'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : '#f8fafc', 
            color: activeTab === 'breaks' ? 'white' : '#64748b',
            fontWeight: '600',
            border: activeTab === 'breaks' ? 'none' : '1px solid #e2e8f0'
          }}
        >
          <span>☕</span>
          Fasilələr 
          {userBreaks.length > 0 && (
            <span style={{
              background: activeTab === 'breaks' ? 'rgba(255,255,255,0.2)' : '#3b82f6',
              color: activeTab === 'breaks' ? 'white' : 'white',
              padding: '2px 6px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: '600'
            }}>
              {userBreaks.length}
            </span>
          )}
        </button>
        <button 
          onClick={() => setActiveTab('changes')} 
          style={{ 
            ...styles.button, 
            background: activeTab === 'changes' ? 
              'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : '#f8fafc', 
            color: activeTab === 'changes' ? 'white' : '#64748b',
            fontWeight: '600',
            border: activeTab === 'changes' ? 'none' : '1px solid #e2e8f0'
          }}
        >
          <span>🔄</span>
          Dəyişikliklər
          {userChanges.filter(c => c.status === 'pending').length > 0 && (
            <span style={{
              background: activeTab === 'changes' ? 'rgba(255,255,255,0.2)' : '#f59e0b',
              color: activeTab === 'changes' ? 'white' : 'white',
              padding: '2px 6px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: '600'
            }}>
              {userChanges.filter(c => c.status === 'pending').length}
            </span>
          )}
        </button>
        <button 
          onClick={() => setActiveTab('vacations')} 
          style={{ 
            ...styles.button, 
            background: activeTab === 'vacations' ? 
              'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : '#f8fafc', 
            color: activeTab === 'vacations' ? 'white' : '#64748b',
            fontWeight: '600',
            border: activeTab === 'vacations' ? 'none' : '1px solid #e2e8f0'
          }}
        >
          <span>🏖️</span>
          Məzuniyyət
          {userVacations.filter(v => v.status === 'pending').length > 0 && (
            <span style={{
              background: activeTab === 'vacations' ? 'rgba(255,255,255,0.2)' : '#10b981',
              color: activeTab === 'vacations' ? 'white' : 'white',
              padding: '2px 6px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: '600'
            }}>
              {userVacations.filter(v => v.status === 'pending').length}
            </span>
          )}
        </button>
      </nav>

      <div style={styles.content}>
        {renderContent()}
      </div>

      {/* Fasilə Dəyişiklik Modal */}
      {showBreakModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ color: '#1e293b', margin: 0, fontSize: '20px', fontWeight: '700' }}>Fasilə Dəyişikliyi Sorğusu</h3>
              <button 
                onClick={() => setShowBreakModal(false)} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '20px', 
                  cursor: 'pointer', 
                  color: '#64748b',
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f1f5f9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none';
                }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                🍽️ Fasilə Növü
              </label>
              <select 
                style={{ 
                  ...styles.input, 
                  borderColor: breakRequest.breakType ? '#3b82f6' : '#e2e8f0',
                  background: breakRequest.breakType ? '#f8fafc' : 'white'
                }} 
                value={breakRequest.breakType} 
                onChange={(e) => setBreakRequest({...breakRequest, breakType: e.target.value})}
              >
                <option value="">Fasilə növü seçin</option>
                <option value="tea">☕ Çay Fasiləsi</option>
                <option value="lunch">🍴 Nahar Fasiləsi</option>
              </select>
            </div>
            
            {breakRequest.breakType === 'tea' && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                  🕐 Çay Fasiləsi Vaxtı
                </label>
                <select 
                  style={{ 
                    ...styles.input, 
                    borderColor: breakRequest.breakTime ? '#3b82f6' : '#e2e8f0',
                    background: breakRequest.breakTime ? '#f8fafc' : 'white'
                  }} 
                  value={breakRequest.breakTime} 
                  onChange={(e) => setBreakRequest({...breakRequest, breakTime: e.target.value})}
                >
                  <option value="">Çay fasiləsi vaxtı seçin</option>
                  {breakConfig.tea.times.map(time => (
                    <option key={time} value={time}>
                      {time} {time.includes('10:') || time.includes('11:') ? '(1-ci Çay)' : 
                             time.includes('15:') || time.includes('16:') ? '(2-ci Çay)' : '(3-cü Çay)'}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {breakRequest.breakType === 'lunch' && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                  🍽️ Nahar Fasiləsi Vaxtı
                </label>
                <select 
                  style={{ 
                    ...styles.input, 
                    borderColor: breakRequest.breakTime ? '#3b82f6' : '#e2e8f0',
                    background: breakRequest.breakTime ? '#f8fafc' : 'white'
                  }} 
                  value={breakRequest.breakTime} 
                  onChange={(e) => setBreakRequest({...breakRequest, breakTime: e.target.value})}
                >
                  <option value="">Nahar fasiləsi vaxtı seçin</option>
                  {breakConfig.lunch.times.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            )}
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                📅 Tarix
              </label>
              <input 
                style={{ 
                  ...styles.input, 
                  borderColor: selectedDate ? '#3b82f6' : '#e2e8f0',
                  background: selectedDate ? '#f8fafc' : 'white'
                }} 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)} 
              />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                📝 Dəyişiklik Səbəbi (isteğe bağlı)
              </label>
              <textarea 
                style={{
                  ...styles.input, 
                  minHeight: '100px',
                  borderColor: breakRequest.reason ? '#3b82f6' : '#e2e8f0',
                  background: breakRequest.reason ? '#f8fafc' : 'white',
                  resize: 'vertical'
                }} 
                placeholder="Niyə fasiləni dəyişmək istəyirsiniz?"
                value={breakRequest.reason} 
                onChange={(e) => setBreakRequest({...breakRequest, reason: e.target.value})}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button 
                onClick={handleBreakRequest} 
                style={{ 
                  ...styles.button, 
                  background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', 
                  color: 'white', 
                  flex: 1, 
                  fontWeight: '600',
                  fontSize: '15px',
                  padding: '14px'
                }}
              >
                <span>📨</span>
                Göndər
              </button>
              <button 
                onClick={() => setShowBreakModal(false)} 
                style={{ 
                  ...styles.button, 
                  background: '#f8fafc', 
                  color: '#64748b', 
                  flex: 1, 
                  fontWeight: '600',
                  fontSize: '15px',
                  padding: '14px',
                  border: '1px solid #e2e8f0'
                }}
              >
                <span>❌</span>
                Ləğv Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Növbə Dəyişiklik Modal */}
      {showChangeModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ color: '#1e293b', margin: 0, fontSize: '20px', fontWeight: '700' }}>Növbə Dəyişikliyi Sorğusu</h3>
              <button 
                onClick={() => setShowChangeModal(false)} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '20px', 
                  cursor: 'pointer', 
                  color: '#64748b',
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f1f5f9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none';
                }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                👥 Kiminlə Dəyişmək İstəyirsiniz?
              </label>
              <select 
                style={{ 
                  ...styles.input, 
                  borderColor: changeRequest.toUserId ? '#3b82f6' : '#e2e8f0',
                  background: changeRequest.toUserId ? '#f8fafc' : 'white'
                }} 
                value={changeRequest.toUserId} 
                onChange={(e) => setChangeRequest({...changeRequest, toUserId: e.target.value})}
              >
                <option value="">Operator seçin</option>
                {departmentUsers.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} - {departments[user.department]?.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                📅 Tarix
              </label>
              <input 
                style={{ 
                  ...styles.input, 
                  borderColor: changeRequest.date ? '#3b82f6' : '#e2e8f0',
                  background: changeRequest.date ? '#f8fafc' : 'white'
                }} 
                type="date" 
                value={changeRequest.date} 
                onChange={(e) => setChangeRequest({...changeRequest, date: e.target.value})} 
                placeholder="Tarix seçin"
              />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                📝 Dəyişiklik Səbəbi (isteğe bağlı)
              </label>
              <textarea 
                style={{
                  ...styles.input, 
                  minHeight: '100px',
                  borderColor: changeRequest.reason ? '#3b82f6' : '#e2e8f0',
                  background: changeRequest.reason ? '#f8fafc' : 'white',
                  resize: 'vertical'
                }} 
                placeholder="Niyə növbəni dəyişmək istəyirsiniz?"
                value={changeRequest.reason} 
                onChange={(e) => setChangeRequest({...changeRequest, reason: e.target.value})}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button 
                onClick={handleShiftChange} 
                style={{ 
                  ...styles.button, 
                  background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', 
                  color: 'white', 
                  flex: 1, 
                  fontWeight: '600',
                  fontSize: '15px',
                  padding: '14px'
                }}
              >
                <span>📨</span>
                Göndər
              </button>
              <button 
                onClick={() => setShowChangeModal(false)} 
                style={{ 
                  ...styles.button, 
                  background: '#f8fafc', 
                  color: '#64748b', 
                  flex: 1, 
                  fontWeight: '600',
                  fontSize: '15px',
                  padding: '14px',
                  border: '1px solid #e2e8f0'
                }}
              >
                <span>❌</span>
                Ləğv Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Məzuniyyət Modal */}
      {showVacationModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ color: '#1e293b', margin: 0, fontSize: '20px', fontWeight: '700' }}>Məzuniyyət Sorğusu</h3>
              <button 
                onClick={() => setShowVacationModal(false)} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '20px', 
                  cursor: 'pointer', 
                  color: '#64748b',
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f1f5f9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none';
                }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                📅 Başlama Tarixi
              </label>
              <input 
                style={{ 
                  ...styles.input, 
                  borderColor: vacationRequest.startDate ? '#3b82f6' : '#e2e8f0',
                  background: vacationRequest.startDate ? '#f8fafc' : 'white'
                }} 
                type="date" 
                value={vacationRequest.startDate} 
                onChange={(e) => setVacationRequest({...vacationRequest, startDate: e.target.value})} 
                placeholder="Başlama tarixi"
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                📅 Bitmə Tarixi
              </label>
              <input 
                style={{ 
                  ...styles.input, 
                  borderColor: vacationRequest.endDate ? '#3b82f6' : '#e2e8f0',
                  background: vacationRequest.endDate ? '#f8fafc' : 'white'
                }} 
                type="date" 
                value={vacationRequest.endDate} 
                onChange={(e) => setVacationRequest({...vacationRequest, endDate: e.target.value})} 
                placeholder="Bitmə tarixi"
              />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                📝 Məzuniyyət Səbəbi (isteğe bağlı)
              </label>
              <textarea 
                style={{
                  ...styles.input, 
                  minHeight: '100px',
                  borderColor: vacationRequest.reason ? '#3b82f6' : '#e2e8f0',
                  background: vacationRequest.reason ? '#f8fafc' : 'white',
                  resize: 'vertical'
                }} 
                placeholder="Məzuniyyət səbəbinizi qeyd edin"
                value={vacationRequest.reason} 
                onChange={(e) => setVacationRequest({...vacationRequest, reason: e.target.value})}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button 
                onClick={handleVacationRequest} 
                style={{ 
                  ...styles.button, 
                  background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', 
                  color: 'white', 
                  flex: 1, 
                  fontWeight: '600',
                  fontSize: '15px',
                  padding: '14px'
                }}
              >
                <span>🏖️</span>
                Göndər
              </button>
              <button 
                onClick={() => setShowVacationModal(false)} 
                style={{ 
                  ...styles.button, 
                  background: '#f8fafc', 
                  color: '#64748b', 
                  flex: 1, 
                  fontWeight: '600',
                  fontSize: '15px',
                  padding: '14px',
                  border: '1px solid #e2e8f0'
                }}
              >
                <span>❌</span>
                Ləğv Et
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// SchedulePlanner komponenti - Professional Design
function SchedulePlanner({ users, schedules, shiftTypes, currentUser }) {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth.toISOString().slice(0, 7);
  });
  const [userSchedules, setUserSchedules] = useState({});
  const [selectedShifts, setSelectedShifts] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShift, setSelectedShift] = useState('');

  // Aktiv operatorları filtrlə
  const filteredUsers = useMemo(() => {
    let filtered = users.filter(u => 
      u.status === 'active' && 
      u.role === 'operator' &&
      u.department === currentUser.department
    );

    // Axtarışa görə filtrlə
    if (searchTerm) {
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Seçilmiş növbəyə görə filtrlə
    if (selectedShift) {
      const shiftUserIds = schedules
        .filter(s => s.date?.startsWith(selectedMonth) && s.shiftName === selectedShift)
        .map(s => s.userId);
      
      filtered = filtered.filter(u => shiftUserIds.includes(u.id));
    }

    return filtered;
  }, [users, currentUser.department, searchTerm, selectedShift, schedules, selectedMonth]);

  // Ayın gün sayını hesabla
  const daysInMonth = useMemo(() => {
    return new Date(
      parseInt(selectedMonth.split('-')[0]), 
      parseInt(selectedMonth.split('-')[1]), 
      0
    ).getDate();
  }, [selectedMonth]);
  
  // Cari ayın növbələri
  const monthSchedules = useMemo(() => {
    return schedules.filter(s => s.date?.startsWith(selectedMonth));
  }, [schedules, selectedMonth]);

  // State initialization
  useEffect(() => {
    console.log('🔄 SchedulePlanner useEffect işə düşdü');
    
    if (filteredUsers.length === 0) {
      setLoading(false);
      return;
    }
    
    const initialSchedules = {};
    const initialSelected = {};
    
    filteredUsers.forEach(user => {
      if (!user.id) return;
      
      initialSchedules[user.id] = {};
      initialSelected[user.id] = {};
      
      for (let day = 1; day <= daysInMonth; day++) {
        const date = `${selectedMonth}-${day.toString().padStart(2, '0')}`;
        const existingSchedule = monthSchedules.find(s => 
          s.userId === user.id && s.date === date
        );
        const shiftValue = existingSchedule?.shiftName || '';
        
        initialSchedules[user.id][day] = shiftValue;
        initialSelected[user.id][day] = shiftValue;
      }
    });
    
    setUserSchedules(initialSchedules);
    setSelectedShifts(initialSelected);
    setLoading(false);
    
    console.log('✅ State hazırdır', Object.keys(initialSelected));
  }, [filteredUsers, selectedMonth, daysInMonth, monthSchedules]);

  // Növbə seçimi
  const handleDaySchedule = (userId, day, shiftName) => {
    console.log('🎯 Növbə seçildi:', { userId, day, shiftName });
    
    setSelectedShifts(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [day]: shiftName
      }
    }));
  };

  // Seçilmiş növbələrin sayı
  const getShiftPreview = () => {
    let totalShifts = 0;
    Object.values(selectedShifts).forEach(userShifts => {
      Object.values(userShifts).forEach(shift => {
        if (shift && shift !== '' && shift !== 'OFF') {
          totalShifts++;
        }
      });
    });
    return totalShifts;
  };

  // Növbələri save et
  const saveAllSchedules = async () => {
    const shiftCount = getShiftPreview();
    if (shiftCount === 0) {
      alert('⚠️ Heç bir növbə seçilməyib!');
      return;
    }

    setSaving(true);

    try {
      // Köhnə növbələri sil
      const monthSchedulesToDelete = schedules.filter(s => 
        s.date?.startsWith(selectedMonth) && 
        filteredUsers.some(u => u.id === s.userId)
      );
      
      console.log('🗑️ Silinəcək növbələr:', monthSchedulesToDelete.length);
      
      for (const schedule of monthSchedulesToDelete) {
        if (schedule.id) {
          await deleteDoc(doc(db, 'schedules', schedule.id));
        }
      }

      // Yeni növbələri əlavə et
      let savedCount = 0;
      const savePromises = [];

      for (const userId of Object.keys(selectedShifts)) {
        const user = users.find(u => u.id === userId);
        if (!user) continue;

        for (let day = 1; day <= daysInMonth; day++) {
          const shiftName = selectedShifts[userId]?.[day];
          if (shiftName && shiftName !== '' && shiftName !== 'OFF') {
            const shift = shiftTypes.find(s => s.name === shiftName);
            const date = `${selectedMonth}-${day.toString().padStart(2, '0')}`;
            
            console.log('➕ Əlavə edilir:', { user: user.name, date, shiftName });
            
            const savePromise = addDoc(collection(db, 'schedules'), {
              userId: userId,
              userName: user.name,
              userDepartment: user.department,
              date: date,
              shiftName: shiftName,
              startTime: shift?.startTime || '09:00',
              endTime: shift?.endTime || '18:00',
              status: 'confirmed',
              assignedBy: currentUser.name,
              assignedAt: serverTimestamp(),
              createdAt: serverTimestamp()
            });
            
            savePromises.push(savePromise);
            savedCount++;
          }
        }
      }

      await Promise.all(savePromises);
      
      alert(`✅ ${savedCount} növbə uğurla yadda saxlandı!`);
      
    } catch (error) {
      console.error('❌ Save error:', error);
      alert('❌ Xəta: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const canEditMonth = () => {
    const currentDate = new Date();
    const selectedDate = new Date(selectedMonth + '-01');
    return selectedDate > currentDate;
  };

  const handleMonthChange = (newMonth) => {
    const currentShifts = getShiftPreview();
    if (currentShifts > 0) {
      if (!confirm(`⚠️ Cari ay üçün ${currentShifts} növbə seçilib. Ayı dəyişsəniz, bu seçimlər itəcək. Davam edim?`)) {
        return;
      }
    }
    setSelectedMonth(newMonth);
  };

  // Yükləmə zamanı göstərici
  if (loading) {
    return (
      <div style={styles.card}>
        <div style={{ textAlign: 'center', padding: '60px 40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <h3 style={{ color: '#475569', marginBottom: '12px', fontSize: '20px', fontWeight: '600' }}>Növbə Planlayıcı Yüklənir...</h3>
          <p style={{ fontSize: '15px', color: '#64748b' }}>Zəhmət olmasa gözləyin</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '24px', 
        flexWrap: 'wrap', 
        gap: '16px' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h3 style={{ color: '#1e293b', margin: 0, fontSize: '22px', fontWeight: '700' }}>
            📊 Növbə Planlayıcı
          </h3>
          {getShiftPreview() > 0 && (
            <span style={{ 
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', 
              color: 'white', 
              padding: '6px 12px', 
              borderRadius: '12px', 
              fontSize: '13px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span>🎯</span>
              <span>{getShiftPreview()} növbə seçilib</span>
            </span>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input 
            type="month" 
            value={selectedMonth} 
            onChange={(e) => handleMonthChange(e.target.value)} 
            style={{
              ...styles.input, 
              width: 'auto', 
              margin: 0,
              minWidth: '140px',
              borderColor: '#3b82f6'
            }}
            min={new Date().toISOString().slice(0, 7)}
          />
        </div>
      </div>

      {/* Axtarış və Filtrlər */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr auto', 
        gap: '16px', 
        marginBottom: '24px',
        alignItems: 'end'
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
            🔍 Operator Axtarışı
          </label>
          <input
            style={styles.searchBox}
            placeholder="Operatorun adı və ya emaili..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
            🕐 Növbəyə görə filtrlə
          </label>
          <select 
            style={styles.input}
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.target.value)}
          >
            <option value="">Bütün növbələr</option>
            {shiftTypes.filter(shift => shift.active).map(shift => (
              <option key={shift.id} value={shift.name}>
                {shift.name} ({shift.startTime}-{shift.endTime})
              </option>
            ))}
          </select>
        </div>
        
        <div style={{ 
          background: '#f0f9ff', 
          color: '#0369a1', 
          padding: '12px 16px', 
          borderRadius: '12px', 
          fontSize: '14px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid #bae6fd'
        }}>
          <span>👥</span>
          <span>{filteredUsers.length} operator</span>
        </div>
      </div>

      {!canEditMonth() && (
        <div style={{ 
          background: 'linear-gradient(135deg, #fef3c7 0%, #fef3c7 100%)', 
          color: '#92400e', 
          padding: '16px 20px', 
          borderRadius: '12px', 
          marginBottom: '24px',
          border: '1px solid #f59e0b',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '18px' }}>⚠️</span>
          <div>
            <strong>Diqqət!</strong> Cari və keçmiş aylarda dəyişiklik edə bilməzsiniz. 
            Yalnız gələcək aylar üçün növbə təyin edə bilərsiniz.
          </div>
        </div>
      )}

      {filteredUsers.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          color: '#64748b', 
          padding: '60px 40px',
          background: '#f8fafc',
          borderRadius: '16px',
          border: '2px dashed #e2e8f0'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>👥</div>
          <h4 style={{ color: '#475569', marginBottom: '12px', fontSize: '18px', fontWeight: '600' }}>
            {searchTerm || selectedShift ? 'Seçimlərinizə uyğun operator tapılmadı' : 'Heç bir operator tapılmadı'}
          </h4>
          <p style={{ fontSize: '14px', opacity: 0.7 }}>
            {searchTerm || selectedShift ? 'Axtarış şərtlərini dəyişin və ya filtri təmizləyin' : 'Bu şöbədə aktiv operator yoxdur'}
          </p>
        </div>
      ) : (
        <>
          <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <div style={{ ...styles.table, minWidth: '800px' }}>
              {/* Header */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: `220px repeat(${daysInMonth}, 65px)`, 
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                borderBottom: '2px solid #e2e8f0',
                position: 'sticky',
                top: 0,
                zIndex: 10
              }}>
                <div style={{ 
                  padding: '16px 20px', 
                  fontWeight: '600', 
                  borderRight: '1px solid #e2e8f0',
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  <div>Operator ({filteredUsers.length} nəfər)</div>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '400', marginTop: '4px' }}>
                    {departments[currentUser.department]?.name}
                  </div>
                </div>
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const date = new Date(selectedMonth + '-' + day.toString().padStart(2, '0'));
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                  const isToday = new Date().toDateString() === date.toDateString();
                  
                  return (
                    <div key={i} style={{ 
                      padding: '12px 8px', 
                      fontWeight: '600', 
                      borderRight: '1px solid #e2e8f0',
                      textAlign: 'center',
                      minWidth: '65px',
                      fontSize: '12px',
                      background: isToday ? 
                        'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : 
                        isWeekend ? '#fef3c7' : '#f8fafc',
                      color: isToday ? 'white' : isWeekend ? '#92400e' : '#374151',
                      position: 'relative'
                    }}>
                      {day}
                      {isToday && (
                        <div style={{
                          position: 'absolute',
                          top: '2px',
                          right: '2px',
                          width: '6px',
                          height: '6px',
                          background: 'white',
                          borderRadius: '50%'
                        }}></div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Users rows */}
              {filteredUsers.map(user => (
                <div key={user.id} style={{ 
                  display: 'grid', 
                  gridTemplateColumns: `220px repeat(${daysInMonth}, 65px)`,
                  borderBottom: '1px solid #f1f5f9',
                  background: 'white',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                }}>
                  <div style={{ 
                    padding: '12px 20px', 
                    borderRight: '1px solid #f1f5f9', 
                    fontWeight: '500', 
                    background: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '14px',
                    position: 'sticky',
                    left: 0,
                    zIndex: 5
                  }}>
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', 
                      borderRadius: '8px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: '#1e293b' }}>{user.name}</div>
                      <div style={{ 
                        background: departments[user.department]?.bgColor, 
                        color: departments[user.department]?.color,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '10px',
                        fontWeight: '500',
                        display: 'inline-block',
                        marginTop: '2px'
                      }}>
                        {user.email.split('@')[0]}
                      </div>
                    </div>
                  </div>
                  
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const date = new Date(selectedMonth + '-' + day.toString().padStart(2, '0'));
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                    const isPast = date < new Date();
                    const isToday = new Date().toDateString() === date.toDateString();
                    const currentShift = selectedShifts[user.id]?.[day] || '';
                    const existingSchedule = monthSchedules.find(s => 
                      s.userId === user.id && s.date === `${selectedMonth}-${day.toString().padStart(2, '0')}`
                    );
                    
                    return (
                      <div key={day} style={{ 
                        padding: '8px 4px', 
                        borderRight: '1px solid #f1f5f9',
                        textAlign: 'center',
                        background: isToday ? 
                          'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : 
                          isWeekend ? '#fffbeb' : 'inherit',
                        minWidth: '65px',
                        position: 'relative'
                      }}>
                        <select 
                          value={currentShift}
                          onChange={(e) => handleDaySchedule(user.id, day, e.target.value)}
                          style={{
                            padding: '8px 4px',
                            border: isToday ? '1px solid rgba(255,255,255,0.3)' : 
                                   currentShift ? '1px solid #3b82f6' : '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '11px',
                            width: '100%',
                            background: isToday ? 'rgba(255,255,255,0.9)' : 
                                     currentShift ? '#dbeafe' : (isPast ? '#f3f4f6' : 'white'),
                            color: isToday ? '#1e293b' : 
                                  currentShift ? '#1e40af' : '#64748b',
                            fontWeight: currentShift ? '600' : '400',
                            cursor: canEditMonth() && !isPast ? 'pointer' : 'not-allowed',
                            opacity: isPast ? 0.6 : 1,
                            transition: 'all 0.2s ease'
                          }}
                          disabled={!canEditMonth() || isPast}
                        >
                          <option value="">-</option>
                          {shiftTypes
                            .filter(shift => shift.active !== false)
                            .map(shift => (
                              <option key={shift.id} value={shift.name}>
                                {shift.name}
                              </option>
                            ))
                          }
                          <option value="OFF">OFF</option>
                        </select>
                        
                        {/* Hazır növbə indicatoru */}
                        {existingSchedule && !currentShift && (
                          <div style={{
                            position: 'absolute',
                            bottom: '2px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '4px',
                            height: '4px',
                            background: '#10b981',
                            borderRadius: '50%'
                          }}></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {canEditMonth() && getShiftPreview() > 0 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginTop: '24px', 
              gap: '20px', 
              padding: '24px', 
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', 
              borderRadius: '16px',
              border: '1px solid #bae6fd'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '16px', color: '#0369a1', fontWeight: '600', marginBottom: '4px' }}>
                  📊 Cəmi <strong style={{ fontSize: '18px' }}>{getShiftPreview()} növbə</strong> seçilib
                </div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>
                  Növbələri yadda saxlamazdan əvvəl yoxlayın. Bu əməliyyat geri alına bilməz.
                </div>
              </div>
              <button 
                onClick={saveAllSchedules}
                disabled={saving}
                style={{ 
                  ...styles.button, 
                  background: saving ? 
                    'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)' : 
                    'linear-gradient(135deg, #10b981 0%, #047857 100%)', 
                  color: 'white',
                  padding: '14px 28px',
                  fontSize: '15px',
                  fontWeight: '600',
                  opacity: saving ? 0.8 : 1,
                  minWidth: '200px',
                  transition: 'all 0.3s ease'
                }}
              >
                {saving ? (
                  <>
                    <div style={{ 
                      width: '16px', 
                      height: '16px', 
                      border: '2px solid rgba(255,255,255,0.3)', 
                      borderTop: '2px solid white', 
                      borderRadius: '50%', 
                      animation: 'spin 1s linear infinite' 
                    }}></div>
                    Saxlanılır...
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    Növbələri Yadda Saxla
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function AdminMonthlySchedule({ schedules, users, shiftTypes, selectedMonth, onMonthChange, searchTerm, onSearchChange }) {
  const monthSchedules = schedules.filter(s => s.date?.startsWith(selectedMonth));
  const daysInMonth = new Date(selectedMonth.split('-')[0], selectedMonth.split('-')[1], 0).getDate();

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <h2 style={{ color: '#1e293b' }}>Aylıq Növbə Cədvəli - {selectedMonth}</h2>
        <input 
          type="month" 
          value={selectedMonth} 
          onChange={(e) => onMonthChange(e.target.value)} 
          style={{...styles.input, width: 'auto', margin: 0}}
        />
      </div>

      <div style={{ overflowX: 'auto' }}>
        <div style={{ ...styles.table, minWidth: '800px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: `200px repeat(${daysInMonth}, 80px)`, 
            background: '#f8fafc',
            borderBottom: '2px solid #e2e8f0'
          }}>
            <div style={{ padding: '15px', fontWeight: '600', borderRight: '1px solid #e2e8f0' }}>
              İstifadəçi
            </div>
            {Array.from({ length: daysInMonth }, (_, i) => (
              <div key={i} style={{ 
                padding: '15px', 
                fontWeight: '600', 
                borderRight: '1px solid #e2e8f0',
                textAlign: 'center',
                minWidth: '80px'
              }}>
                {i + 1}
              </div>
            ))}
          </div>
          
          {filteredUsers.filter(u => u.role !== 'admin').map(user => (
            <div key={user.id} style={{ 
              display: 'grid', 
              gridTemplateColumns: `200px repeat(${daysInMonth}, 80px)`,
              borderBottom: '1px solid #e2e8f0'
            }}>
              <div style={{ 
                padding: '15px', 
                borderRight: '1px solid #e2e8f0', 
                fontWeight: '500', 
                background: 'white',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ fontWeight: '500' }}>{user.name}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {departments[user.department]?.name} • {roles[user.role]?.name}
                </div>
              </div>
              
              {Array.from({ length: daysInMonth }, (_, i) => {
                const date = `${selectedMonth}-${(i + 1).toString().padStart(2, '0')}`;
                const schedule = monthSchedules.find(s => s.userId === user.id && s.date === date);
                
                return (
                  <div key={i} style={{ 
                    padding: '10px', 
                    borderRight: '1px solid #e2e8f0',
                    textAlign: 'center',
                    background: schedule ? '#dbeafe' : 'white',
                    color: schedule ? '#1e40af' : '#64748b',
                    fontSize: '12px',
                    fontWeight: '500',
                    minWidth: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {schedule ? schedule.shiftName : '-'}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminDashboardContent({ users, schedules, onAddUser, onScheduleShift, onGenerateReports, searchTerm, onSearchChange, currentUser, onLogout, shiftTypes, vacations, onOpenBreakPlanner }) {
  const totalUsers = users.length;
  const activeSchedules = schedules.length;
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthSchedules = schedules.filter(s => s.date?.startsWith(currentMonth));
  
  const today = new Date().toISOString().slice(0, 10);
  const todaySchedules = schedules.filter(s => s.date === today);
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    departments[user.department]?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedSchedules = todaySchedules.reduce((acc, schedule) => {
    const shiftName = schedule.shiftName;
    if (!acc[shiftName]) {
      acc[shiftName] = [];
    }
    acc[shiftName].push(schedule);
    return acc;
  }, {});

  return (
    <div>
      <h2 style={{ color: '#1e293b', marginBottom: '20px' }}>{departments[currentUser.department]?.name} Dashboard</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ ...styles.card, textAlign: 'center', background: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>👥</div>
          <h3 style={{ color: '#1e40af', marginBottom: '10px' }}>Ümumi İstifadəçilər</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1e40af' }}>{totalUsers}</div>
        </div>
        
        <div style={{ ...styles.card, textAlign: 'center', background: 'linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📅</div>
          <h3 style={{ color: '#047857', marginBottom: '10px' }}>Aktiv Növbələr</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#047857' }}>{activeSchedules}</div>
        </div>
        
        <div style={{ ...styles.card, textAlign: 'center', background: 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📊</div>
          <h3 style={{ color: '#92400e', marginBottom: '10px' }}>Bu Ay Növbələr</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#92400e' }}>{monthSchedules.length}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div style={styles.card}>
          <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>👥</span>
            <span>Şöbə İstifadəçiləri ({filteredUsers.length})</span>
          </h3>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {filteredUsers.map(user => (
              <div key={user.id} style={{ 
                padding: '12px', 
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: '500' }}>{user.name}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {user.email} • {departments[user.department]?.name}
                  </div>
                </div>
                <span style={{
                  background: user.role === 'admin' ? '#fef3c7' : '#dbeafe',
                  color: user.role === 'admin' ? '#92400e' : '#1e40af',
                  padding: '6px 12px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  {roles[user.role]?.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⚡</span>
            <span>Tez Erişim</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button 
              onClick={onAddUser}
              style={{ ...styles.button, background: '#3b82f6', color: 'white', textAlign: 'center', fontWeight: '600', padding: '12px' }}
            >
              ➕ Yeni İstifadəçi
            </button>
            <button 
              onClick={onScheduleShift}
              style={{ ...styles.button, background: '#10b981', color: 'white', textAlign: 'center', fontWeight: '600', padding: '12px' }}
            >
              📅 Tək Növbə Planlaşdır
            </button>
            <button 
              onClick={onOpenBreakPlanner}
              style={{ ...styles.button, background: '#8B5CF6', color: 'white', textAlign: 'center', fontWeight: '600', padding: '12px' }}
            >
              ☕ Fasilə Planlayıcı
            </button>
            <button 
              onClick={onGenerateReports}
              style={{ ...styles.button, background: '#f59e0b', color: 'white', textAlign: 'center', fontWeight: '600', padding: '12px' }}
            >
              📊 Hesabatlar
            </button>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>📅</span>
          <span>Bugünkü Növbələr</span>
          <span style={{ 
            background: '#dbeafe', 
            color: '#1e40af', 
            padding: '4px 8px', 
            borderRadius: '12px', 
            fontSize: '12px',
            fontWeight: '500'
          }}>
            {today}
          </span>
        </h3>
        
        {Object.keys(groupedSchedules).length === 0 ? (
          <div style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>😴</div>
            Bu gün üçün növbə planlanmayıb
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
            {Object.entries(groupedSchedules).map(([shiftName, shiftSchedules]) => {
              const shiftUsers = shiftSchedules.map(schedule => schedule.userName).join(', ');

              return (
                <div key={shiftName} style={{ 
                  padding: '15px', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)'
                }}>
                  <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '8px', color: '#1e293b' }}>
                    {shiftName} Növbəsi
                  </div>
                  <div style={{ fontSize: '14px', color: '#475569' }}>
                    {shiftUsers || 'Növbə yoxdur'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminUsers({ users, onEditUser, onDeleteUser, searchTerm, onSearchChange, currentUser }) {
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    departments[user.department]?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (user) => {
    setEditingUser(user.id);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      status: user.status
    });
  };

  const handleSaveEdit = async (userId) => {
    try {
      await onEditUser(userId, editForm);
      setEditingUser(null);
      setEditForm({});
    } catch (error) {
      alert('❌ Xəta: ' + error.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({});
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#1e293b', margin: 0 }}>İstifadəçi İdarəetmə</h2>
      </div>
      
      <div style={styles.card}>
        <div style={styles.table}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr', 
            gap: '10px', 
            padding: '15px', 
            background: '#f8fafc', 
            fontWeight: '600',
            fontSize: '14px'
          }}>
            <div>Ad Soyad</div>
            <div>Email</div>
            <div>Rol</div>
            <div>Şöbə</div>
            <div>Status</div>
            <div>Əməliyyatlar</div>
          </div>
          
          {filteredUsers.map(user => (
            <div key={user.id} style={{ 
              display: 'grid', 
              gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr', 
              gap: '10px', 
              padding: '15px', 
              borderBottom: '1px solid #e2e8f0', 
              alignItems: 'center',
              fontSize: '14px'
            }}>
              {editingUser === user.id ? (
                <>
                  <input style={{...styles.input, margin: 0, padding: '8px', fontSize: '14px'}} value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} />
                  <input style={{...styles.input, margin: 0, padding: '8px', fontSize: '14px'}} value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} />
                  <select style={{...styles.input, margin: 0, padding: '8px', fontSize: '14px'}} value={editForm.role} onChange={(e) => setEditForm({...editForm, role: e.target.value})}>
                    <option value="operator">Operator</option>
                    <option value="admin">Qrup Rəhbəri</option>
                  </select>
                  <select style={{...styles.input, margin: 0, padding: '8px', fontSize: '14px'}} value={editForm.department} onChange={(e) => setEditForm({...editForm, department: e.target.value})}>
                    <option value="info_sale">İnfo Sale</option>
                    <option value="technical">Texniki</option>
                    <option value="management">İdarəetmə</option>
                  </select>
                  <select style={{...styles.input, margin: 0, padding: '8px', fontSize: '14px'}} value={editForm.status} onChange={(e) => setEditForm({...editForm, status: e.target.value})}>
                    <option value="active">Aktiv</option>
                    <option value="inactive">Deaktiv</option>
                  </select>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button onClick={() => handleSaveEdit(user.id)} style={{...styles.button, background: '#10b981', color: 'white', padding: '8px 12px', fontSize: '12px', fontWeight: '600'}}>✓</button>
                    <button onClick={handleCancelEdit} style={{...styles.button, background: '#6b7280', color: 'white', padding: '8px 12px', fontSize: '12px', fontWeight: '600'}}>✕</button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontWeight: '500' }}>{user.name}</div>
                  <div style={{ color: '#64748b', fontSize: '13px' }}>{user.email}</div>
                  <div>
                    <span style={{
                      background: user.role === 'admin' ? '#fef3c7' : '#dbeafe',
                      color: user.role === 'admin' ? '#92400e' : '#1e40af',
                      padding: '6px 12px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '600',
                      display: 'inline-block',
                      minWidth: '80px',
                      textAlign: 'center'
                    }}>
                      {roles[user.role]?.name}
                    </span>
                  </div>
                  <div>
                    <span style={{
                      background: departments[user.department]?.color + '20',
                      color: departments[user.department]?.color,
                      padding: '6px 12px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '600',
                      display: 'inline-block',
                      minWidth: '80px',
                      textAlign: 'center'
                    }}>
                      {departments[user.department]?.name}
                    </span>
                  </div>
                  <div>
                    <span style={{
                      background: user.status === 'active' ? '#dcfce7' : '#fee2e2',
                      color: user.status === 'active' ? '#166534' : '#dc2626',
                      padding: '6px 12px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '600',
                      display: 'inline-block',
                      minWidth: '70px',
                      textAlign: 'center'
                    }}>
                      {user.status === 'active' ? 'Aktiv' : 'Deaktiv'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button onClick={() => handleEditClick(user)} style={{...styles.button, background: '#3b82f6', color: 'white', padding: '8px 12px', fontSize: '12px', fontWeight: '600'}}>Düzəlt</button>
                    <button onClick={() => onDeleteUser(user.id)} style={{...styles.button, background: '#ef4444', color: 'white', padding: '8px 12px', fontSize: '12px', fontWeight: '600'}}>Sil</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminApprovals({ shiftChanges, vacations, users, currentUser }) {
  const departmentChanges = shiftChanges.filter(change => 
    change.status === 'pending' && change.fromUserDepartment === currentUser.department
  );
  
  const departmentVacations = vacations.filter(vacation => 
    vacation.status === 'pending' && vacation.userDepartment === currentUser.department
  );

  const handleApproveChange = async (changeId) => {
    try {
      await updateDoc(doc(db, 'shiftChanges', changeId), {
        status: 'approved',
        approvedBy: currentUser.name,
        approvedAt: serverTimestamp()
      });

      alert('✅ Növbə dəyişikliyi təsdiqləndi!');
    } catch (error) {
      console.error('Approve change error:', error);
      alert('❌ Xəta: ' + error.message);
    }
  };

  const handleRejectChange = async (changeId) => {
    try {
      await updateDoc(doc(db, 'shiftChanges', changeId), {
        status: 'rejected',
        approvedBy: currentUser.name,
        approvedAt: serverTimestamp()
      });

      alert('❌ Növbə dəyişikliyi rədd edildi!');
    } catch (error) {
      console.error('Reject change error:', error);
      alert('❌ Xəta: ' + error.message);
    }
  };

  const handleApproveVacation = async (vacationId) => {
    try {
      await updateDoc(doc(db, 'vacations', vacationId), {
        status: 'approved',
        approvedBy: currentUser.name,
        approvedAt: serverTimestamp()
      });

      alert('✅ Məzuniyyət təsdiqləndi!');
    } catch (error) {
      console.error('Approve vacation error:', error);
      alert('❌ Xəta: ' + error.message);
    }
  };

  const handleRejectVacation = async (vacationId) => {
    try {
      await updateDoc(doc(db, 'vacations', vacationId), {
        status: 'rejected',
        approvedBy: currentUser.name,
        approvedAt: serverTimestamp()
      });

      alert('❌ Məzuniyyət rədd edildi!');
    } catch (error) {
      console.error('Reject vacation error:', error);
      alert('❌ Xəta: ' + error.message);
    }
  };

  return (
    <div>
      <h2 style={{ color: '#1e293b', marginBottom: '20px' }}>Təsdiqləmə Paneli</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={styles.card}>
          <h3 style={{ marginBottom: '15px', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🔄</span>
            <span>Növbə Dəyişiklikləri ({departmentChanges.length})</span>
          </h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {departmentChanges.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>✅</div>
                Gözləmədə olan növbə dəyişikliyi yoxdur
              </div>
            ) : (
              departmentChanges.map(change => {
                const fromUser = users.find(u => u.id === change.fromUserId);
                const toUser = users.find(u => u.id === change.toUserId);
                
                return (
                  <div key={change.id} style={{ 
                    padding: '15px', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '8px', 
                    marginBottom: '10px',
                    background: '#f8fafc'
                  }}>
                    <div style={{ fontWeight: '500', marginBottom: '5px', fontSize: '16px' }}>
                      {fromUser?.name} → {toUser?.name}
                    </div>
                    <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>📅</span>
                      <span>{change.date}</span>
                      <span>•</span>
                      <span>{change.fromShift} → {change.toShift}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                      {new Date(change.createdAt?.toDate()).toLocaleString('az-AZ')}
                    </div>
                    {change.reason && (
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px', padding: '8px', background: 'white', borderRadius: '4px' }}>
                        <strong>Səbəb:</strong> {change.reason}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <button 
                        onClick={() => handleApproveChange(change.id)}
                        style={{ ...styles.button, background: '#10b981', color: 'white', flex: 1, fontSize: '12px', fontWeight: '600' }}
                      >
                        ✅ Təsdiqlə
                      </button>
                      <button 
                        onClick={() => handleRejectChange(change.id)}
                        style={{ ...styles.button, background: '#ef4444', color: 'white', flex: 1, fontSize: '12px', fontWeight: '600' }}
                      >
                        ❌ Rədd Et
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={{ marginBottom: '15px', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🏖️</span>
            <span>Məzuniyyət Sorğuları ({departmentVacations.length})</span>
          </h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {departmentVacations.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>✅</div>
                Gözləmədə olan məzuniyyət sorğusu yoxdur
              </div>
            ) : (
              departmentVacations.map(vacation => {
                const user = users.find(u => u.id === vacation.userId);
                
                return (
                  <div key={vacation.id} style={{ 
                    padding: '15px', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '8px', 
                    marginBottom: '10px',
                    background: '#f8fafc'
                  }}>
                    <div style={{ fontWeight: '500', marginBottom: '5px', fontSize: '16px' }}>
                      {user?.name}
                    </div>
                    <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>🏖️</span>
                      <span>{vacation.startDate} - {vacation.endDate}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                      {new Date(vacation.createdAt?.toDate()).toLocaleString('az-AZ')}
                    </div>
                    {vacation.reason && (
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px', padding: '8px', background: 'white', borderRadius: '4px' }}>
                        <strong>Səbəb:</strong> {vacation.reason}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <button 
                        onClick={() => handleApproveVacation(vacation.id)}
                        style={{ ...styles.button, background: '#10b981', color: 'white', flex: 1, fontSize: '12px', fontWeight: '600' }}
                      >
                        ✅ Təsdiqlə
                      </button>
                      <button 
                        onClick={() => handleRejectVacation(vacation.id)}
                        style={{ ...styles.button, background: '#ef4444', color: 'white', flex: 1, fontSize: '12px', fontWeight: '600' }}
                      >
                        ❌ Rədd Et
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminReports({ schedules, users, selectedMonth, onMonthChange, shiftChanges, vacations, searchTerm, onSearchChange }) {
  const monthSchedules = schedules.filter(s => s.date?.startsWith(selectedMonth));
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const departmentStats = filteredUsers.reduce((acc, user) => {
    if (!acc[user.department]) {
      acc[user.department] = { users: 0, schedules: 0 };
    }
    acc[user.department].users++;
    acc[user.department].schedules += monthSchedules.filter(s => s.userId === user.id).length;
    return acc;
  }, {});

  return (
    <div>
      <h2 style={{ color: '#1e293b', marginBottom: '20px' }}>Hesabatlar və Analitika</h2>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <input 
          type="month" 
          value={selectedMonth} 
          onChange={(e) => onMonthChange(e.target.value)} 
          style={{...styles.input, width: 'auto', margin: 0}}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={styles.card}>
          <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📊</span>
            <span>Ümumi Statistikalar</span>
          </h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
              <span>Ümumi İstifadəçilər:</span>
              <strong style={{ color: '#3b82f6' }}>{filteredUsers.length}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
              <span>Ay Növbələri:</span>
              <strong style={{ color: '#10b981' }}>{monthSchedules.length}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
              <span>Növbə Dəyişiklikləri:</span>
              <strong style={{ color: '#f59e0b' }}>{shiftChanges.length}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
              <span>Məzuniyyət Sorğuları:</span>
              <strong style={{ color: '#ef4444' }}>{vacations.length}</strong>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🏢</span>
            <span>Şöbə Statistikaları</span>
          </h3>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {Object.entries(departmentStats).map(([dept, stats]) => (
              <div key={dept} style={{ 
                padding: '12px', 
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: '500' }}>{departments[dept]?.name}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {stats.users} istifadəçi • {stats.schedules} növbə
                  </div>
                </div>
                <div style={{ 
                  background: departments[dept]?.color + '20',
                  color: departments[dept]?.color,
                  padding: '6px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {Math.round((stats.schedules / (stats.users * 30)) * 100) || 0}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>👥</span>
          <span>İstifadəçi Növbə Statistikası</span>
        </h3>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {filteredUsers.map(user => {
            const userSchedules = monthSchedules.filter(s => s.userId === user.id);
            const userChanges = shiftChanges.filter(c => c.fromUserId === user.id || c.toUserId === user.id);
            const userVacations = vacations.filter(v => v.userId === user.id);
            
            return (
              <div key={user.id} style={{ 
                padding: '15px', 
                borderBottom: '1px solid #e2e8f0',
                display: 'grid',
                gridTemplateColumns: '1fr auto auto auto',
                gap: '15px',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: '500' }}>{user.name}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {departments[user.department]?.name} • {roles[user.role]?.name}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#3b82f6' }}>{userSchedules.length}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Növbə</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#f59e0b' }}>{userChanges.length}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Dəyişiklik</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#ef4444' }}>{userVacations.length}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Məzuniyyət</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// BreakPlanner komponenti - YENİ VERSİYA
function BreakPlanner({ users, schedules, breaks, currentUser, onSaveBreaks }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedShift, setSelectedShift] = useState('');
  const [operators, setOperators] = useState([]);
  const [userBreaks, setUserBreaks] = useState({});
  const [saving, setSaving] = useState(false);
  const [randomizing, setRandomizing] = useState(false);

  // Shift seçimləri
  const shiftOptions = [
    { id: '9-5', name: '09:00 - 17:00', start: '09:00', end: '17:00' },
    { id: '9-6', name: '09:00 - 18:00', start: '09:00', end: '18:00' },
    { id: '10-6', name: '10:00 - 18:00', start: '10:00', end: '18:00' },
    { id: '10-7', name: '10:00 - 19:00', start: '10:00', end: '19:00' },
    { id: '11-7', name: '11:00 - 19:00', start: '11:00', end: '19:00' },
    { id: '12-8', name: '12:00 - 20:00', start: '12:00', end: '20:00' },
    { id: '1-9', name: '13:00 - 21:00', start: '13:00', end: '21:00' },
  ];

  // Fasilə konfiqurasiyası
  const breakConfig = {
    tea: {
      intervals: [10, 20, 30], // dəqiqə
      duration: 10,
      maxConcurrent: 1,
      times: ['10:00', '11:00', '15:00', '16:00', '17:00']
    },
    lunch: {
      intervals: [30, 40, 50],
      duration: 40,
      maxConcurrent: 2,
      times: ['12:00', '13:00', '14:00']
    }
  };

  // Seçilmiş shiftə uyğun operatorları tap
  useEffect(() => {
    if (selectedShift && selectedDate) {
      const shift = shiftOptions.find(s => s.id === selectedShift);
      const todaySchedules = schedules.filter(s => 
        s.date === selectedDate && s.shift === selectedShift
      );
      
      const shiftOperators = todaySchedules.map(schedule => {
        const user = users.find(u => u.id === schedule.userId);
        return user ? { ...user, scheduleId: schedule.id } : null;
      }).filter(Boolean);

      setOperators(shiftOperators);
      
      // İlkin fasilə strukturu yarat
      const initialBreaks = {};
      shiftOperators.forEach(operator => {
        initialBreaks[operator.id] = {
          tea: [],
          lunch: []
        };
      });
      setUserBreaks(initialBreaks);
    } else {
      setOperators([]);
      setUserBreaks({});
    }
  }, [selectedShift, selectedDate, schedules, users]);

  // Fasilə vaxtları generasiya et
  const generateBreakTimes = (breakType, operatorCount) => {
    const config = breakConfig[breakType];
    const times = [];
    const selectedShiftData = shiftOptions.find(s => s.id === selectedShift);
    
    if (!selectedShiftData) return times;

    const shiftStart = selectedShiftData.start;
    const shiftEnd = selectedShiftData.end;
    
    config.times.forEach(baseTime => {
      // Shift vaxtına uyğunluğu yoxla
      if (baseTime >= shiftStart && baseTime < shiftEnd) {
        for (let i = 0; i < operatorCount; i++) {
          const interval = config.intervals[i % config.intervals.length];
          const breakTime = addMinutes(baseTime, interval * i);
          const breakEnd = addMinutes(breakTime, config.duration);
          
          // Break shift bitmədən bitməlidir
          if (breakEnd <= shiftEnd) {
            times.push({
              time: `${breakTime}-${breakEnd}`,
              start: breakTime,
              end: breakEnd,
              available: true
            });
          }
        }
      }
    });

    return times;
  };

  // Dəqiqə əlavə et
  function addMinutes(time, minutes) {
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
  }

  // Random fasilə təyin et
  const assignRandomBreaks = () => {
    setRandomizing(true);
    
    setTimeout(() => {
      const newBreaks = { ...userBreaks };
      const teaTimes = generateBreakTimes('tea', operators.length);
      const lunchTimes = generateBreakTimes('lunch', operators.length);

      operators.forEach((operator, index) => {
        const availableTea = teaTimes.filter(t => t.available);
        const availableLunch = lunchTimes.filter(t => t.available);

        if (availableTea.length > 0) {
          const randomTea = availableTea[Math.floor(Math.random() * availableTea.length)];
          newBreaks[operator.id] = {
            ...newBreaks[operator.id],
            tea: [randomTea.time]
          };
          // Seçilmiş vaxtı məşğul et
          teaTimes.find(t => t.time === randomTea.time).available = false;
        }

        if (availableLunch.length > 0) {
          const randomLunch = availableLunch[Math.floor(Math.random() * availableLunch.length)];
          newBreaks[operator.id] = {
            ...newBreaks[operator.id],
            lunch: [randomLunch.time]
          };
          // Seçilmiş vaxtı məşğul et
          lunchTimes.find(t => t.time === randomLunch.time).available = false;
        }
      });

      setUserBreaks(newBreaks);
      setRandomizing(false);
    }, 500);
  };

  // Fasilə əlavə et
  const addBreak = (userId, breakType) => {
    const availableTimes = generateBreakTimes(breakType, operators.length);
    const currentBreaks = userBreaks[userId]?.[breakType] || [];
    
    if (availableTimes.length > currentBreaks.length) {
      setUserBreaks(prev => ({
        ...prev,
        [userId]: {
          ...prev[userId],
          [breakType]: [...currentBreaks, '']
        }
      }));
    }
  };

  // Fasilə sil
  const removeBreak = (userId, breakType, index) => {
    setUserBreaks(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [breakType]: prev[userId][breakType].filter((_, i) => i !== index)
      }
    }));
  };

  // Fasilə vaxtı dəyiş
  const handleBreakChange = (userId, breakType, index, breakTime) => {
    setUserBreaks(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [breakType]: prev[userId][breakType].map((time, i) => 
          i === index ? breakTime : time
        )
      }
    }));
  };

  // Yadda saxla
  const saveBreaks = async () => {
    setSaving(true);
    try {
      // Köhnə fasilələri sil
      const dateBreaksToDelete = breaks.filter(b => b.date === selectedDate);
      for (const breakItem of dateBreaksToDelete) {
        if (breakItem.id) {
          await deleteDoc(doc(db, 'breaks', breakItem.id));
        }
      }

      // Yeni fasilələri əlavə et
      let savedCount = 0;
      const savePromises = [];

      for (const userId of Object.keys(userBreaks)) {
        const user = users.find(u => u.id === userId);
        if (!user) continue;

        const userBreakData = userBreaks[userId];

        // Çay fasilələri
        userBreakData.tea.forEach(breakTime => {
          if (breakTime) {
            const savePromise = addDoc(collection(db, 'breaks'), {
              userId: userId,
              userName: user.name,
              breakType: 'tea',
              breakTime: breakTime,
              date: selectedDate,
              shift: selectedShift,
              status: 'confirmed',
              assignedBy: currentUser.name,
              assignedAt: serverTimestamp(),
              createdAt: serverTimestamp()
            });
            savePromises.push(savePromise);
            savedCount++;
          }
        });

        // Nahar fasilələri
        userBreakData.lunch.forEach(breakTime => {
          if (breakTime) {
            const savePromise = addDoc(collection(db, 'breaks'), {
              userId: userId,
              userName: user.name,
              breakType: 'lunch',
              breakTime: breakTime,
              date: selectedDate,
              shift: selectedShift,
              status: 'confirmed',
              assignedBy: currentUser.name,
              assignedAt: serverTimestamp(),
              createdAt: serverTimestamp()
            });
            savePromises.push(savePromise);
            savedCount++;
          }
        });
      }

      await Promise.all(savePromises);
      alert(`✅ ${savedCount} fasilə uğurla yadda saxlandı!`);
      if (onSaveBreaks) onSaveBreaks();
      
    } catch (error) {
      console.error('❌ Save error:', error);
      alert('❌ Xəta: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // İndiki və gələcək fasilələr
  const currentBreaks = breaks.filter(b => 
    b.date === selectedDate && 
    b.shift === selectedShift
  );

  const getCurrentBreaks = () => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    return currentBreaks.filter(breakItem => {
      const [start] = breakItem.breakTime.split('-');
      return start <= currentTime && breakItem.breakTime.split('-')[1] > currentTime;
    });
  };

  const getUpcomingBreaks = () => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    return currentBreaks.filter(breakItem => {
      const [start] = breakItem.breakTime.split('-');
      return start > currentTime;
    }).sort((a, b) => a.breakTime.localeCompare(b.breakTime));
  };

  return (
    <div style={styles.card}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px', 
        flexWrap: 'wrap', 
        gap: '15px' 
      }}>
        <h3 style={{ color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>⏰</span>
          <span>Yeni Fasilə Planlayıcı</span>
        </h3>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)} 
            style={{
              ...styles.input, 
              width: 'auto', 
              margin: 0,
              minWidth: '150px'
            }}
          />
          
          <select 
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.target.value)}
            style={{
              ...styles.input,
              width: 'auto',
              margin: 0,
              minWidth: '120px'
            }}
          >
            <option value="">Növbə seçin</option>
            {shiftOptions.map(shift => (
              <option key={shift.id} value={shift.id}>{shift.name}</option>
            ))}
          </select>

          <button 
            onClick={assignRandomBreaks}
            disabled={!selectedShift || randomizing || operators.length === 0}
            style={{ 
              ...styles.button, 
              background: randomizing ? '#6b7280' : '#3b82f6',
              color: 'white',
              padding: '10px 16px',
              fontSize: '14px'
            }}
          >
            {randomizing ? '🎲 Təyin edilir...' : '🎲 Random Təyin et'}
          </button>
        </div>
      </div>

      {/* İndiki və gələcək fasilələr paneli */}
      {selectedShift && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '20px', 
          marginBottom: '20px' 
        }}>
          <div style={styles.breakPanel}>
            <h4 style={{ color: '#dc2626', margin: '0 0 10px 0' }}>⏳ İndi Fasilədə</h4>
            {getCurrentBreaks().map(breakItem => (
              <div key={breakItem.id} style={styles.breakItem}>
                <strong>{breakItem.userName}</strong> - {breakItem.breakTime} 
                <span style={{ 
                  color: breakItem.breakType === 'tea' ? '#2563eb' : '#16a34a',
                  marginLeft: '8px'
                }}>
                  ({breakItem.breakType === 'tea' ? 'Çay' : 'Nahar'})
                </span>
              </div>
            ))}
            {getCurrentBreaks().length === 0 && (
              <div style={{ color: '#6b7280', fontStyle: 'italic' }}>İndi fasilədə heç kim yoxdur</div>
            )}
          </div>

          <div style={styles.breakPanel}>
            <h4 style={{ color: '#ca8a04', margin: '0 0 10px 0' }}>📅 Sonrakı Fasilələr</h4>
            {getUpcomingBreaks().slice(0, 5).map(breakItem => (
              <div key={breakItem.id} style={styles.breakItem}>
                <strong>{breakItem.userName}</strong> - {breakItem.breakTime}
                <span style={{ 
                  color: breakItem.breakType === 'tea' ? '#2563eb' : '#16a34a',
                  marginLeft: '8px'
                }}>
                  ({breakItem.breakType === 'tea' ? 'Çay' : 'Nahar'})
                </span>
              </div>
            ))}
            {getUpcomingBreaks().length === 0 && (
              <div style={{ color: '#6b7280', fontStyle: 'italic' }}>Gələcək fasilə yoxdur</div>
            )}
          </div>
        </div>
      )}

      {/* Operatorlar və fasilələr cədvəli */}
      {selectedShift && operators.length > 0 && (
        <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
          <div style={{ ...styles.table, minWidth: '800px' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: `200px 1fr 1fr`, 
              background: '#f8fafc',
              borderBottom: '2px solid #e2e8f0',
              position: 'sticky',
              top: 0,
              zIndex: 10
            }}>
              <div style={{ padding: '15px', fontWeight: '600', borderRight: '1px solid #e2e8f0' }}>
                Operator
              </div>
              <div style={{ padding: '15px', fontWeight: '600', borderRight: '1px solid #e2e8f0', textAlign: 'center', background: '#f0f9ff' }}>
                Çay Fasilələri
              </div>
              <div style={{ padding: '15px', fontWeight: '600', textAlign: 'center', background: '#f0fdf4' }}>
                Nahar Fasilələri
              </div>
            </div>
            
            {operators.map(operator => (
              <div key={operator.id} style={{ 
                display: 'grid', 
                gridTemplateColumns: `200px 1fr 1fr`,
                borderBottom: '1px solid #e2e8f0',
                background: 'white'
              }}>
                <div style={{ 
                  padding: '12px', 
                  borderRight: '1px solid #e2e8f0', 
                  fontWeight: '500', 
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{ fontWeight: '500' }}>{operator.name}</div>
                </div>
                
                {/* Çay fasilələri */}
                <div style={{ padding: '8px', borderRight: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(userBreaks[operator.id]?.tea || []).map((breakTime, index) => (
                      <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <select 
                          value={breakTime}
                          onChange={(e) => handleBreakChange(operator.id, 'tea', index, e.target.value)}
                          style={{
                            padding: '8px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            fontSize: '12px',
                            flex: 1,
                            background: breakTime ? '#dbeafe' : 'white'
                          }}
                        >
                          <option value="">Çay fasiləsi seçin</option>
                          {generateBreakTimes('tea', operators.length).map(time => (
                            <option key={time.time} value={time.time}>{time.time}</option>
                          ))}
                        </select>
                        <button 
                          onClick={() => removeBreak(operator.id, 'tea', index)}
                          style={{
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '8px 12px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => addBreak(operator.id, 'tea')}
                      style={{
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '8px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      + Çay fasiləsi əlavə et
                    </button>
                  </div>
                </div>
                
                {/* Nahar fasilələri */}
                <div style={{ padding: '8px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(userBreaks[operator.id]?.lunch || []).map((breakTime, index) => (
                      <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <select 
                          value={breakTime}
                          onChange={(e) => handleBreakChange(operator.id, 'lunch', index, e.target.value)}
                          style={{
                            padding: '8px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            fontSize: '12px',
                            flex: 1,
                            background: breakTime ? '#dcfce7' : 'white'
                          }}
                        >
                          <option value="">Nahar fasiləsi seçin</option>
                          {generateBreakTimes('lunch', operators.length).map(time => (
                            <option key={time.time} value={time.time}>{time.time}</option>
                          ))}
                        </select>
                        <button 
                          onClick={() => removeBreak(operator.id, 'lunch', index)}
                          style={{
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '8px 12px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => addBreak(operator.id, 'lunch')}
                      style={{
                        background: '#16a34a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '8px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      + Nahar fasiləsi əlavə et
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedShift && operators.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#6b7280',
          background: '#f8fafc',
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
          <h4 style={{ margin: '0 0 8px 0' }}>Operator tapılmadı</h4>
          <p>Seçilmiş növbə və tarix üçün heç bir operator tapılmadı.</p>
        </div>
      )}

      {!selectedShift && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#6b7280',
          background: '#f8fafc',
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏰</div>
          <h4 style={{ margin: '0 0 8px 0' }}>Növbə seçin</h4>
          <p>Fasilələri planlamaq üçün əvvəlcə növbə seçin.</p>
        </div>
      )}

      {/* Yadda saxla butonu */}
      {selectedShift && operators.length > 0 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          marginTop: '20px', 
          gap: '15px'
        }}>
          <button 
            onClick={saveBreaks}
            disabled={saving}
            style={{ 
              ...styles.button, 
              background: saving ? '#6b7280' : '#10b981', 
              color: 'white',
              padding: '12px 24px',
              fontSize: '15px',
              fontWeight: '600',
              opacity: saving ? 0.7 : 1
            }}
          >
            {saving ? '⏳ Saxlanılır...' : '💾 Fasilələri Yadda Saxla'}
          </button>
        </div>
      )}
    </div>
  );
}

function AdminDashboard({ user, userProfile, users, schedules, shiftTypes, shiftChanges, vacations, breaks, breakRequests, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showBreakPlanner, setShowBreakPlanner] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'operator', department: 'info_sale', password: '' });
  const [newSchedule, setNewSchedule] = useState({ userId: '', date: '', shiftType: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const getFilteredUsers = () => {
    if (userProfile.department === 'management') {
      return users;
    }
    return users.filter(u => u.department === userProfile.department);
  };

  const filteredUsers = getFilteredUsers();

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert('⚠️ Zəhmət olmasa bütün sahələri doldurun!');
      return;
    }
  
    try {
      // 1️⃣ Eyni email varsa — dayandır
      const existingUsers = users.filter(u => u.email === newUser.email);
      if (existingUsers.length > 0) {
        alert('❌ Bu email artıq sistemdə mövcuddur!');
        return;
      }
  
      // 2️⃣ Firebase Authentication-da istifadəçi yarat
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newUser.email,
        newUser.password
      );
      const userId = userCredential.user.uid;
  
      // 3️⃣ İstifadəçi məlumatları - YALNIZ BURAYA YAZ
      const userData = {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        status: 'active',
        createdAt: serverTimestamp()
      };
  
      // 4️⃣ YALNIZ BURAYA YAZ - users/{uid}
      await setDoc(doc(db, 'users', userId), userData);
  
      alert(`✅ ${newUser.name} uğurla yaradıldı!`);
      setShowAddUserModal(false);
      setNewUser({
        name: '',
        email: '',
        role: 'operator',
        department: 'info_sale',
        password: ''
      });
  
    } catch (error) {
      console.error('Add user error:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        alert('❌ Bu email artıq sistemdə mövcuddur!');
      } else if (error.code === 'auth/weak-password') {
        alert('❌ Şifrə çox zəifdir! Minimum 6 simvol olmalıdır.');
      } else {
        alert('❌ Xəta: ' + error.message);
      }
    }
  };

  const handleAddSchedule = async () => {
    if (!newSchedule.userId || !newSchedule.date || !newSchedule.shiftType) {
      alert('⚠️ Zəhmət olmasa bütün sahələri doldurun!');
      return;
    }

    try {
      const selectedShift = shiftTypes.find(shift => shift.id === newSchedule.shiftType);
      const selectedUser = users.find(u => u.id === newSchedule.userId);
      
      if (!selectedUser) {
        alert('❌ Seçilmiş istifadəçi tapılmadı!');
        return;
      }

      const existingSchedule = schedules.find(s => 
        s.userId === newSchedule.userId && s.date === newSchedule.date
      );

      if (existingSchedule) {
        alert('❌ Bu istifadəçinin həmin tarixdə artıq növbəsi var!');
        return;
      }

      await addDoc(collection(db, 'schedules'), {
        userId: newSchedule.userId,
        userName: selectedUser.name,
        userDepartment: selectedUser.department,
        date: newSchedule.date,
        shiftName: selectedShift.name,
        startTime: selectedShift.startTime,
        endTime: selectedShift.endTime,
        status: 'confirmed',
        assignedBy: userProfile.name,
        assignedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      });

      alert('✅ Növbə uğurla planlaşdırıldı!');
      setShowScheduleModal(false);
      setNewSchedule({ userId: '', date: '', shiftType: '' });
      
    } catch (error) {
      console.error('Add schedule error:', error);
      alert('❌ Xəta: ' + error.message);
    }
  };

  const handleEditUser = async (userId, updates) => {
    try {
      await updateDoc(doc(db, 'users', userId), updates);
      alert('✅ İstifadəçi məlumatları yeniləndi!');
    } catch (error) {
      console.error('Edit user error:', error);
      alert('❌ Xəta: ' + error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (confirm('Bu istifadəçini silmək istədiyinizə əminsiniz?')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        alert('✅ İstifadəçi silindi!');
      } catch (error) {
        console.error('Delete user error:', error);
        alert('❌ Xəta: ' + error.message);
      }
    }
  };

  const handleGenerateReports = () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthSchedules = schedules.filter(s => s.date?.startsWith(currentMonth));
    
    const reportData = {
      month: currentMonth,
      totalUsers: filteredUsers.length,
      totalSchedules: monthSchedules.length,
      department: departments[userProfile.department]?.name,
      users: filteredUsers.map(user => ({
        name: user.name,
        role: user.role,
        schedules: monthSchedules.filter(s => s.userId === user.id).length
      }))
    };

    console.log('📊 HESABAT:', reportData);
    alert(`📊 ${currentMonth} ayı hesabatı hazırlandı! Konsola yazıldı.`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboardContent 
          users={filteredUsers} 
          schedules={schedules} 
          onAddUser={() => setShowAddUserModal(true)}
          onScheduleShift={() => setShowScheduleModal(true)}
          onGenerateReports={handleGenerateReports}
          onOpenBreakPlanner={() => setShowBreakPlanner(true)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          currentUser={userProfile}
          shiftTypes={shiftTypes}
          vacations={vacations}
        />;
      case 'monthly':
        return <AdminMonthlySchedule 
          schedules={schedules} 
          users={filteredUsers} 
          shiftTypes={shiftTypes} 
          selectedMonth={selectedMonth} 
          onMonthChange={setSelectedMonth}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />;
      case 'planner':
        return <SchedulePlanner 
          users={filteredUsers}
          schedules={schedules}
          shiftTypes={shiftTypes}
          currentUser={userProfile}
        />;
      case 'users':
        return <AdminUsers 
          users={filteredUsers} 
          onEditUser={handleEditUser} 
          onDeleteUser={handleDeleteUser}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          currentUser={userProfile}
        />;
      case 'approvals':
        return <AdminApprovals 
          shiftChanges={shiftChanges} 
          vacations={vacations} 
          users={filteredUsers}
          currentUser={userProfile}
        />;
      case 'reports':
        return <AdminReports 
          schedules={schedules} 
          users={filteredUsers} 
          selectedMonth={selectedMonth} 
          onMonthChange={setSelectedMonth}
          shiftChanges={shiftChanges}
          vacations={vacations}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />;
      case 'breaks':
        return <BreakPlanner 
          users={filteredUsers}
          schedules={schedules}
          breaks={breaks}
          currentUser={userProfile}
          onSaveBreaks={() => setActiveTab('dashboard')}
        />;
      default:
        return <AdminDashboardContent 
          users={filteredUsers} 
          schedules={schedules}
          onAddUser={() => setShowAddUserModal(true)}
          onScheduleShift={() => setShowScheduleModal(true)}
          onGenerateReports={handleGenerateReports}
          onOpenBreakPlanner={() => setShowBreakPlanner(true)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          currentUser={userProfile}
          shiftTypes={shiftTypes}
          vacations={vacations}
        />;
    }
  };

  return (
    <div style={styles.dashboard}>
      <header style={styles.header}>
        <h1 style={{ color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          {userProfile.role === 'admin' ? '👑' : '👤'}
          <span>{roles[userProfile.role]?.name} PANEL</span>
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ 
            color: 'white', 
            background: 'rgba(255,255,255,0.2)', 
            padding: '8px 16px', 
            borderRadius: '20px', 
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {userProfile?.name} • {departments[userProfile.department]?.name}
          </span>
          <button 
            onClick={onLogout} 
            style={{ 
              ...styles.button, 
              background: 'white', 
              color: '#dc2626',
              fontWeight: '600'
            }}
          >
            🚪 Çıxış
          </button>
        </div>
      </header>

      <nav style={styles.nav}>
        <button 
          onClick={() => setActiveTab('dashboard')} 
          style={{ 
            ...styles.button, 
            background: activeTab === 'dashboard' ? '#3b82f6' : '#e2e8f0', 
            color: activeTab === 'dashboard' ? 'white' : '#64748b',
            fontWeight: '600'
          }}
        >
          📊 Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('planner')} 
          style={{ 
            ...styles.button, 
            background: activeTab === 'planner' ? '#3b82f6' : '#e2e8f0', 
            color: activeTab === 'planner' ? 'white' : '#64748b',
            fontWeight: '600'
          }}
        >
          🎯 Növbə Planlayıcı
        </button>
        <button 
          onClick={() => setActiveTab('monthly')} 
          style={{ 
            ...styles.button, 
            background: activeTab === 'monthly' ? '#3b82f6' : '#e2e8f0', 
            color: activeTab === 'monthly' ? 'white' : '#64748b',
            fontWeight: '600'
          }}
        >
          📅 Aylıq Növbə
        </button>
        <button 
          onClick={() => setActiveTab('users')} 
          style={{ 
            ...styles.button, 
            background: activeTab === 'users' ? '#3b82f6' : '#e2e8f0', 
            color: activeTab === 'users' ? 'white' : '#64748b',
            fontWeight: '600'
          }}
        >
          👥 İstifadəçilər
        </button>
        <button 
          onClick={() => setActiveTab('approvals')} 
          style={{ 
            ...styles.button, 
            background: activeTab === 'approvals' ? '#3b82f6' : '#e2e8f0', 
            color: activeTab === 'approvals' ? 'white' : '#64748b',
            fontWeight: '600'
          }}
        >
          ✅ Təsdiqlər
        </button>
        <button 
          onClick={() => setActiveTab('reports')} 
          style={{ 
            ...styles.button, 
            background: activeTab === 'reports' ? '#3b82f6' : '#e2e8f0', 
            color: activeTab === 'reports' ? 'white' : '#64748b',
            fontWeight: '600'
          }}
        >
          📈 Hesabatlar
        </button>
        <button 
          onClick={() => setActiveTab('breaks')} 
          style={{ 
            ...styles.button, 
            background: activeTab === 'breaks' ? '#3b82f6' : '#e2e8f0', 
            color: activeTab === 'breaks' ? 'white' : '#64748b',
            fontWeight: '600'
          }}
        >
          ☕ Fasilələr
        </button>
      </nav>

      <div style={styles.content}>
        {activeTab !== 'planner' && activeTab !== 'breaks' && (
          <input
            style={styles.searchBox}
            placeholder="🔍 Axtarış (ad, email, şöbə...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}
        
        {renderContent()}
      </div>

      {/* Yeni İstifadəçi Modal */}
      {showAddUserModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>Yeni İstifadəçi Əlavə Et</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                Ad Soyad
              </label>
              <input 
                style={styles.input} 
                placeholder="Ad Soyad" 
                value={newUser.name} 
                onChange={(e) => setNewUser({...newUser, name: e.target.value})} 
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                Email
              </label>
              <input 
                style={styles.input} 
                type="email" 
                placeholder="Email" 
                value={newUser.email} 
                onChange={(e) => setNewUser({...newUser, email: e.target.value})} 
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                Şifrə
              </label>
              <input 
                style={styles.input} 
                type="password" 
                placeholder="Şifrə (minimum 6 simvol)" 
                value={newUser.password} 
                onChange={(e) => setNewUser({...newUser, password: e.target.value})} 
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                Rol
              </label>
              <select 
                style={styles.input} 
                value={newUser.role} 
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
              >
                <option value="operator">Operator</option>
                <option value="admin">Qrup Rəhbəri</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                Şöbə
              </label>
              <select 
                style={styles.input} 
                value={newUser.department} 
                onChange={(e) => setNewUser({...newUser, department: e.target.value})}
              >
                <option value="info_sale">İnfo Sale</option>
                <option value="technical">Texniki</option>
                <option value="management">İdarəetmə</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button 
                onClick={handleAddUser} 
                style={{ ...styles.button, background: '#10b981', color: 'white', flex: 1, fontWeight: '600' }}
              >
                ➕ Əlavə Et
              </button>
              <button 
                onClick={() => setShowAddUserModal(false)} 
                style={{ ...styles.button, background: '#6b7280', color: 'white', flex: 1, fontWeight: '600' }}
              >
                ❌ Ləğv Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Növbə Planlaşdırma Modal */}
      {showScheduleModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>Növbə Planlaşdır</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                İstifadəçi
              </label>
              <select 
                style={styles.input} 
                value={newSchedule.userId} 
                onChange={(e) => setNewSchedule({...newSchedule, userId: e.target.value})}
              >
                <option value="">İstifadəçi seçin</option>
                {filteredUsers
                  .filter(u => u.role !== 'admin' && u.status !== 'inactive')
                  .map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} - {departments[user.department]?.name} ({roles[user.role]?.name})
                  </option>
                ))}
              </select>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                Tarix
              </label>
              <input 
                style={styles.input} 
                type="date" 
                value={newSchedule.date} 
                onChange={(e) => setNewSchedule({...newSchedule, date: e.target.value})} 
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                Növbə Növü
              </label>
              <select 
                style={styles.input} 
                value={newSchedule.shiftType} 
                onChange={(e) => setNewSchedule({...newSchedule, shiftType: e.target.value})}
              >
                <option value="">Növbə növü seçin</option>
                {shiftTypes.map(shift => (
                  <option key={shift.id} value={shift.id}>{shift.name} ({shift.startTime}-{shift.endTime})</option>
                ))}
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button 
                onClick={handleAddSchedule} 
                style={{ ...styles.button, background: '#10b981', color: 'white', flex: 1, fontWeight: '600' }}
              >
                📅 Planlaşdır
              </button>
              <button 
                onClick={() => setShowScheduleModal(false)} 
                style={{ ...styles.button, background: '#6b7280', color: 'white', flex: 1, fontWeight: '600' }}
              >
                ❌ Ləğv Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fasilə Planlayıcı Modal */}
      {showBreakPlanner && (
        <div style={styles.modal}>
          <div style={{...styles.modalContent, maxWidth: '90%', width: '1200px'}}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#1e293b' }}>Fasilə Planlayıcı</h2>
              <button 
                onClick={() => setShowBreakPlanner(false)}
                style={{ ...styles.button, background: '#6b7280', color: 'white', fontWeight: '600' }}
              >
                ❌ Bağla
              </button>
            </div>
            <BreakPlanner 
              users={filteredUsers}
              schedules={schedules}
              breaks={breaks}
              currentUser={userProfile}
              onSaveBreaks={() => setShowBreakPlanner(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;