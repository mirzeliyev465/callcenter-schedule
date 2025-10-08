# Globals CSS
cat > src/styles/globals.css << 'EOF'
:root {
  --primary: #3b82f6;
  --secondary: #8b5cf6;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: #f9fafb;
}

.sidebar-menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  transition: all 0.2s;
}

.sidebar-menu-item.active {
  background: #2563eb;
  color: white;
}

.input-field {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  transition: all 0.2s;
}

.input-field:focus {
  outline: none;
  ring: 2px;
  ring-color: #3b82f6;
  border-color: #3b82f6;
}
EOF