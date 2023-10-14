import type { ReactElement, ReactNode } from 'react';
import '@/styles/globals.css';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from 'react-query';
import Layout from '@/components/Layout';
import { AlertProvider } from '@/providers/AlertProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import MuiThemeProvider from '@/providers/MuiThemeProvider';
import { OutingsProvider } from '@/providers/OutingsProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? (page => page);

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
            <AuthProvider>
              <AlertProvider>
                <OutingsProvider>
                  {getLayout(<Component {...pageProps} />)}
                </OutingsProvider>
              </AlertProvider>
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </MuiThemeProvider>
    </>
  );
}
