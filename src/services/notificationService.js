# Notification Service
cat > src/services/notificationService.js << 'EOF'
export const notificationService = {
  showSuccess(message) {
    this.showNotification(message, 'success');
  },

  showError(message) {
    this.showNotification(message, 'error');
  },

  showNotification(message, type = 'info') {
    const styles = {
      success: { bg: 'bg-green-50 border-green-200 text-green-800', icon: '✅' },
      error: { bg: 'bg-red-50 border-red-200 text-red-800', icon: '❌' },
      warning: { bg: 'bg-yellow-50 border-yellow-200 text-yellow-800', icon: '⚠️' },
      info: { bg: 'bg-blue-50 border-blue-200 text-blue-800', icon: 'ℹ️' }
    };

    const style = styles[type];
    console.log(`${style.icon} ${message}`);
  }
};
EOF