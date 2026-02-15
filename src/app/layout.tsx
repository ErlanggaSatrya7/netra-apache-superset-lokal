import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vortex Core | Adidas BI",
  description: "Enterprise Data Warehouse Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.className} selection:bg-primary/30 selection:text-primary antialiased`}
        suppressHydrationWarning
      >
        {children}
        <Toaster position="top-right" richColors theme="dark" />
      </body>
    </html>
  );
}
