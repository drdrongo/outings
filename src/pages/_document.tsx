import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <link rel='manifest' href='/manifest.json' />
        <link rel='apple-touch-icon' href='/apple-touch-icon.png'></link>
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
        />
        <meta name='theme-color' content='#FFC0CB' />

        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, viewport-fit=cover'
        ></meta>
        <meta
          name='viewport'
          content='initial-scale=1, viewport-fit=cover, width=device-width'
        ></meta>
        <meta name='apple-mobile-web-app-capable' content='yes'></meta>
        <meta
          name='apple-mobile-web-app-status-bar-style'
          content='black-translucent'
        ></meta>
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
