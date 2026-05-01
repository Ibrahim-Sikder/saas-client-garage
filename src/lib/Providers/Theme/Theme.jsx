import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#42A0D9",
    },
    // secondary: {
    //   main: "#1591A3",
    //   light: "#1491A3",
    // },
  },

  components: {
    MuiButton: {
      defaultProps: {
        variant: "contained",
      },
      styleOverrides: {
        root: {
          padding: "8px 24px",
          boxShadow: "none",
        },
      },
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: "lg",
      },
    },
  },
  // typography: {
  //   body1: {
  //     color: "#0B1134CC",
  //   },
  // },
});


