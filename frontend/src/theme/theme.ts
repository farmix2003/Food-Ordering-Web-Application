import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#FF6B35", // Orange-red for food delivery theme
      light: "#FF8A65",
      dark: "#E64A19",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#4CAF50",
      light: "#81C784",
      dark: "#388E3C",
    },
    background: {
      default: "#FAFAFA",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#2C2C2C",
      secondary: "#666666",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "3.5rem",
      lineHeight: 1.2,
      "@media (max-width:600px)": {
        fontSize: "2.5rem",
      },
    },
    h2: {
      fontWeight: 600,
      fontSize: "2.5rem",
      lineHeight: 1.3,
      "@media (max-width:600px)": {
        fontSize: "2rem",
      },
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem",
      lineHeight: 1.4,
    },
    body1: {
      fontSize: "1.1rem",
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          padding: "12px 32px",
          fontSize: "1.1rem",
          fontWeight: 600,
        },
        contained: {
          boxShadow: "0 4px 12px rgba(255, 107, 53, 0.3)",
          "&:hover": {
            boxShadow: "0 6px 16px rgba(255, 107, 53, 0.4)",
            transform: "translateY(-2px)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
            transform: "translateY(-4px)",
          },
        },
      },
    },
  },
});
