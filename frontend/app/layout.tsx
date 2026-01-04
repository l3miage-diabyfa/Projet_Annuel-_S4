import type { Metadata } from "next";
import Script from 'next/script';
import { Poppins, Mochiy_Pop_One, Pacifico } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { UserProvider } from "@/contexts/UserContext";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const mochiyPopOne = Mochiy_Pop_One({
  variable: "--font-mochiy",
  subsets: ["latin"],
  weight: ["400"],
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "IZZZI - School Management",
  description: "Gestion de cours et retours étudiants",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="fr">
      <head>
        {/* Google Analytics - Only in production */}
        {GA_ID && process.env.NODE_ENV === 'production' && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body
        className={`${poppins.variable} ${mochiyPopOne.variable} ${pacifico.variable} antialiased`}
      >
        <NextTopLoader color="#ff6b35" />
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}