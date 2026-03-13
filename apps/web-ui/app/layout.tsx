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
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-zinc-950 text-zinc-50 antialiased flex min-h-screen`}
      >
        <Sidebar />

        {/* On mobile, sidebar is likely full-width top nav or hidden — 
            ml-0 on mobile, then offset by sidebar width on md+ */}
        <main className="flex-1 overflow-y-auto min-w-0 md:ml-0">
          {children}
        </main>
      </body>
    </html>
  );
}