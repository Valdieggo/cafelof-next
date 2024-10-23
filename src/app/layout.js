import './globals.css';
import NavBar from '../components/layout/NavBar';
import Footer from '../components/layout/Footer';

export const metadata = {
  title: 'Café Lof',
  description: 'Café de alta calidad, tostado artesanalmente y personalizado a tu gusto, frescura garantizada. Solicítalo aquí!',
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
