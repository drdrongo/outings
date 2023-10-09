import Layout from '@/components/Layout';
import { AlertProvider } from '@/providers/AlertProvider';
import MuiThemeProvider from '@/providers/MuiThemeProvider';
import { OutingsProvider } from '@/providers/OutingsProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no"
        ></meta>
      </Head>
      <MuiThemeProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AlertProvider>
              <OutingsProvider>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </OutingsProvider>
            </AlertProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </MuiThemeProvider>
    </>
  );
}
