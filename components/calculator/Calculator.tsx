import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

import {
  EuroIcon,
  InfoIcon,
  PlusIcon,
  MinusIcon,
  UsersIcon,
  RocketIcon,
  MapPinIcon,
  CalendarIcon,
  BuildingIcon,
} from "lucide-react";
import {
  cities,
  startupTypes,
  cityProfiles,
  founderPersonas,
  brightLabsBenefits,
} from "@/helpers/data";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Popup, Marker, useMap, TileLayer } from "react-leaflet";
import { City, FounderPersona, MapComponentProps } from "@/types/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

const DynamicMapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          height: "500px",
          background: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading Map...
      </div>
    ),
  }
);

const MapComponent = ({ selectedCity, setSelectedCity }: MapComponentProps) => {
  const map = useMap();
  console.log(setSelectedCity);
  useEffect(() => {
    if (selectedCity) {
      map.setView(selectedCity.position, 6);
    } else {
      map.setView([50.0755, 10.4378], 4);
    }
  }, [selectedCity, map]);

  return null;
};

export const CostCalculator = () => {
  const [teamSize, setTeamSize] = useState<number>(2);
  const [burnRate, setBurnRate] = useState<number>(2500);
  const [timeframe, setTimeframe] = useState<number>(12);
  const [additionalExpenses, setAdditionalExpenses] = useState<number>(1000);

  const [activeTab, setActiveTab] = useState<string>("calculator");
  const [isRemoteTeam, setIsRemoteTeam] = useState<boolean>(false);

  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [selectedStartupType, setSelectedStartupType] = useState<string | null>(
    null
  );
  const [selectedCityProfile, setSelectedCityProfile] = useState<string | null>(
    null
  );

  const [leafletCustomIcon, setLeafletCustomIcon] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("leaflet")
        .then((L) => {
          setLeafletCustomIcon(
            new L.Icon({
              iconUrl:
                "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
              iconRetinaUrl:
                "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
              shadowUrl:
                "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41],
            })
          );
        })
        .catch((error) => {
          console.error("Error loading Leaflet or creating icon:", error);
        });
    }
  }, []);

  const findCityById = (id: string): City | undefined => {
    return cities.find((city) => city.id === id);
  };

  const handleCitySelect = (cityId: string) => {
    const city = findCityById(cityId);
    if (city) {
      setSelectedCity(city);
    }
  };

  const handleMapCitySelect = (city: City) => {
    setSelectedCity(city);
    // Optionally, also update the dropdown if you have one that reflects the map selection
    // And switch tab to calculator to see details if desired:
    // setActiveTab("calculator");
    console.log(`Selected city from map: ${city.name}, ${city.country}`);
  };

  const adjustCostsForProfileAndType = (baseCost: number): number => {
    let adjustedCost = baseCost;

    if (selectedCityProfile) {
      const profile = cityProfiles.find((p) => p.id === selectedCityProfile);
      if (profile) {
        if (profile.id === "major") {
          adjustedCost *= 1.1;
        }
      }
    }

    if (selectedStartupType) {
      const type = startupTypes.find((t) => t.id === selectedStartupType);
      if (type) {
        switch (type.id) {
          case "saas":
            adjustedCost *= 0.95;
            break;
          case "robotics":
            adjustedCost *= 1.2;
            break;
          case "fintech":
            adjustedCost *= 1.1;
            break;
          case "hardware":
            adjustedCost *= 1.3;
            break;
          case "ai":
            adjustedCost *= 1.15;
            break;
          case "mobile":
            adjustedCost *= 1.05;
            break;
          default:
            break;
        }
      }
    }
    return adjustedCost;
  };

  const calculateMonthlyCosts = (city: City | null): number => {
    if (!city) return 0;
    const { rent, food, utilities, coworking, transport, other } =
      city.monthlyCosts;
    let baseCost = rent + food + utilities + coworking + transport + other;

    if (isRemoteTeam) {
      baseCost =
        rent * 0.7 +
        food +
        utilities +
        coworking * 0.5 +
        transport * 0.5 +
        other;
    }
    return adjustCostsForProfileAndType(baseCost);
  };

  const calculateTotalMonthlyCost = (city: City | null): number => {
    if (!city) return 0;
    return (
      burnRate + calculateMonthlyCosts(city) * teamSize + additionalExpenses
    );
  };

  const calculateTimeframeCost = (city: City | null): number => {
    return calculateTotalMonthlyCost(city) * timeframe;
  };

  const calculateBrightLabsMonthlyCost = (city: City | null): number => {
    if (!city) return 0;
    const { utilities, transport, other } = city.monthlyCosts;
    const remainingLivingCostsPerPerson = utilities + transport + other;
    const monthlyCost =
      burnRate +
      remainingLivingCostsPerPerson * teamSize +
      additionalExpenses -
      brightLabsBenefits.stipend * teamSize;
    return monthlyCost;
  };

  const calculateBrightLabsTimeframeCost = (city: City | null): number => {
    return calculateBrightLabsMonthlyCost(city) * timeframe;
  };

  const calculateTimeframeSavings = (city: City | null): number => {
    if (!city) return 0;
    return (
      calculateTimeframeCost(city) - calculateBrightLabsTimeframeCost(city)
    );
  };

  const calculateSavingsPercentage = (city: City | null): number => {
    if (!city) return 0;
    const timeframeCost = calculateTimeframeCost(city);
    if (timeframeCost === 0) return 0;
    const savings = calculateTimeframeSavings(city);
    return Math.round((savings / timeframeCost) * 100);
  };

  const calculateRunwayExtension = (city: City | null): string | number => {
    if (!city) return 0;
    const monthlyCost = calculateTotalMonthlyCost(city);
    const brightLabsMonthlyCost = calculateBrightLabsMonthlyCost(city);

    if (brightLabsMonthlyCost <= 0) return "∞";
    if (monthlyCost === 0 && brightLabsMonthlyCost > 0) return 0;
    if (monthlyCost <= brightLabsMonthlyCost) return 0;

    const extension = Math.round(
      (monthlyCost / brightLabsMonthlyCost - 1) * timeframe
    );
    return extension > 0 ? extension : 0;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-EU", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const applyPersona = (persona: FounderPersona) => {
    setSelectedPersona(persona.id);
    setTeamSize(persona.defaults.teamSize);
    setBurnRate(persona.defaults.burnRate);
    setAdditionalExpenses(persona.defaults.additionalExpenses);
    setIsRemoteTeam(persona.defaults.isRemoteTeam);
    setTimeframe(persona.defaults.timeframe);
  };

  const handleStartupTypeSelect = (typeId: string) => {
    setSelectedStartupType(typeId);
  };

  const handleCityProfileSelect = (profileId: string) => {
    setSelectedCityProfile(profileId);
  };

  const getCityMonthlyCosts = (cityId: string | null): number => {
    const city = cities.find((c) => c.id === cityId);
    if (!city) return 0;
    const { rent, food, coworking } = city.monthlyCosts;
    return rent + food + coworking;
  };

  return (
    <div className="space-y-16 max-w-7xl mx-auto p-4 md:p-8">
      {" "}
      {/* Added padding */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Startup Cost Calculator</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Enter your monthly burn rate and team size to calculate your startup
          costs and potential savings with Bright Labs.
        </p>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 max-w-md mx-auto">
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <EuroIcon className="h-4 w-4" />
            <span>Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2">
            <MapPinIcon className="h-4 w-4" />
            <span>Map View</span>
          </TabsTrigger>
        </TabsList>

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="border-0 p-0">
          <Card className="border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6 space-y-8">
                {/* Founder Personas */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <h3 className="text-lg font-bold mb-4">
                    Choose Your Founder Profile
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {founderPersonas.map((persona) => (
                      <div
                        key={persona.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                          selectedPersona === persona.id
                            ? "border-black bg-white dark:bg-black dark:border-white"
                            : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                        onClick={() => applyPersona(persona)}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className={`p-2 rounded-full ${
                              selectedPersona === persona.id
                                ? "bg-black text-white"
                                : "bg-gray-100 dark:bg-gray-700"
                            }`}
                          >
                            {persona.icon}
                          </div>
                          <h4 className="font-medium">{persona.name}</h4>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {persona.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Startup Type & City Profile Section */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <h3 className="text-lg font-bold mb-6">
                    Customize Your Startup Journey
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Startup Type Selection */}
                    <div>
                      <h4 className="font-medium mb-4 flex items-center gap-2">
                        <RocketIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                        Choose Your Startup Type
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {startupTypes.map((type) => (
                          <div
                            key={type.id}
                            className={`border rounded-lg p-3 cursor-pointer transition-all hover:shadow-sm ${
                              selectedStartupType === type.id
                                ? "border-black bg-white dark:bg-black dark:border-white"
                                : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                            onClick={() => handleStartupTypeSelect(type.id)}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`p-1.5 rounded-full ${
                                  selectedStartupType === type.id
                                    ? "bg-black text-white"
                                    : "bg-gray-100 dark:bg-gray-700"
                                }`}
                              >
                                {type.icon}
                              </div>
                              <div>
                                <h5 className="font-medium text-sm">
                                  {type.name}
                                </h5>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {type.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* City Profile Selection */}
                    <div>
                      <h4 className="font-medium mb-4 flex items-center gap-2">
                        <BuildingIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                        Choose Your Ideal City Profile
                      </h4>
                      <div className="space-y-3">
                        {cityProfiles.map((profile) => (
                          <div
                            key={profile.id}
                            className={`border rounded-lg p-3 cursor-pointer transition-all hover:shadow-sm ${
                              selectedCityProfile === profile.id
                                ? "border-black bg-white dark:bg-black dark:border-white"
                                : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                            onClick={() => handleCityProfileSelect(profile.id)}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-2 rounded-full ${
                                  selectedCityProfile === profile.id
                                    ? "bg-black text-white"
                                    : "bg-gray-100 dark:bg-gray-700"
                                }`}
                              >
                                {profile.icon}
                              </div>
                              <div className="flex-1">
                                <h5 className="font-medium">{profile.name}</h5>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {profile.description}
                                </p>
                              </div>
                            </div>

                            {selectedCityProfile === profile.id && (
                              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                <div>
                                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                                    Pros:
                                  </span>
                                  <ul className="mt-1 space-y-1">
                                    {profile.pros.map((pro, i) => (
                                      <li
                                        key={`pro-${i}`}
                                        className="text-xs text-gray-600 dark:text-gray-400 flex items-start"
                                      >
                                        <span className="text-black mr-1">
                                          ✓
                                        </span>{" "}
                                        {pro}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                                    Cons:
                                  </span>
                                  <ul className="mt-1 space-y-1">
                                    {profile.cons.map((con, i) => (
                                      <li
                                        key={`con-${i}`}
                                        className="text-xs text-gray-600 dark:text-gray-400 flex items-start"
                                      >
                                        <span className="text-gray-400 dark:text-gray-500 mr-1">
                                          •
                                        </span>{" "}
                                        {con}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Input Section */}
                  <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-bold mb-4">Your Setup</h3>
                    <div className="space-y-2">
                      <Label
                        htmlFor="city-select"
                        className="text-sm font-medium"
                      >
                        Select City
                      </Label>
                      <Select
                        onValueChange={handleCitySelect}
                        value={selectedCity?.id || ""}
                      >
                        <SelectTrigger id="city-select">
                          <SelectValue placeholder="Choose a city" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city.id} value={city.id}>
                              {city.name}, {city.country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="burn-rate"
                        className="text-sm font-medium flex items-center"
                      >
                        Monthly Burn Rate (€)
                        <InfoIcon className="h-4 w-4 ml-1 inline-block text-gray-400" />
                      </Label>
                      <Input
                        id="burn-rate"
                        type="number"
                        value={burnRate}
                        onChange={(e) =>
                          setBurnRate(Math.max(0, Number(e.target.value)))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="team-size"
                        className="text-sm font-medium"
                      >
                        Team Size
                      </Label>
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const minSize =
                              selectedPersona === "solo"
                                ? 1
                                : selectedPersona === "ambitious"
                                ? 2
                                : 1;
                            setTeamSize(Math.max(minSize, teamSize - 1));
                          }}
                          disabled={
                            (selectedPersona === "solo" && teamSize <= 1) ||
                            (selectedPersona === "ambitious" &&
                              teamSize <= 2) ||
                            teamSize <= 1
                          }
                        >
                          <MinusIcon className="h-4 w-4" />
                        </Button>
                        <div className="flex-1 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <UsersIcon className="h-5 w-5 text-gray-500" />
                            <span className="font-medium">
                              {teamSize} {teamSize === 1 ? "person" : "people"}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const maxSize =
                              selectedPersona === "ambitious" ? 3 : Infinity;
                            if (selectedPersona === "solo") {
                              setTeamSize(1);
                            } else {
                              setTeamSize(Math.min(maxSize, teamSize + 1));
                            }
                          }}
                          disabled={
                            (selectedPersona === "solo" && teamSize >= 1) ||
                            (selectedPersona === "ambitious" && teamSize >= 3)
                          }
                        >
                          <PlusIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="additional-expenses"
                        className="text-sm font-medium flex items-center"
                      >
                        Additional Monthly Expenses (€)
                        <InfoIcon className="h-4 w-4 ml-1 inline-block text-gray-400" />
                      </Label>
                      <Input
                        id="additional-expenses"
                        type="number"
                        value={additionalExpenses}
                        onChange={(e) =>
                          setAdditionalExpenses(
                            Math.max(0, Number(e.target.value))
                          )
                        }
                      />
                    </div>
                    <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <UsersIcon className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Remote Team</span>
                        </div>
                        <Switch
                          checked={isRemoteTeam}
                          onCheckedChange={setIsRemoteTeam}
                          aria-label="Toggle remote team"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Timeframe</span>
                        </div>
                        <Select
                          value={timeframe.toString()}
                          onValueChange={(value) =>
                            setTimeframe(Number.parseInt(value))
                          }
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="6">6 months</SelectItem>
                            <SelectItem value="12">12 months</SelectItem>
                            <SelectItem value="18">18 months</SelectItem>
                            <SelectItem value="24">24 months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Results Section */}
                  <div className="space-y-6">
                    {selectedCity ? (
                      <>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                          <h4 className="font-medium text-lg mb-2">
                            {selectedCity.name}, {selectedCity.country}
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Startup Friendliness
                              </p>
                              <div className="flex items-center mt-1">
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                  <div
                                    className="bg-black h-2.5 rounded-full"
                                    style={{
                                      width: `${selectedCity.startupFriendliness}%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="ml-2 text-sm font-medium">
                                  {selectedCity.startupFriendliness}/100
                                </span>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Monthly Living Costs
                              </p>
                              <p className="font-medium">
                                {formatCurrency(
                                  calculateMonthlyCosts(selectedCity)
                                )}
                                /person
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <h4 className="font-medium text-gray-500 dark:text-gray-400 mb-2">
                              Without Bright Labs
                            </h4>
                            <p className="text-2xl font-bold">
                              {formatCurrency(
                                calculateTimeframeCost(selectedCity)
                              )}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              for {timeframe} months
                            </p>
                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">
                                  Monthly Burn Rate
                                </span>
                                <span>{formatCurrency(burnRate)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">
                                  Living Costs ({teamSize}x)
                                </span>
                                <span>
                                  {formatCurrency(
                                    calculateMonthlyCosts(selectedCity) *
                                      teamSize
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">
                                  Additional Expenses
                                </span>
                                <span>
                                  {formatCurrency(additionalExpenses)}
                                </span>
                              </div>
                              <div className="flex justify-between font-medium mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                                <span>Monthly Total</span>
                                <span>
                                  {formatCurrency(
                                    calculateTotalMonthlyCost(selectedCity)
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="bg-black text-white rounded-lg p-4">
                            <h4 className="font-medium text-white mb-2">
                              With Bright Labs
                            </h4>
                            <p className="text-2xl font-bold">
                              {formatCurrency(
                                calculateBrightLabsTimeframeCost(selectedCity)
                              )}
                            </p>
                            <p className="text-sm text-white">
                              for {timeframe} months
                            </p>
                            <div className="mt-4 pt-4 border-t border-white space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-white">
                                  Monthly Burn Rate
                                </span>
                                <span>{formatCurrency(burnRate)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-white">
                                  Covered Living Costs ({teamSize}x)
                                </span>
                                <span className="line-through">
                                  {formatCurrency(
                                    getCityMonthlyCosts(selectedCity?.id)
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-white">
                                  Remaining Living Costs ({teamSize}x)
                                </span>
                                <span>
                                  {formatCurrency(
                                    (selectedCity.monthlyCosts.utilities +
                                      selectedCity.monthlyCosts.transport +
                                      selectedCity.monthlyCosts.other) *
                                      teamSize
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-white">
                                  Additional Expenses
                                </span>
                                <span>
                                  {formatCurrency(additionalExpenses)}
                                </span>
                              </div>
                              <div className="flex justify-between text-white">
                                <span>Stipend ({teamSize}x)</span>
                                <span>
                                  -
                                  {formatCurrency(
                                    brightLabsBenefits.stipend * teamSize
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between font-medium mt-2 pt-2 border-t border-white">
                                <span>Monthly Total</span>
                                <span>
                                  {formatCurrency(
                                    calculateBrightLabsMonthlyCost(selectedCity)
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-black border border-black rounded-lg p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="text-center">
                              <h3 className="text-xl font-bold text-black dark:text-white mb-2">
                                Your Total Savings
                              </h3>
                              <p className="text-3xl font-bold text-black dark:text-white">
                                {formatCurrency(
                                  calculateTimeframeSavings(selectedCity)
                                )}
                              </p>
                              <p className="text-black dark:text-white mt-1">
                                That's a{" "}
                                {calculateSavingsPercentage(selectedCity)}%
                                reduction in costs!
                              </p>
                            </div>
                            <div className="text-center">
                              <h3 className="text-xl font-bold text-black dark:text-white mb-2">
                                Runway Extension
                              </h3>
                              <p className="text-3xl font-bold text-black dark:text-white">
                                +{calculateRunwayExtension(selectedCity)} months
                              </p>
                              <p className="text-black dark:text-white mt-1">
                                Stretch your funding{" "}
                                {calculateRunwayExtension(selectedCity) === "∞"
                                  ? "indefinitely"
                                  : `by ${calculateRunwayExtension(
                                      selectedCity
                                    )} months`}
                                !
                              </p>
                            </div>
                          </div>
                          <div className="mt-6 pt-4 border-t border-white dark:border-black text-center">
                            <p className="text-gray-700 dark:text-gray-300 mb-6">
                              Bright Labs saves you{" "}
                              {formatCurrency(
                                calculateTimeframeSavings(selectedCity)
                              )}{" "}
                              over {timeframe} months compared to starting up in{" "}
                              {selectedCity.name}.
                            </p>
                            <Button className="bg-black hover:bg-white text-white hover:text-black">
                              <Link href="https://airtable.com/appx6Ioi7YDebB7mW/pagvQAXuSeUplrKYl/form">Apply to Bright Labs</Link>
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full py-12 text-center bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                        <MapPinIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">
                          Select a City
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-xs">
                          Choose a city to calculate startup costs and savings.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Map Tab */}
        <TabsContent value="map" className="border-0 p-0">
          <Card className="border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="h-[500px] w-full">
                {leafletCustomIcon ? ( // Only render map if icon is ready
                  <DynamicMapContainer
                    center={
                      selectedCity
                        ? (selectedCity.position as [number, number])
                        : [50.0755, 10.4378]
                    }
                    zoom={selectedCity ? 6 : 4}
                    style={{ height: "100%", width: "100%" }}
                    scrollWheelZoom={true}
                    maxBounds={[
                      [34.0, -10.0],
                      [72.0, 40.0],
                    ]} // Restrict to Europe
                    minZoom={3}
                  >
                    <TileLayer
                      url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                      attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'
                    />
                    {cities.map((city) => (
                      <Marker
                        key={city.id}
                        position={city.position as [number, number]}
                        icon={leafletCustomIcon}
                        eventHandlers={{
                          click: () => handleMapCitySelect(city),
                        }}
                      >
                        <Popup>
                          <div className="p-1 space-y-1">
                            {" "}
                            {/* Reduced padding for compact popup */}
                            <h3 className="font-bold text-base mb-1">
                              {city.name}, {city.country}
                            </h3>
                            <div className="text-xs space-y-0.5">
                              {" "}
                              {/* Smaller text */}
                              <div className="flex justify-between">
                                <span className="text-gray-500">
                                  Living Costs:
                                </span>
                                <span className="font-medium">
                                  {formatCurrency(calculateMonthlyCosts(city))}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">
                                  Friendliness:
                                </span>
                                <span className="font-medium">
                                  {city.startupFriendliness}/100
                                </span>
                              </div>
                              <div className="flex justify-between text-black font-medium">
                                <span>{timeframe}-Mo Savings:</span>
                                <span>
                                  {formatCurrency(
                                    calculateTimeframeSavings(city)
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                    <MapComponent
                      selectedCity={selectedCity}
                      setSelectedCity={setSelectedCity}
                    />
                  </DynamicMapContainer>
                ) : (
                  <div
                    style={{
                      height: "500px",
                      background: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    Loading Map Data...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
