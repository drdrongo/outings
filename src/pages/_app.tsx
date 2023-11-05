import type { ReactElement, ReactNode } from 'react';
import '@/styles/globals.css';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AlertProvider } from '@/providers/AlertProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import MuiThemeProvider from '@/providers/MuiThemeProvider';
import { OutingsProvider } from '@/providers/OutingsProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { StyledEngineProvider } from '@mui/material';
import { CoupleProvider } from '@/providers/CoupleProvider';
import { LoadingProvider } from '@/providers/LoadingProvider';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no"
        ></meta>
      </Head>
      <StyledEngineProvider>
        <MuiThemeProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <LoadingProvider>
                <AuthProvider>
                  <AlertProvider>
                    <CoupleProvider>
                      <OutingsProvider>
                        {getLayout(<Component {...pageProps} />)}
                      </OutingsProvider>
                    </CoupleProvider>
                  </AlertProvider>
                </AuthProvider>
              </LoadingProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </MuiThemeProvider>
      </StyledEngineProvider>
    </>
  );
}
