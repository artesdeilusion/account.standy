import Navbar from '@/components/navbar';
import '@/app/globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Footer from '@/components/footer';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700', '900'],  // Including various weights
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins'  // This allows us to use it as a CSS variable
});

interface LayoutProps {
  children: React.ReactNode;
}
export const metadata: Metadata = {
  title: "Standy",
  description: "Şehrini keşfederken sana özel indirimlerinden yararlan.",
   
  
};

const RootLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="tr" className={poppins.variable}>
      <head>
                {/* Meta tags */}
                <meta charSet="UTF-8" />
        <meta name="title" content="Standy" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Şehrini keşfederken sana özel indirimlerinden yararlan." />
        <meta name="robots" content="noindex"/>
        <link rel="canonical" href={`${process.env.SITE_URL}/`} />

        {/* Favicon and icons */}
        <link rel="icon" href="/favicon-generator.ico" />
        <link rel="icon" href="/favicon-generator.ico/android-icon-48x48.png" sizes="48x48" />
        <link rel="icon" href="/favicon-generator.ico/android-icon-96x96.png" sizes="96x96" />
        <link rel="icon" href="/favicon-generator.ico/android-icon-144x144.png" sizes="144x144" />
        <link rel="icon" href="/favicon-generator.ico/android-icon-192x192.png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/favicon-generator.ico/apple-icon-57x57.png" sizes="57x57" />
        <link rel="apple-touch-icon" href="/favicon-generator.ico/apple-icon-60x60.png" sizes="60x60" />
        <link rel="apple-touch-icon" href="/favicon-generator.ico/apple-icon-72x72.png" sizes="72x72" />
        <link rel="apple-touch-icon" href="/favicon-generator.ico/apple-icon-76x76.png" sizes="76x76" />
        <link rel="apple-touch-icon" href="/favicon-generator.ico/apple-icon-114x114.png" sizes="114x114" />
        <link rel="apple-touch-icon" href="/favicon-generator.ico/apple-icon-120x120.png" sizes="120x120" />
        <link rel="apple-touch-icon" href="/favicon-generator.ico/apple-icon-144x144.png" sizes="144x144" />
        <link rel="apple-touch-icon" href="/favicon-generator.ico/apple-icon-152x152.png" sizes="152x152" />
        <link rel="apple-touch-icon" href="/favicon-generator.ico/apple-icon-180x180.png" sizes="180x180" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-generator.ico/android-icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-generator.ico/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-generator.ico/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-generator.ico/favicon-16x16.png" />
        <link rel="manifest" href="/favicon-generator.ico/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/favicon-generator.ico/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff" />

      </head>
      <body className={`${poppins.className} antialiased`}>
        <ProtectedRoute>
          <main>{children}</main>
        </ProtectedRoute>
       </body>
    </html>
  );
};

export default RootLayout;