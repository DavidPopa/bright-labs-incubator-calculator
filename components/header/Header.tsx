"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import logo from "../../assets/logo.png";
import gif from "../../assets/fire_1f525.gif"
import { Button } from "@/components/ui/button";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-gray-100 bg-white py-4 sticky top-0 z-10">
      <div className="container max-w-6xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link
            href="https://brightlabs.build/"
            className="flex items-center gap-2"
          >
            <Image
              src={logo}
              alt="Startup Cost Calculator"
              width={24}
              height={24}
            />
            <p className="text-[22px] font-bold text-black">
              Startup Cost Calculator
            </p>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <p className="text-center text-sm text-gray-500 ">
            Reduce with <span className="font-bold">Bright Labs</span>
          </p>
          <Link href="https://airtable.com/appx6Ioi7YDebB7mW/pagvQAXuSeUplrKYl/form">
            <Button className="w-full cursor-pointer py-4 bg-[#fff600] hover:bg-[#fff600] hover:text-black text-black text-center">
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
          className="md:hidden cursor-pointer inline-flex items-center justify-center p-2 rounded-md text-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Image unoptimized src={gif} alt="Bright Labs" width={24} height={24} />
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
          <p className="text-center text-sm text-gray-500 ">
            Reduce with <span className="font-bold">Bright Labs</span>
          </p>
          <Link
            href="https://airtable.com/appx6Ioi7YDebB7mW/pagvQAXuSeUplrKYl/form"
            className="cursor-pointer"
          >
            <Button className="w-full cursor-pointer py-4 bg-[#fff600] hover:bg-[#fff600] hover:text-black text-black text-center">
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
