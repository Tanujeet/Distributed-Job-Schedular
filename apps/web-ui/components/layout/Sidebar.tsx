"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TerminalSquare,
  Server,
 
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "All Jobs", href: "/jobs", icon: TerminalSquare },
  { name: "Workers", href: "/workers", icon: Server },

];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 border-r border-zinc-800 bg-zinc-950/50 min-h-screen p-4">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="bg-emerald-500 p-1.5 rounded-md">
          <Activity className="w-5 h-5 text-zinc-950" />
        </div>
        <span className="text-xl font-bold text-zinc-100 tracking-tight">
          CronSync
        </span>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-zinc-800/80 text-zinc-100"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40",
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4",
                    isActive ? "text-emerald-500" : "text-zinc-500",
                  )}
                />
                {item.name}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-2 pb-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
            HS
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-zinc-200">
              System Admin
            </span>
            <span className="text-xs text-zinc-500">Pro Plan</span>
          </div>
        </div>
      </div>
    </div>
  );
}
