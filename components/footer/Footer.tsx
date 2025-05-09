import Link from "next/link";
import Image from "next/image";
import logo from "../../assets/logo.png";

export const Footer = () => {
  return (
    <footer className="bg-gray-50 py-12 border-t border-gray-100">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center">
            <Link
              href="https://brightlabs.build/"
              className="flex items-center gap-2"
            >
              <Image src={logo} alt="Startup Cost Calculator" width={24} height={24} />
              <p className="text-[22px] font-bold text-black">Startup Cost Calculator</p>
            </Link>
          </div>
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Bright Labs Incubator. All rights
            reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
