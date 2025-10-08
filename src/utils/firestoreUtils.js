import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';

export const saveScheduleChanges = async (db, appId, activeMonth, targetUserId, updatedShiftsObject, userId) => {
  const monthDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'monthlySchedules', activeMonth);

  const offCount = Object.values(updatedShiftsObject).filter(s => s === 'OFF' || s === 'M').length;

  try {
    await runTransaction(db, async (transaction) => {
      const monthDoc = await transaction.get(monthDocRef);
      const existingAssignments = monthDoc.exists() ? monthDoc.data().userAssignments || {} : {};

      transaction.set(monthDocRef, {
        userAssignments: {
          ...existingAssignments,
          [targetUserId]: {
            userId: targetUserId,
            shifts: updatedShiftsObject, 
            offCount: offCount,
            assignedBy: userId,
            timestamp: serverTimestamp(),
          }
        }
      }, { merge: true });
    });
    return true;
  } catch (e) {
    console.error("Fərdi Cədvəl Təyin Etmə Xətası:", e);
    throw new Error(`Fərdi cədvəli ${targetUserId} üçün təyin etmək mümkün olmadı.`);
  }
};