import './globals.css';
import NavBar from '../components/layout/NavBar';
import Footer from '../components/layout/Footer';
import SessionProvider from '../components/auth/SessionProvider';
import { auth } from "../../auth"
import { CartProvider } from '@/context/CartContext';
import Script from 'next/script';

export const metadata = {
  title: {
    default: 'Café Lof',
    template: '%s | Café Lof',
  },
  description: 'Café de alta calidad, tostado artesanalmente y personalizado a tu gusto, frescura garantizada. Encuentra tu formato preferido aqui!',
  icons: {
    icon: [
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/x-icon' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180' },
    ],
    other: [
      {
        rel: 'mask-icon',
        color: '#5bbad5',
        url: '/favicon/safari-pinned-tab.svg',
      },
    ],
  },
  openGraph: {
    title: 'Café Lof',
    description: 'Café de alta calidad, tostado artesanalmente y personalizado a tu gusto, frescura garantizada. Solicítalo aquí!',
    url: 'https://cafelof.cl',
    siteName: 'Café Lof',
    images: [
      { url: '/favicon/opengraph-image.png', height: 630, width: 1200, }
    ],
    locale: 'es_CL',
    type: 'website',
  },
  manifest: '/favicon/site.webmanifest',
  meta: [
    {
      name: 'msapplication-TileColor',
      content: '#da532c',
    },
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL),
  alternates: {
    canonical: `./`,
  }
};

export default async function RootLayout({ children }) {

  const session = await auth();

  return (
    <html lang="en">
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-ZPCMK9D9QL"></Script>
        <Script id="google-anayltics">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-ZPCMK9D9QL');`}
        </Script>
      </head>
      <body className="min-h-screen flex flex-col relative">
        <SessionProvider session={session} refetchOnWindowFocus={false}>
          <CartProvider>
            <NavBar />
            <div className="flex-grow pt-20 flex flex-col">
              <main className="flex-grow">
                <div className="mx-auto">
                  {children}
                </div>
              </main>
            </div>
            <Footer />
          </CartProvider>
        </SessionProvider >
      </body>
    </html>
  );
}
