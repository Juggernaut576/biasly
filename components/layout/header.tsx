"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

export function Header() {
  return (
    <header className="sticky top-0 z-50 overflow-x-hidden">
      {/* ── Top utility bar ── */}
      <div className="bg-[var(--text-primary)] text-white overflow-hidden">
        <div className="max-w-[var(--container-max)] mx-auto px-4 sm:px-6 flex items-center justify-between h-8 text-[11px] min-w-0">
          <div className="hidden sm:flex items-center gap-6 min-w-0 shrink">
            <Link href="#" className="hover:underline opacity-80 hover:opacity-100 transition-opacity whitespace-nowrap">
              Browser Extension
            </Link>
            <div className="flex items-center gap-1.5 opacity-80">
              <span>Theme:</span>
              <button className="font-medium opacity-70 hover:opacity-100 cursor-pointer">Light</button>
              <button className="font-semibold opacity-100 cursor-pointer underline underline-offset-2">Dark</button>
              <button className="font-medium opacity-70 hover:opacity-100 cursor-pointer">Auto</button>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-6 min-w-0 shrink overflow-hidden w-full sm:w-auto justify-between sm:justify-end">
            <span className="opacity-80 whitespace-nowrap text-[10px] sm:text-[11px]">Monday, June 1, 2026</span>
            <button className="hidden sm:inline hover:underline opacity-80 hover:opacity-100 cursor-pointer whitespace-nowrap">
              Set Location
            </button>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-white/60 shrink-0" />
              <span className="font-medium text-[10px] sm:text-[11px]">International Edition</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main navbar ── */}
      <nav className="bg-white border-b border-[var(--border-color)] overflow-hidden">
        <div className="max-w-[var(--container-max)] mx-auto px-4 sm:px-6 flex items-center justify-between h-14 min-w-0">
          {/* Left: hamburger + logo */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button className="p-1 hover:bg-[var(--bg-secondary)] rounded-[var(--radius-sm)] transition-colors cursor-pointer" aria-label="Menu">
              <Menu size={22} strokeWidth={2} className="text-[var(--text-primary)]" />
            </button>
            <Link href="/" className="flex items-baseline gap-0.5">
              <span className="text-[20px] sm:text-[22px] font-bold tracking-[-0.02em] text-[var(--text-primary)] leading-none">
                biasly
              </span>
              <span className="text-[11px] font-medium text-[var(--text-secondary)] ml-1">
                News
              </span>
            </Link>
          </div>

          {/* Center: nav links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-[14px] font-medium text-[var(--text-primary)] hover:text-[var(--text-secondary)] transition-colors">
              Home
            </Link>
            <Link href="#" className="text-[14px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              For You
            </Link>
            <Link href="#" className="text-[14px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Local
            </Link>
            <Link href="#" className="text-[14px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Blindspot
            </Link>
          </div>

          {/* Right: CTA buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="primary" className="!text-[12px] sm:!text-[13px] !px-3 sm:!px-4 !py-1.5 sm:!py-2 h-auto">
              Subscribe
            </Button>
            
            <Show
              when="signed-in"
              fallback={
                <SignInButton mode="modal">
                  <Button variant="outline" className="!text-[12px] sm:!text-[13px] !px-3 sm:!px-4 !py-1.5 sm:!py-2 h-auto cursor-pointer">
                    Login
                  </Button>
                </SignInButton>
              }
            >
              <UserButton />
            </Show>
          </div>
        </div>
      </nav>
    </header>
  );
}
