import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.FRONTEND_URL ?? "http://localhost:3000";
const title = "E-Commerce";
const description =
  "A modern storefront powered by Spring Boot microservices and Next.js.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | E-Commerce",
  },
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images: [
      {
        url: "/og.png",
        alt: "E-Commerce — Great finds. Simple checkout.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
};

export default RootLayout;
