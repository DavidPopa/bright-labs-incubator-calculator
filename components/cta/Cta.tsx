import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import all from "../../assets/Make-IT-0494-small.png.webp";

export const Cta = () => {
  return (
    <div className="mt-16 bg-black text-white p-12 rounded-2xl shadow-lg text-center max-w-7xl mx-auto mb-16">
      <Image
        src={all}
        alt="Bright Labs"
        className="rounded-lg mb-8 mx-auto"
        style={{ width: "90%" }}
        height={400}
      />
      <h3 className="text-3xl font-bold mb-4">
        Ready to Reduce Your Startup Costs?
      </h3>
      <p className="mb-8 text-white max-w-3xl mx-auto">
        Join Bright Labs and get free housing, free food, a monthly stipend,
        and much more.
      </p>
      <Link href="https://airtable.com/appx6Ioi7YDebB7mW/pagvQAXuSeUplrKYl/form">
        <Button className="bg-[#fff600] hover:bg-[#fff600] hover:text-black text-black text-lg px-10 py-3 h-auto cursor-pointer">
          Apply to Bright Labs
        </Button>
      </Link>
    </div>
  );
};