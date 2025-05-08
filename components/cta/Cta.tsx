import Link from "next/link";
import { Button } from "../ui/button";

export const Cta = () => {
  return (
    <div className="mt-16 bg-black text-white p-8 rounded-xl shadow-sm text-center">
    <h3 className="text-2xl font-bold mb-2">
      Ready to Reduce Your Startup Costs?
    </h3>
    <p className="mb-6 text-white max-w-2xl mx-auto">
      Join Bright Labs and get free housing, free food, a monthly stipend,
      and much more.
    </p>
    <Link href="https://airtable.com/appx6Ioi7YDebB7mW/pagvQAXuSeUplrKYl/form">
      <Button className="bg-white text-black hover:bg-gray-300 text-lg px-8 py-6 h-auto cursor-pointer">
        Apply to Bright Labs
      </Button>
    </Link>
  </div>
  );
};