import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// SEO Metadata
export const metadata: Metadata = {
  title: {
    default: "Display Manager - Digital Signage Platform",
    template: "%s | Display Manager",
  },
  description:
    "Create and manage digital display screens for masjids, hospitals, restaurants, and corporate businesses. Easy-to-use digital signage platform.",
  keywords: [
    "digital signage",
    "display screens",
    "masjid prayer times",
    "hospital waiting screens",
    "restaurant menu boards",
    "corporate displays",
    "digital display manager",
    "signage software",
    "screen management",
    "content management system",
  ],
  authors: [{ name: "Safnas Kaldeen" }],
  creator: "Safnas Kaldeen",
  publisher: "Dr.Mahboob ",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://digital-display-system.vercel.app"), // Replace with your actual domain
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
      ta: "/ta",
    },
  },
  openGraph: {
    type: "website",
    locale: "lk_en",
    url: "https://digital-display-system.vercel.app",
    title: "Display Manager - Digital Signage Platform",
    description:
      "Create and manage digital display screens for various business needs",
    siteName: "Display Manager",
    images: [
      {
        url: "/og-image.png", // Create this image
        width: 1200,
        height: 630,
        alt: "Display Manager - Digital Signage Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Display Manager - Digital Signage Platform",
    description:
      "Create and manage digital display screens for various business needs",
    images: ["/twitter-image.png"], // Create this image
    creator: "@displaymanager",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here
    // google: "google-site-verification-code",
    // yandex: "yandex-verification-code",
    // yahoo: "yahoo-verification-code",
  },
  category: "technology",
};

// Viewport settings for mobile optimization
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // Allow zooming for accessibility
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
  ],
  colorScheme: "dark",
};

// Structured data for rich results
const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Display Manager",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Digital signage platform for creating and managing display screens",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "LKR",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "150",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-US"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
      itemScope
      itemType="https://schema.org/WebApplication"
    >
      <head>
        {/* Preconnect to important domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Favicon links */}
        <link rel="icon" href="/icon-dark.png" sizes="any" />
        <link rel="icon" href="/icon-dark.png" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <link rel="manifest" href="/manifest.json" />

        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* Additional meta tags */}
        <meta name="application-name" content="Display Manager" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Display Manager" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* PWA theme color */}
        <meta
          name="theme-color"
          content="#030712"
          media="(prefers-color-scheme: dark)"
        />
        <meta
          name="theme-color"
          content="#ffffff"
          media="(prefers-color-scheme: light)"
        />
      </head>
      <body
        className="bg-gray-950 text-gray-50 antialiased"
        suppressHydrationWarning
        itemScope
        itemProp="mainEntity"
        itemType="https://schema.org/SoftwareApplication"
      >
        <ThemeProvider>
          <div className="flex">
            <main className="flex-1" itemScope itemProp="mainContentOfPage">
              {children}
            </main>
          </div>
        </ThemeProvider>

        {/* Performance optimizations */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Service Worker registration (optional)
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('ServiceWorker registration successful');
                    },
                    function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
              
              // Performance measurement
              if (typeof window !== 'undefined' && 'performance' in window) {
                window.addEventListener('load', function() {
                  setTimeout(function() {
                    const perfEntries = performance.getEntriesByType('navigation');
                    if (perfEntries.length > 0) {
                      const navEntry = perfEntries[0];
                      console.log('Page load time:', navEntry.loadEventEnd - navEntry.startTime);
                    }
                  }, 0);
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
