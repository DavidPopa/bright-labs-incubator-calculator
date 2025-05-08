import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-gray-50 py-12 border-t border-gray-100">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <Link href="https://brightlabs.build/">
            <div className="text-xl font-bold text-black flex items-center mb-4 md:mb-0">
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
            </div>
          </Link>
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Bright Labs Incubator. All rights
            reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
