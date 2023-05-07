import MuiThemeProvider from '@/providers/MuiThemeProvider';
import { OutingsProvider } from '@/providers/OutingsProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MuiThemeProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <OutingsProvider>
            <Component {...pageProps} />
          </OutingsProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </MuiThemeProvider>
  );
}
