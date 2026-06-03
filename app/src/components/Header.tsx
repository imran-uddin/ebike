"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";

const navItems = [
  { label: "e-Bikes", href: "/bikes" },
  { label: "Lastenräder", href: "/bikes?category=cargo" },
  { label: "% SALE", href: "/bikes?sale=true" },
  { label: "Händler finden", href: "/stores" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">e</span>
            </div>
            <span className="font-semibold text-gray-900 text-lg">
              e-motion
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/account"
              className="hidden md:flex items-center text-sm text-gray-600 hover:text-teal-600 transition-colors"
              title="Mein e-motion"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            <Link
              href="/cart"
              className="relative flex items-center text-gray-600 hover:text-teal-600 transition-colors"
              title="Warenkorb"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-teal-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            <Link
              href="/bikes"
              className="hidden md:inline-flex text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-lg transition-colors"
            >
              Jetzt entdecken
            </Link>

            <button
              className="md:hidden p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menü"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <nav className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-sm font-medium text-gray-700"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/cart"
              className="block text-sm font-medium text-gray-700"
              onClick={() => setMobileOpen(false)}
            >
              Warenkorb {itemCount > 0 && `(${itemCount})`}
            </Link>
            <Link
              href="/account"
              className="block text-sm font-medium text-gray-700"
              onClick={() => setMobileOpen(false)}
            >
              Mein e-motion
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
