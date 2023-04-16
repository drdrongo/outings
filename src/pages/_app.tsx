import MuiThemeProvider from '@/providers/MuiThemeProvider';
import { OutingsProvider } from '@/providers/OutingsProvider';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const adjustVewHeight = () => {
    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    document.documentElement.style.setProperty('--doc-height', `${window.innerHeight}px`)
  }

  useEffect(() => {
    window.addEventListener("resize", adjustVewHeight)
    adjustVewHeight()
  }, []);

  return (
    <MuiThemeProvider>
    <QueryClientProvider client={queryClient}>
      <OutingsProvider>
        <Component {...pageProps} />
      </OutingsProvider>
    </QueryClientProvider>
    </MuiThemeProvider>
  );
}
