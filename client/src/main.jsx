import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import "./index.css";
import App from "./App.jsx";

// 🟢 DEBUG log bắt đầu
console.log("DEBUG: [main.jsx] File loaded");

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#F9704B" },
    secondary: { main: "#FFB199" },
    background: { default: "#fafafa", paper: "#ffffff" },
  },
  shape: { borderRadius: 10 },
  typography: { fontFamily: "'Be Vietnam Pro', 'Roboto', sans-serif" },
});

console.log("DEBUG: [main.jsx] MUI Theme created:", theme);

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("DEBUG: ❌ [main.jsx] Không tìm thấy <div id='root'> trong index.html!");
} else {
  console.log("DEBUG: ✅ [main.jsx] Tìm thấy phần tử root:", rootElement);
}

console.log("DEBUG: ⚙️ [main.jsx] Bắt đầu render ứng dụng...");

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);

console.log("DEBUG: ✅ [main.jsx] React render đã được gọi");
