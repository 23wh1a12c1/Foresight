import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.drmayareynolds.com"),
  title: "Dr. Maya Reynolds, PsyD | Therapy in Santa Monica & CA Telehealth",
  description:
    "Licensed Clinical Psychologist in Santa Monica, CA specializing in anxiety, panic, trauma recovery (EMDR), stress, and professional burnout for high-achieving adults.",
  keywords: [
    "Santa Monica therapist",
    "Psychologist Santa Monica CA",
    "Anxiety therapy Santa Monica",
    "EMDR therapist California",
    "Burnout counseling for professionals",
    "Dr Maya Reynolds PsyD",
    "Trauma therapy Santa Monica",
    "Telehealth psychologist California"
  ],
  authors: [{ name: "Dr. Maya Reynolds, PsyD" }],
  openGraph: {
    title: "Dr. Maya Reynolds, PsyD | Licensed Clinical Psychologist",
    description: "Grounded, evidence-based therapy for anxiety, burnout, trauma & perfectionism in Santa Monica & across California.",
    url: "https://www.drmayareynolds.com",
    siteName: "Dr. Maya Reynolds Psychology",
    images: [
      {
        url: "/images/dr_maya_reynolds.png",
        width: 1200,
        height: 630,
        alt: "Dr. Maya Reynolds, PsyD - Licensed Clinical Psychologist",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr. Maya Reynolds, PsyD | Santa Monica Psychologist",
    description: "Holistic, evidence-based therapy for anxiety, trauma & burnout.",
    images: ["/images/dr_maya_reynolds.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "Dr. Maya Reynolds Psychology",
    "image": "https://www.drmayareynolds.com/images/dr_maya_reynolds.png",
    "telephone": "+1-310-555-0192",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123th Street 45 W",
      "addressLocality": "Santa Monica",
      "addressRegion": "CA",
      "postalCode": "90401",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 34.0195,
      "longitude": -118.4912
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "medicalSpecialty": "Psychiatric Services",
    "priceRange": "$$$"
  };

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jakarta.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF7F2] text-[#1C2B26] selection:bg-[#C87D55]/20 selection:text-[#234237]">
        {children}
      </body>
    </html>
  );
}

