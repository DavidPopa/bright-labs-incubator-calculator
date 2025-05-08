import { Cta } from "@/components/cta/Cta";
import { Header } from "@/components/header/Header";
import { Footer } from "@/components/footer/Footer";
import { Features } from "@/components/features/Features";

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

          <div className="flex items-center justify-center gap-4 mt-10">
            <a
              href="#calculator"
              className="bg-black hover:bg-slate-800 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              Calculate Savings
            </a>
            <a
              href="#"
              className="border border-gray-300 hover:border-gray-400 px-6 py-3 rounded-md font-medium transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>

        <div className="text-center mb-16">
          <div className="text-sm text-gray-500 mb-6">Trusted By</div>
          <div className="flex flex-wrap justify-center items-center gap-8 grayscale opacity-70">
            {/* <img src="/placeholder.svg?height=30&width=120" alt="TechVentures" className="h-8" />
            <img src="/placeholder.svg?height=30&width=120" alt="StartupBoost" className="h-8" />
            <img src="/placeholder.svg?height=30&width=120" alt="InnovateNow" className="h-8" />
            <img src="/placeholder.svg?height=30&width=120" alt="FutureFounders" className="h-8" /> */}
          </div>
        </div>

        <Features />
        <Cta />
        {/* <div id="calculator" className="max-w-5xl mx-auto">
          <Suspense fallback={<div className="h-[600px] w-full bg-gray-100 animate-pulse rounded-lg"></div>}>
            <CostCalculator />
          </Suspense>
        </div> */}
      </div>

      <Footer />
      {/*<Toaster /> */}
    </main>
  );
}
