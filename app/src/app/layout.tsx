import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/lib/cart-context";
import { OrderProvider } from "@/lib/order-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "e-motion | e-Bike Webshop",
  description:
    "Europas größtes Netzwerk unabhängiger e-Bike Experten. Entdecke e-Bikes, buche Probefahrten und finde deinen Store.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <CartProvider>
          <OrderProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </OrderProvider>
        </CartProvider>
      </body>
    </html>
  );
}
