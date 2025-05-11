import { useState } from "react";
import { Calc } from "./_components/Calc";
import { Maps } from "./_components/Maps";
import { EuroIcon, MapPinIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const CostCalculator = () => {
  const [activeTab, setActiveTab] = useState<string>("calculator");

  return (
    <div className="space-y-16 max-w-7xl mx-auto p-4 md:p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Startup Cost Calculator</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Enter your monthly burn rate and team size to calculate your startup
          costs and potential savings with Bright Labs.
        </p>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 max-w-md mx-auto">
          <TabsTrigger
            value="calculator"
            className="cursor-pointer flex items-center gap-2 transition-transform transform hover:scale-105"
          >
            <EuroIcon className="h-4 w-4" />
            <span>Calculator</span>
          </TabsTrigger>
          <TabsTrigger
            value="map"
            className="cursor-pointer flex items-center gap-2 transition-transform transform hover:scale-105"
          >
            <MapPinIcon className="h-4 w-4" />
            <span>Map View</span>
          </TabsTrigger>
        </TabsList>

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="border-0 p-0">
          <Calc />
        </TabsContent>

        {/* Map Tab */}
        <TabsContent value="map" className="border-0 p-0">
          <Maps />
        </TabsContent>
      </Tabs>
    </div>
  );
};
