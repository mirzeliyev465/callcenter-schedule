export const APP_CONFIG = {
  appId: typeof __app_id !== 'undefined' ? __app_id : 'default-schedule-app-id',
  firebaseConfig: typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {},
  initialAuthToken: typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null
};

export const COLLECTIONS = {
  USERS: 'users',
  SCHEDULES: 'monthlySchedules',
  REQUESTS: 'requests'
};

export const SHIFT_SWAP_LIMIT_PER_MONTH = 4;

export const REQUEST_STATUS = {
  PENDING: 'Gözləmədə',
  APPROVED: 'Təsdiqləndi',
  REJECTED: 'Ləğv edildi'
};