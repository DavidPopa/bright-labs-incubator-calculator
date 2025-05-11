"use client";

import Link from "next/link";
import { Suspense } from "react";
import { Cta } from "@/components/cta/Cta";
import { Header } from "@/components/header/Header";
import { Footer } from "@/components/footer/Footer";
import { Features } from "@/components/features/Features";
import { CostCalculator } from "@/components/calculator/Calculator";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Header />

      <div className="flex-1 py-24 px-4">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <div className="mb-2 text-black font-medium">
            Proudly Helping Founders
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            A better way to launch
            <br />
            your startup.
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Compare your startup costs across European cities and see how much
            you could save with Bright Labs incubator program.
          </p>

          <div className="text-center mt-10">
            <div className="font-bold mb-4">Best cities to build your startup in 2025</div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div
                className="transition-transform transform hover:scale-105 border border-gray-300 hover:border-gray-400 px-6 py-3 rounded-md font-medium"
              >
                🤩 Talinn - Major Hub
              </div>
              <Link
                href="https://brightlabs.build/"
                className="transition-transform transform hover:scale-105 bg-[#fff600] hover:bg-[#fff600] hover:text-black text-black border border-[#fff600] px-6 py-3 rounded-md font-medium"
              >
                💎 Oradea - Hidden Gem
              </Link>
              <div
                className="transition-transform transform hover:scale-105 border border-gray-300 hover:border-gray-400 px-6 py-3 rounded-md font-medium"
              >
                🚀 Prague - Emerging Hub
              </div>
            </div>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="h-[600px] w-full animate-pulse rounded-lg"></div>
          }
        >
          <CostCalculator />
        </Suspense>
        <Features />
        <Cta />
      </div>

      <Footer />
    </main>
  );
}
