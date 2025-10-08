import { firestoreService } from './firestore.service';

class ScheduleService {
  constructor() {
    this.firestore = firestoreService;
  }

  // ========== SCHEDULE MANAGEMENT ==========

  // Aylıq növbə cədvəlini almaq
  async getMonthlySchedule(year, month) {
    try {
      // Ayın ilk və son günlərini hesabla
      const firstDay = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      const lastDay = new Date(year, month + 1, 0).getDate();
      const lastDayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

      // Bu ay üçün bütün növbələri almaq
      const allSchedules = await this.firestore.getAllSchedules();
      
      return allSchedules.filter(schedule => {
        const scheduleDate = new Date(schedule.date);
        return scheduleDate.getFullYear() === year && 
               scheduleDate.getMonth() === month;
      });
    } catch (error) {
      console.error('Error getting monthly schedule:', error);
      throw error;
    }
  }

  // İstifadəçinin aylıq növbə cədvəlini almaq
  async getUserMonthlySchedule(userId, year, month) {
    try {
      const userSchedules = await this.firestore.getSchedulesByUser(userId);
      
      return userSchedules.filter(schedule => {
        const scheduleDate = new Date(schedule.date);
        return scheduleDate.getFullYear() === year && 
               scheduleDate.getMonth() === month;
      });
    } catch (error) {
      console.error('Error getting user monthly schedule:', error);
      throw error;
    }
  }

  // Gün üçün növbə cədvəlini almaq
  async getDailySchedule(date) {
    try {
      return await this.firestore.getSchedulesByDate(date);
    } catch (error) {
      console.error('Error getting daily schedule:', error);
      throw error;
    }
  }

  // Növbə təyin etmək
  async assignSchedule(scheduleData) {
    try {
      // Eyni tarix və istifadəçi üçün mövcud növbəni yoxla
      const existingSchedules = await this.firestore.getSchedulesByDate(scheduleData.date);
      const existingSchedule = existingSchedules.find(
        s => s.operatorId === scheduleData.operatorId
      );

      if (existingSchedule) {
        // Mövcud növbəni yenilə
        return await this.firestore.updateSchedule(existingSchedule.id, scheduleData);
      } else {
        // Yeni növbə əlavə et
        return await this.firestore.createSchedule(scheduleData);
      }
    } catch (error) {
      console.error('Error assigning schedule:', error);
      throw error;
    }
  }

  // Çoxlu növbə təyin etmək
  async assignMultipleSchedules(schedulesData) {
    try {
      const results = [];
      for (const scheduleData of schedulesData) {
        const result = await this.assignSchedule(scheduleData);
        results.push(result);
      }
      return results;
    } catch (error) {
      console.error('Error assigning multiple schedules:', error);
      throw error;
    }
  }

  // Növbəni ləğv etmək
  async cancelSchedule(scheduleId) {
    try {
      return await this.firestore.deleteSchedule(scheduleId);
    } catch (error) {
      console.error('Error canceling schedule:', error);
      throw error;
    }
  }

  // ========== SHIFT CHANGE REQUESTS ==========

  // Smən dəyişikliyi tələbi göndərmək
  async requestShiftChange(requestData) {
    try {
      const request = {
        ...requestData,
        type: 'shift_change',
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      return await this.firestore.createApprovalRequest(request);
    } catch (error) {
      console.error('Error requesting shift change:', error);
      throw error;
    }
  }

  // Təsdiq tələblərini almaq
  async getApprovalRequests(status = null) {
    try {
      if (status === 'pending') {
        return await this.firestore.getPendingApprovals();
      }
      return await this.firestore.getAllApprovalRequests();
    } catch (error) {
      console.error('Error getting approval requests:', error);
      throw error;
    }
  }

  // İstifadəçinin təsdiq tələblərini almaq
  async getUserApprovalRequests(userId) {
    try {
      return await this.firestore.getUserApprovalRequests(userId);
    } catch (error) {
      console.error('Error getting user approval requests:', error);
      throw error;
    }
  }

  // Təsdiq tələbini qəbul etmək
  async approveRequest(requestId, approvedBy) {
    try {
      const request = await this.firestore.getById('approvalRequests', requestId);
      
      if (request.type === 'shift_change') {
        // Növbəni yenilə
        await this.firestore.updateSchedule(request.scheduleId, {
          shift: request.requestedShift,
          status: 'approved'
        });
      }

      // Təsdiq tələbini yenilə
      return await this.firestore.updateApprovalRequest(requestId, {
        status: 'approved',
        approvedBy,
        approvedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error approving request:', error);
      throw error;
    }
  }

  // Təsdiq tələbini rədd etmək
  async rejectRequest(requestId, rejectedBy, reason = '') {
    try {
      return await this.firestore.updateApprovalRequest(requestId, {
        status: 'rejected',
        rejectedBy,
        rejectedAt: new Date().toISOString(),
        rejectionReason: reason
      });
    } catch (error) {
      console.error('Error rejecting request:', error);
      throw error;
    }
  }

  // ========== SCHEDULE VALIDATION ==========

  // Növbə konfliktini yoxlamaq
  async checkScheduleConflict(date, operatorId, shift) {
    try {
      const dailySchedules = await this.getDailySchedule(date);
      
      return dailySchedules.some(schedule => 
        schedule.operatorId === operatorId && 
        schedule.shift === shift
      );
    } catch (error) {
      console.error('Error checking schedule conflict:', error);
      throw error;
    }
  }

  // İstifadəçinin müəyyən tarixdə növbəsi olub-olmadığını yoxlamaq
  async hasUserScheduleOnDate(userId, date) {
    try {
      const userSchedules = await this.firestore.getSchedulesByUser(userId);
      return userSchedules.some(schedule => schedule.date === date);
    } catch (error) {
      console.error('Error checking user schedule:', error);
      throw error;
    }
  }

  // ========== STATISTICS & REPORTS ==========

  // Aylıq statistikalar
  async getMonthlyStats(year, month) {
    try {
      const monthlySchedules = await this.getMonthlySchedule(year, month);
      
      const totalSchedules = monthlySchedules.length;
      const uniqueUsers = [...new Set(monthlySchedules.map(s => s.operatorId))].length;
      
      // Smən paylanması
      const shiftDistribution = monthlySchedules.reduce((acc, schedule) => {
        acc[schedule.shift] = (acc[schedule.shift] || 0) + 1;
        return acc;
      }, {});

      // Günlük doluluq
      const dailyOccupancy = {};
      monthlySchedules.forEach(schedule => {
        dailyOccupancy[schedule.date] = (dailyOccupancy[schedule.date] || 0) + 1;
      });

      return {
        totalSchedules,
        uniqueUsers,
        shiftDistribution,
        dailyOccupancy,
        averageDailySchedules: totalSchedules / Object.keys(dailyOccupancy).length
      };
    } catch (error) {
      console.error('Error getting monthly stats:', error);
      throw error;
    }
  }

  // İstifadəçi statistikaları
  async getUserStats(userId, year, month) {
    try {
      const userSchedules = await this.getUserMonthlySchedule(userId, year, month);
      
      const totalShifts = userSchedules.length;
      const shiftTypes = userSchedules.reduce((acc, schedule) => {
        acc[schedule.shift] = (acc[schedule.shift] || 0) + 1;
        return acc;
      }, {});

      return {
        totalShifts,
        shiftTypes,
        workDays: totalShifts,
        offDays: new Date(year, month + 1, 0).getDate() - totalShifts
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }

  // ========== NOTIFICATIONS ==========

  // Yaxınlaşan növbələr haqqında bildiriş
  async getUpcomingSchedules(days = 7) {
    try {
      const today = new Date();
      const upcomingDate = new Date();
      upcomingDate.setDate(today.getDate() + days);

      const allSchedules = await this.firestore.getAllSchedules();
      
      return allSchedules.filter(schedule => {
        const scheduleDate = new Date(schedule.date);
        return scheduleDate >= today && scheduleDate <= upcomingDate;
      });
    } catch (error) {
      console.error('Error getting upcoming schedules:', error);
      throw error;
    }
  }

  // Boş növbələri tapmaq
  async findAvailableSlots(date, shift) {
    try {
      const dailySchedules = await this.getDailySchedule(date);
      const allUsers = await this.firestore.getAllUsers();
      const operators = allUsers.filter(user => user.role === 'operator');

      const assignedOperatorIds = dailySchedules
        .filter(s => s.shift === shift)
        .map(s => s.operatorId);

      return operators.filter(operator => 
        !assignedOperatorIds.includes(operator.id)
      );
    } catch (error) {
      console.error('Error finding available slots:', error);
      throw error;
    }
  }

  // ========== DATA EXPORT ==========

  // Növbə məlumatlarını export etmək
  async exportScheduleData(year, month, format = 'json') {
    try {
      const schedules = await this.getMonthlySchedule(year, month);
      const users = await this.firestore.getAllUsers();

      const data = schedules.map(schedule => {
        const user = users.find(u => u.id === schedule.operatorId);
        return {
          date: schedule.date,
          shift: schedule.shift,
          operatorName: user ? `${user.name} ${user.surname}` : 'Unknown',
          operatorEmail: user ? user.email : 'Unknown',
          status: schedule.status || 'approved'
        };
      });

      if (format === 'json') {
        return JSON.stringify(data, null, 2);
      } else if (format === 'csv') {
        const headers = ['Date', 'Shift', 'Operator Name', 'Operator Email', 'Status'];
        const csv = [
          headers.join(','),
          ...data.map(row => Object.values(row).join(','))
        ].join('\n');
        return csv;
      }

      return data;
    } catch (error) {
      console.error('Error exporting schedule data:', error);
      throw error;
    }
  }
}

// Singleton instance
export const scheduleService = new ScheduleService();
export default scheduleService;