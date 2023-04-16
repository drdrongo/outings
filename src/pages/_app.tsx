import "@/styles/globals.css";
import { createTheme } from "@mui/material";
import type { AppProps } from "next/app";

const theme = createTheme({
  palette: {
    primary: {
      main: "#GHCDAB",
    },
  },
  typography: {
    fontFamily: "Poppins",
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
