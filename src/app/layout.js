import './globals.css';
import NavBar from '../components/layout/NavBar';
import Footer from '../components/layout/Footer';

export const metadata = {
  title: 'Café Lof',
  description: 'Café de alta calidad, tostado artesanalmente y personalizado a tu gusto, frescura garantizada. Solicítalo aquí!',
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
        url: '/favicon/safari-pinned-tab.svg',
        color: '#5bbad5',
      },
    ],
  },
  manifest: '/favicon/site.webmanifest',
  meta: [
    {
      name: 'msapplication-TileColor',
      content: '#da532c',
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col relative">
        <NavBar />
        <div className="flex-grow pt-20 flex flex-col">
          <main className="flex-grow">
            <div className="container mx-auto px-6">
              {children}
            </div>
          </main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
