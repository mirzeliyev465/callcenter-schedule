// src/styles/theme.js
import colors from "./colors";
import typography from "./typography";
import spacing from "./spacing";

const theme = {
  colors,
  typography,
  spacing,
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "16px",
    xl: "24px",
  },
  shadows: {
    sm: "0 1px 2px rgba(0,0,0,0.05)",
    md: "0 4px 6px rgba(0,0,0,0.1)",
    lg: "0 10px 15px rgba(0,0,0,0.15)",
  },
};

export default theme;
