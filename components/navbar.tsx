"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Mic, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname === "/record") return null;

  return (
    <nav className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
            <Mic className="h-4 w-4 text-white" />
          </div>
          <span className="bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
            SpeakSmart
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <Link href="/pricing">
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
              Get Started
            </Button>
          </Link>
        </div>

        <button
          className="md:hidden p-2 rounded-md"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block text-sm font-medium py-2",
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/pricing" onClick={() => setMobileOpen(false)}>
            <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              Get Started
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
