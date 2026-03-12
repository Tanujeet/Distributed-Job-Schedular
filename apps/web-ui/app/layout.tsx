import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CronSync | Distributed Scheduler",
  description: "Modern distributed cron job scheduler dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 'dark' class defaults the whole app to dark mode
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-zinc-950 text-zinc-50 antialiased flex min-h-screen`}
      >
        {/* Fixed Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </body>
    </html>
  );
}
