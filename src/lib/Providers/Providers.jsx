import { ThemeProvider } from "@mui/material";
import { theme } from "./Theme/Theme";

// eslint-disable-next-line react/prop-types
const Providers = ({children}) => {
    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    );
};

export default Providers;