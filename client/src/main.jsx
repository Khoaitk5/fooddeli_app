import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import "./index.css";
import App from "./App.jsx";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#F9704B" },
    secondary: { main: "#FFB199" },
    background: { default: "#fafafa", paper: "#ffffff" },
  },
  shape: { borderRadius: 10 },
  typography: { fontFamily: "'Inter', 'Roboto', sans-serif" },
});

createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>
);
