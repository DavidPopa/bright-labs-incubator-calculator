import { BuildingIcon, UserIcon, RocketIcon } from "lucide-react";

export const Features = () => {
  return (
    <div className="max-w-7xl mx-auto mt-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">What We Offer</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Join Bright Labs and focus on building your product, not worrying
          about expenses.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-transform transform hover:scale-105">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
            <BuildingIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2">Free Housing and Meals</h3>
          <p className="text-gray-600">
            Comfortable accommodations in the heart of the city, saving you
            thousands in rent every month.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-transform transform hover:scale-105">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
            <UserIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2">Stipend 2000€ grant</h3>
          <p className="text-gray-600">
            Provides financial support to cover additional living expenses or to
            invest in your project development.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-transform transform hover:scale-105">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
            <RocketIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2">
            Pitch in front of inverstors
          </h3>
          <p className="text-gray-600">
            In 100 days you will have the opportunity to pitch your startup and
            raise your first funding round
          </p>
        </div>
      </div>
    </div>
  );
};
