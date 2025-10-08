import { db } from './firebase.js';
import { doc, setDoc, collection, addDoc, getDocs } from 'firebase/firestore';

export const initializeDemoData = async (currentUser) => {
  try {
    console.log("Demo məlumatlar yüklənir...");
    
    // Əsas departamentlər
    const departments = [
      { 
        id: "dept_customer", 
        name: "Müştəri Xidmətləri", 
        color: "#3B82F6", 
        active: true,
        description: "Müştəri zəngləri və sorğuları"
      },
      { 
        id: "dept_technical", 
        name: "Texniki Dəstək", 
        color: "#10B981", 
        active: true,
        description: "Texniki problemlər və dəstək"
      },
      { 
        id: "dept_sales", 
        name: "Satış", 
        color: "#F59E0B", 
        active: true,
        description: "Satış və müştəri əlaqələri"
      },
      { 
        id: "dept_hr", 
        name: "İnsan Resursları", 
        color: "#8B5CF6", 
        active: true,
        description: "İşçi mənzərəsi və HR"
      },
      { 
        id: "dept_quality", 
        name: "Keyfiyyət Kontrol", 
        color: "#EF4444", 
        active: true,
        description: "Zəng keyfiyyəti və monitorinq"
      }
    ];

    // Növbə növləri - real call center smenləri
    const shiftTypes = [
      { 
        id: "shift_9_5", 
        name: "9-5", 
        startTime: "09:00", 
        endTime: "17:00", 
        color: "#60A5FA",
        duration: "8 saat",
        type: "normal"
      },
      { 
        id: "shift_9_6", 
        name: "9-6", 
        startTime: "09:00", 
        endTime: "18:00", 
        color: "#3B82F6",
        duration: "9 saat",
        type: "normal"
      },
      { 
        id: "shift_10_7", 
        name: "10-7", 
        startTime: "10:00", 
        endTime: "19:00", 
        color: "#2563EB",
        duration: "9 saat",
        type: "normal"
      },
      { 
        id: "shift_10_6", 
        name: "10-6", 
        startTime: "10:00", 
        endTime: "18:00", 
        color: "#1D4ED8",
        duration: "8 saat",
        type: "normal"
      },
      { 
        id: "shift_11_7", 
        name: "11-7", 
        startTime: "11:00", 
        endTime: "19:00", 
        color: "#34D399",
        duration: "8 saat",
        type: "normal"
      },
      { 
        id: "shift_12_8", 
        name: "12-8", 
        startTime: "12:00", 
        endTime: "20:00", 
        color: "#10B981",
        duration: "8 saat",
        type: "normal"
      },
      { 
        id: "shift_1_9", 
        name: "1-9", 
        startTime: "13:00", 
        endTime: "21:00", 
        color: "#059669",
        duration: "8 saat",
        type: "normal"
      },
      { 
        id: "shift_off", 
        name: "OFF", 
        startTime: "00:00", 
        endTime: "00:00", 
        color: "#6B7280",
        duration: "0 saat",
        type: "off"
      },
      { 
        id: "shift_vacation", 
        name: "M", 
        startTime: "00:00", 
        endTime: "00:00", 
        color: "#8B5CF6",
        duration: "0 saat",
        type: "vacation"
      },
      { 
        id: "shift_night", 
        name: "Gecə", 
        startTime: "22:00", 
        endTime: "06:00", 
        color: "#1E293B",
        duration: "8 saat",
        type: "night"
      },
      { 
        id: "shift_early", 
        name: "Erkən", 
        startTime: "07:00", 
        endTime: "15:00", 
        color: "#F59E0B",
        duration: "8 saat",
        type: "early"
      },
      { 
        id: "shift_late", 
        name: "Gec", 
        startTime: "15:00", 
        endTime: "23:00", 
        color: "#DC2626",
        duration: "8 saat",
        type: "late"
      }
    ];

    // Demo istifadəçilər - real call center işçiləri
    const demoUsers = [
      {
        id: "user_admin",
        name: "Fərid Əliyev",
        email: "ferid@callcenter.com",
        role: "admin",
        department: "dept_hr",
        initialShift: "shift_9_5",
        phone: "+994501234567",
        position: "Menecer",
        status: "active"
      },
      {
        id: "user_supervisor1",
        name: "Günay Həsənova",
        email: "gunay@callcenter.com",
        role: "operator",
        department: "dept_customer",
        initialShift: "shift_10_7",
        phone: "+994501234568",
        position: "Supervisor",
        status: "active"
      },
      {
        id: "user_agent1",
        name: "Rəşad Məmmədov",
        email: "reshad@callcenter.com",
        role: "user",
        department: "dept_customer",
        initialShift: "shift_9_6",
        phone: "+994501234569",
        position: "Call Center Agent",
        status: "active"
      },
      {
        id: "user_agent2",
        name: "Aygün Quliyeva",
        email: "aygun@callcenter.com",
        role: "user",
        department: "dept_technical",
        initialShift: "shift_11_7",
        phone: "+994501234570",
        position: "Texniki Dəstək",
        status: "active"
      },
      {
        id: "user_agent3",
        name: "Elvin Cəfərov",
        email: "elvin@callcenter.com",
        role: "user",
        department: "dept_sales",
        initialShift: "shift_12_8",
        phone: "+994501234571",
        position: "Satış Nümayəndəsi",
        status: "active"
      },
      {
        id: "user_agent4",
        name: "Ləman Əhmədova",
        email: "leman@callcenter.com",
        role: "user",
        department: "dept_quality",
        initialShift: "shift_1_9",
        phone: "+994501234572",
        position: "Keyfiyyət Kontrol",
        status: "active"
      },
      {
        id: "user_agent5",
        name: "Tunar Hüseynov",
        email: "tunar@callcenter.com",
        role: "user",
        department: "dept_customer",
        initialShift: "shift_night",
        phone: "+994501234573",
        position: "Call Center Agent",
        status: "active"
      }
    ];

    // Departamentləri yüklə
    console.log("Departamentlər yüklənir...");
    for (const dept of departments) {
      await setDoc(doc(db, "departments", dept.id), {
        name: dept.name,
        color: dept.color,
        description: dept.description,
        active: dept.active,
        createdAt: new Date(),
        createdBy: currentUser?.uid || "system"
      });
    }

    // Növbə növlərini yüklə
    console.log("Növbə növləri yüklənir...");
    for (const shift of shiftTypes) {
      await setDoc(doc(db, "shiftTypes", shift.id), {
        name: shift.name,
        startTime: shift.startTime,
        endTime: shift.endTime,
        color: shift.color,
        duration: shift.duration,
        type: shift.type,
        active: true,
        createdAt: new Date(),
        createdBy: currentUser?.uid || "system"
      });
    }

    // Demo istifadəçiləri yüklə
    console.log("Demo istifadəçilər yüklənir...");
    for (const user of demoUsers) {
      await setDoc(doc(db, "users", user.id), {
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        initialShift: user.initialShift,
        phone: user.phone,
        position: user.position,
        status: user.status,
        createdAt: new Date(),
        createdBy: currentUser?.uid || "system"
      });
    }

    // Nümunə növbə cədvəli yarat (növbəti 7 gün üçün)
    console.log("Nümunə növbə cədvəli yaradılır...");
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      
      // Hər istifadəçi üçün təsadüfi növbə təyin et
      for (const user of demoUsers) {
        if (user.role !== "admin") { // Admin üçün növbə yoxdur
          const availableShifts = shiftTypes.filter(s => s.type === "normal");
          const randomShift = availableShifts[Math.floor(Math.random() * availableShifts.length)];
          
          await addDoc(collection(db, "schedules"), {
            userId: user.id,
            userName: user.name,
            date: dateString,
            shiftType: randomShift.id,
            shiftName: randomShift.name,
            startTime: randomShift.startTime,
            endTime: randomShift.endTime,
            department: user.department,
            status: "scheduled",
            createdAt: new Date(),
            createdBy: currentUser?.uid || "system",
            notes: ""
          });
        }
      }
    }

    // Sistem konfiqurasiyası
    await setDoc(doc(db, "config", "system"), {
      appName: "Call Center Növbə Sistemi",
      version: "1.0.0",
      company: "Call Center MMC",
      maxShiftsPerDay: 3,
      defaultShiftDuration: 8,
      breakTime: 30,
      dataInitialized: true,
      initializedAt: new Date(),
      initializedBy: currentUser?.uid || "system"
    });

    console.log("✅ Bütün demo məlumatlar uğurla yükləndi!");
    return { 
      success: true, 
      departments: departments.length,
      shiftTypes: shiftTypes.length,
      users: demoUsers.length,
      message: "Sistem uğurla quruldu!" 
    };
  } catch (error) {
    console.error("❌ Demo məlumatlar yüklənərkən xəta:", error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Firebase-də məlumatların olub-olmadığını yoxlamaq
export const checkDataExists = async () => {
  try {
    const departmentsSnapshot = await getDocs(collection(db, "departments"));
    const shiftTypesSnapshot = await getDocs(collection(db, "shiftTypes"));
    const usersSnapshot = await getDocs(collection(db, "users"));
    
    return {
      departments: !departmentsSnapshot.empty,
      shiftTypes: !shiftTypesSnapshot.empty,
      users: !usersSnapshot.empty,
      allExists: !departmentsSnapshot.empty && !shiftTypesSnapshot.empty && !usersSnapshot.empty
    };
  } catch (error) {
    console.error("Data check error:", error);
    return {
      departments: false,
      shiftTypes: false,
      users: false,
      allExists: false
    };
  }
};

// Sistem konfiqurasiyasını almaq
export const getSystemConfig = async () => {
  try {
    const { getDoc } = await import('firebase/firestore');
    const configDoc = await getDoc(doc(db, "config", "system"));
    if (configDoc.exists()) {
      return configDoc.data();
    }
    return null;
  } catch (error) {
    console.error("Config get error:", error);
    return null;
  }
};

// İstifadəçi üçün default məlumatları yoxlamaq və yaratmaq
export const initializeUserData = async (userId, userData) => {
  try {
    const userProfile = {
      name: userData.name || userData.email.split('@')[0],
      email: userData.email,
      role: "user",
      department: "dept_customer",
      initialShift: "shift_9_5",
      phone: "",
      position: "Call Center Agent",
      status: "active",
      createdAt: new Date(),
      createdBy: userId
    };

    await setDoc(doc(db, "users", userId), userProfile);
    console.log("User profile created:", userId);
    return userProfile;
  } catch (error) {
    console.error("User data initialization error:", error);
    throw error;
  }
};

export default {
  initializeDemoData,
  checkDataExists,
  getSystemConfig,
  initializeUserData
};