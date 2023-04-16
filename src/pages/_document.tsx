import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <link rel='manifest' href='/manifest.json' />
        <link rel='apple-touch-icon' href='/apple-touch-icon.png'></link>
        <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
        <meta name='theme-color' content='#FFC0CB' />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
