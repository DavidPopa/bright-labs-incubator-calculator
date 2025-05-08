"use client";

import Link from "next/link";
import { useState } from "react";
import { MenuIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-gray-100 bg-white py-4 sticky top-0 z-10">
      <div className="container max-w-6xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link
            href="https://brightlabs.build/"
            className="text-xl font-bold text-black flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 mr-2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            Bright Labs
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Link href="https://airtable.com/appx6Ioi7YDebB7mW/pagvQAXuSeUplrKYl/form">
            <Button className="bg-black cursor-pointer hover:bg-slate-800">
              Apply Now
            </Button>
          </Link>
          <Link href="https://brightlabs.build/ask-me-anything/">
            <Button className="bg-black cursor-pointer hover:bg-slate-800">
              Book a Call
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <XIcon className="h-6 w-6" aria-hidden="true" />
          ) : (
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden bg-white border-t border-gray-100 transition-all duration-500 ease-in-out ${
          mobileMenuOpen
            ? "max-h-[300px] opacity-100 py-2"
            : "max-h-0 opacity-0 py-0"
        }`}
      >
        <div className="container mx-auto px-4 space-y-2 flex flex-col">
          <Link
            href="https://airtable.com/appx6Ioi7YDebB7mW/pagvQAXuSeUplrKYl/form"
            className="cursor-pointer"
          >
            <Button className="w-full py-4 bg-black hover:bg-slate-800 text-center">
              Apply Now
            </Button>
          </Link>

          <Link
            href="https://brightlabs.build/ask-me-anything/"
            className="cursor-pointer"
          >
            <Button className="w-full py-4 bg-black hover:bg-slate-800 text-center">
              Book a Call
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
