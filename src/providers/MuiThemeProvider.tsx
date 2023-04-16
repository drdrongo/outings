import { ThemeProvider } from '@emotion/react';
import { ReactNode } from 'react';
import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    background: {
      default: "#535353",
    },
    text: {
      primary: "#ffffff"
    },
    primary: {
      main: '#FFC0CB',
    },
    secondary: {
      main: '#535353'
    }
  },
  typography: {
    fontFamily: 'Poppins',
    fontSize: 18,
  },
});

const MuiThemeProvider = ({
  children,
}: {
  children?: ReactNode;
}) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default MuiThemeProvider;
