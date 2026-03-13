"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TerminalSquare,
  Server,
  Activity,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "All Jobs", href: "/jobs", icon: TerminalSquare },
  { name: "Workers", href: "/workers", icon: Server },
];

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link key={item.name} href={item.href} onClick={onNavigate}>
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
                  "w-4 h-4 shrink-0",
                  isActive ? "text-emerald-500" : "text-zinc-500",
                )}
              />
              {item.name}
            </div>
          </Link>
        );
      })}
    </>
  );
}

function UserCard() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400 shrink-0">
        HS
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium text-zinc-200 truncate">
          System Admin
        </span>
        <span className="text-xs text-zinc-500">Pro Plan</span>
      </div>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <div className="hidden md:flex flex-col w-64 border-r border-zinc-800 bg-zinc-950/50 min-h-screen p-4 shrink-0">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="bg-emerald-500 p-1.5 rounded-md">
            <Activity className="w-5 h-5 text-zinc-950" />
          </div>
          <span className="text-xl font-bold text-zinc-100 tracking-tight">
            CronSync
          </span>
        </div>

        <nav className="flex flex-col gap-1">
          <NavLinks pathname={pathname} />
        </nav>

        <div className="mt-auto px-2 pb-4">
          <UserCard />
        </div>
      </div>

      {/* ── Mobile top bar ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500 p-1 rounded-md">
            <Activity className="w-4 h-4 text-zinc-950" />
          </div>
          <span className="text-lg font-bold text-zinc-100 tracking-tight">
            CronSync
          </span>
        </div>

        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="p-2 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer panel */}
          <div className="md:hidden fixed top-14 left-0 bottom-0 z-40 w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col p-4">
            <nav className="flex flex-col gap-1">
              <NavLinks
                pathname={pathname}
                onNavigate={() => setMobileOpen(false)}
              />
            </nav>

            <div className="mt-auto px-2 pb-4">
              <UserCard />
            </div>
          </div>
        </>
      )}

      {/* ── Mobile top-bar spacer ── */}
      {/* Pushes page content below the fixed top bar on mobile */}
      <div className="md:hidden h-14 shrink-0" />
    </>
  );
}