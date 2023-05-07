import NewOutingModal from '@/components/NewOutingModal';
import { AlertProvider } from '@/providers/AlertProvider';
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
          <AlertProvider>
            <OutingsProvider>
              <Component {...pageProps} />

              <NewOutingModal />
            </OutingsProvider>
          </AlertProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </MuiThemeProvider>
  );
}
