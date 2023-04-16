import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <link rel='manifest' href='/manifest.json' />
        <link rel='apple-touch-icon' href='/apple-touch-icon.png'></link>
        <meta name='theme-color' content='#FFC0CB' />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
