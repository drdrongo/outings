import { ThemeProvider } from '@emotion/react';
import { ReactNode } from 'react';
import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    background: {
      default: "#535353",
    },
    text: {
      primary: "rgb(var(foreground-rgb))"
    },
    primary: {
      main: '#B1C3FF',
    },
    secondary: {
      main: '#535353'
    }
  },
  typography: {
    fontFamily: 'Inter, Roboto, Oxygen, arial',
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
