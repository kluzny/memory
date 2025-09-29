import type { Metadata } from "next";
import "animate.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Memory!",
  description: "A fun game about concentration!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-sky-300">
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
