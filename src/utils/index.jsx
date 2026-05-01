/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import {
  Button,
  Paper,
  styled,
  Tab,
  TextField,
  Typography,
  alpha,
  Card,
  Box,
  Avatar,
} from "@mui/material";

export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: "2rem",
  borderRadius: "16px",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
  background: "linear-gradient(to right, #ffffff, #f8f9fa)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "6px",
    height: "100%",
    background: "linear-gradient(to bottom, #42A1DA, #2980b9)",
  },
}));

export const UploadButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(135deg, #42A1DA 0%, #2980b9 100%)",
  color: "white",
  padding: "10px 16px",
  borderRadius: "8px",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 12px rgba(66, 161, 218, 0.3)",
  "&:hover": {
    background: "linear-gradient(135deg, #2980b9 0%, #1e6091 100%)",
    boxShadow: "0 6px 16px rgba(66, 161, 218, 0.4)",
    transform: "translateY(-2px)",
  },
}));

export const SubmitButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(135deg, #42A1DA 0%, #2980b9 100%)",
  color: "white",
  padding: "12px 24px",
  borderRadius: "8px",
  fontSize: "1rem",
  fontWeight: "bold",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 12px rgba(66, 161, 218, 0.3)",
  "&:hover": {
    background: "linear-gradient(135deg, #2980b9 0%, #1e6091 100%)",
    boxShadow: "0 6px 16px rgba(66, 161, 218, 0.4)",
    transform: "translateY(-2px)",
  },
  "&:disabled": {
    background: "#cccccc",
    color: "#666666",
  },
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    transition: "all 0.3s ease",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#42A1DA",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#42A1DA",
      borderWidth: "2px",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#42A1DA",
  },
}));

export const StyledTab = styled(Tab)(({ theme }) => ({
  fontWeight: "bold",
  textTransform: "none",
  minWidth: "120px",
  "&.Mui-selected": {
    color: "#42A1DA",
  },
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  fontSize: "1.1rem",
  color: "#2980b9",
  marginBottom: "1rem",
  display: "flex",
  alignItems: "center",
  "&::after": {
    content: '""',
    flex: 1,
    height: "1px",
    background: "linear-gradient(to right, rgba(66, 161, 218, 0.5), transparent)",
    marginLeft: "10px",
  },
}));

export const boxStyle = (theme) => ({
  width: "100%",
  height: "120px",
  background: alpha(theme.palette.primary.main, 0.05),
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    background: alpha(theme.palette.primary.main, 0.1),
  },
});
// supplier form
export const StyledCard = styled(Card)(({ theme }) => ({
  padding: "2rem",
  borderRadius: "16px",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
  background: "linear-gradient(to right, #ffffff, #f8f9fa)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "6px",
    height: "100%",
    background: "linear-gradient(to bottom, #42A1DA, #2980b9)",
  },
}));


export const GlassmorphicBox = styled(Box)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.25)",
  backdropFilter: "blur(10px)",
  borderRadius: 20,
  border: "1px solid rgba(255, 255, 255, 0.18)",
  padding: theme.spacing(3),
  transition: "all 0.3s ease",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.35)",
  },
}));

export const AnimatedAvatar = styled(Avatar)(({ theme }) => ({
  width: 150,
  height: 150,
  border: "4px solid white",
  boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.05) rotate(5deg)",
  },
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(135deg, #42A1DA 0%, #2980b9 100%)",
  color: "white",
  padding: "8px 16px",
  borderRadius: "8px",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "linear-gradient(135deg, #2980b9 0%, #1e6091 100%)",
    boxShadow: "0 4px 12px rgba(66, 161, 218, 0.3)",
  },
}));