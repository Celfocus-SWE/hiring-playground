import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import { appName } from '@services';
import { CartProvider } from '../../libs/contexts/cart-context';
import { Navbar } from 'modules/app/libs/ui/layout/navbar/Navbar';
import { Footer } from 'modules/app/libs/ui/layout/footer/Footer';
import { OnlineStatusBanner } from 'modules/app/libs/ui/online-status-banner/src';
import { PWAInstallPrompt } from 'modules/app/libs/ui/pwa-install-prompt/src';
import { usePWA } from '../../libs/utils/usePWA';

function CustomApp({ Component, pageProps }: AppProps) {
  usePWA();

  return (
    <>
      <Head>
        <title>Celfocus!</title>

        {/* PWA Meta Tags */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta name="theme-color" content="#0070f3" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Celfocus" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Celfocus Shopping" />
        <meta
          name="description"
          content="Online shopping with offline capabilities and product catalog"
        />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icons/icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/icon-192x192.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/icons/icon-152x152.png"
        />

        {/* Favicon */}
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/icon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/icon-16x16.png"
        />
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#0070f3" />
        <meta
          name="msapplication-TileImage"
          content="/icons/icon-144x144.png"
        />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </Head>
      <CartProvider>
        <div className="app">
          <Navbar />
          <main>
            <Component {...pageProps} />
          </main>
          <Footer />
        </div>
      </CartProvider>
      <OnlineStatusBanner />
      <PWAInstallPrompt />
    </>
  );
}

export default CustomApp;
