import {
  PlusIcon,
  InfoIcon,
  MinusIcon,
  UsersIcon,
  MapPinIcon,
  CalendarIcon,
} from "lucide-react";
import {
  cities,
  majorHub,
  hiddenGem,
  emergingHub,
  startupTypes,
  cityProfiles,
  founderPersonas,
} from "@/helpers/data";
import Link from "next/link";
import Image from "next/image";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import { City } from "@/types/types";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import star from "../../../assets/star_2b50.png";
import { BuildingIcon, RocketIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const Calc = () => {
  const timeframe: number = 4;
  const stipend: number = 2000;

  const [teamSize, setTeamSize] = useState<number>(1);
  const [burnRate, setBurnRate] = useState<number>(2000);
  const [additionalExpenses, setAdditionalExpenses] = useState<number>(0);

  const [isRemoteTeam, setIsRemoteTeam] = useState<boolean>(
    founderPersonas[0].defaults.isRemoteTeam
  );

  const [selectedCity, setSelectedCity] = useState<City | null>(cities[0]);
  const [selectedPersona, setSelectedPersona] = useState<string | null>(
    founderPersonas[0].id
  );
  const [selectedStartupType, setSelectedStartupType] = useState<string | null>(
    startupTypes[0].id
  );
  const [selectedCityProfile, setSelectedCityProfile] = useState<string | null>(
    cityProfiles[0].id
  );

  useEffect(() => {
    if (selectedPersona === "solo") {
      setTeamSize(1);
    } else if (selectedPersona === "ambitious") {
      setTeamSize(2);
    } else if (selectedPersona === "established") {
      setTeamSize(4);
    }
  }, [selectedPersona]);

  useEffect(() => {
    if (selectedCityProfile === "major") {
      setSelectedCity(majorHub[0]);
    } else if (selectedCityProfile === "emerging") {
      setSelectedCity(emergingHub[1]);
    } else if (selectedCityProfile === "hidden-gem") {
      setSelectedCity(hiddenGem[1]);
    } else {
      setSelectedCity(cities[0]);
    }
  }, [selectedCityProfile]);

  const findCityById = (id: string): City | undefined => {
    return cities.find((city) => city.id === id);
  };

  const handleCitySelect = (cityId: string) => {
    const city = findCityById(cityId);
    if (city) {
      setSelectedCity(city);
    }
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
    const { rent, food, utilities, coworking, transport, medical } =
      city.monthlyCosts;
    let baseCost = rent + food + utilities + coworking + transport + medical;

    // Living Costs
    if (isRemoteTeam) {
      baseCost =
        rent * 0.7 +
        food +
        utilities +
        coworking * 0.5 +
        transport * 0.5 +
        medical;
    }
    return adjustCostsForProfileAndType(baseCost);
  };

  const calculateTotalMonthlyCost = (city: City | null): number => {
    if (!city) return 0;
    return (
      burnRate + calculateMonthlyCosts(city) * teamSize + additionalExpenses
    );
  };

  const calculateTotalMonthlyCostWithBrightLabs = (): number => {
    return (
      cities[0].monthlyCosts.transport * teamSize +
      cities[0].monthlyCosts.medical * teamSize +
      additionalExpenses +
      burnRate -
      stipend
    );
  };

  const totalMonthlyCostWithBrightLabs = (): number => {
    return calculateTotalMonthlyCostWithBrightLabs() * timeframe;
  };

  const calculateTimeframeCost = (city: City | null): number => {
    return calculateTotalMonthlyCost(city) * timeframe;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-EU", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const handleStartupTypeSelect = (typeId: string) => {
    setSelectedStartupType(typeId);
  };

  const handleCityProfileSelect = (profileId: string) => {
    setSelectedCityProfile((prevProfileId) =>
      prevProfileId === profileId ? null : profileId
    );
  };

  const getFilteredCities = (): City[] => {
    switch (selectedCityProfile) {
      case "major":
        return majorHub;
      case "emerging":
        return emergingHub;
      case "hidden-gem":
        return hiddenGem;
      default:
        return cities;
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);

    if (newValue < 2000) {
      setBurnRate(2000);
    } else {
      setBurnRate(newValue);
    }
  };

  const handleRentAndUtilities = (rent: number, utilities: number) => {
    if (isRemoteTeam) {
      return formatCurrency(0);
    }
    const multiplier = Math.floor((teamSize - 1) / 3) + 1;
    return formatCurrency((rent + utilities) * multiplier);
  };

  const calculateTimeframeSavings = (city: City | null): number => {
    if (!city) return 0;
    return calculateTimeframeCost(city) - totalMonthlyCostWithBrightLabs();
  };

  const calculateSavingsPercentage = (city: City | null): number => {
    if (!city) return 0;
    const timeframeCost = calculateTimeframeCost(city);
    if (timeframeCost === 0) return 0;
    const savings = calculateTimeframeSavings(city);
    return Math.round((savings / timeframeCost) * 100);
  };

  return (
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
                  onClick={() => setSelectedPersona(persona.id)}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
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
                          <h5 className="font-medium text-sm">{type.name}</h5>
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
                      className={`border rounded-lg p-2 cursor-pointer transition-all hover:shadow-sm duration-500 ease-in-ou ${
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
                                  <span className="text-black mr-1">✓</span>{" "}
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
                <Label htmlFor="city-select" className="text-sm font-medium">
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
                    {selectedCityProfile === "major" ||
                    selectedCityProfile === "emerging" ? (
                      <SelectItem key={cities[0].id} value={cities[0].id}>
                        <span className="text-[#7c7405] font-bold">Oradea</span>
                      </SelectItem>
                    ) : null}
                    {getFilteredCities().map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.id === "oradea" && (
                          <Image
                            src={star}
                            alt="Star"
                            className="ml-2 h-4 w-4"
                          />
                        )}
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
                  <div className="relative group">
                    <InfoIcon className="h-4 w-4 ml-1 inline-block text-gray-400" />
                    <span className="w-48 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-sm rounded-lg shadow-lg py-2 px-3">
                      <strong>Burn Rate:</strong> The burn rate is used by
                      startup companies and investors to track the amount of
                      monthly cash that a company spends before it starts
                      generating income.
                    </span>
                  </div>
                </Label>
                <Input
                  max={100000}
                  id="burn-rate"
                  type="number"
                  value={burnRate}
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Calculation starts from 4000€/month
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-size" className="text-sm font-medium">
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
                      (selectedPersona === "ambitious" && teamSize <= 2) ||
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
                </Label>
                <Input
                  id="additional-expenses"
                  type="number"
                  value={additionalExpenses}
                  onChange={(e) =>
                    setAdditionalExpenses(Math.max(0, Number(e.target.value)))
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
                  <div className="flex items-center gap-2">
                    <Input disabled value={"4 months"} />
                  </div>
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
                          {formatCurrency(calculateMonthlyCosts(selectedCity))}
                          /person
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-start mb-2">
                        <h4 className="font-medium text-gray-500 dark:text-gray-400">
                          Without Bright Labs
                        </h4>
                        <div className="relative group">
                          <InfoIcon className="h-4 w-4 ml-1 inline-block text-gray-400" />
                          <span className="w-48 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-sm rounded-lg shadow-lg py-2 px-3">
                            <strong>Info:</strong> The total cost may vary based
                            on the startup type that you choose.
                          </span>
                        </div>
                      </div>
                      <p className="text-2xl font-bold">
                        {formatCurrency(calculateTimeframeCost(selectedCity))}
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
                            {isRemoteTeam ? (
                              <s>Rent + Utilities</s>
                            ) : (
                              <div className="flex items-center">
                                <p>
                                  Rent + Utilities (
                                  {Math.floor((teamSize - 1) / 3) + 1}x)
                                </p>
                                <div className="relative group">
                                  <InfoIcon className="h-3 w-3 ml-1 inline-block text-gray-400" />
                                  <span className="w-48 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-sm rounded-lg shadow-lg py-2 px-3">
                                    <strong>Info:</strong> The rent and
                                    utilities are calculated based on the number
                                    of people in the team. If you are a solo
                                    founder, the rent and utilities are
                                    calculated for 1 person.If teams is bigger
                                    than 4, the rent and utilities are
                                    calculated double
                                  </span>
                                </div>
                              </div>
                            )}
                          </span>
                          <span>
                            {handleRentAndUtilities(
                              selectedCity.monthlyCosts.rent,
                              selectedCity.monthlyCosts.utilities
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">
                            Food ({teamSize}x)
                          </span>
                          <span>
                            {formatCurrency(
                              selectedCity.monthlyCosts.food * teamSize
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">
                            Coworking ({teamSize}x)
                          </span>
                          <span>
                            {formatCurrency(
                              selectedCity.monthlyCosts.coworking * teamSize
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">
                            {isRemoteTeam ? (
                              <s>Transport</s>
                            ) : (
                              <span>Transport ({teamSize}x)</span>
                            )}
                          </span>
                          <span>
                            {isRemoteTeam
                              ? formatCurrency(0)
                              : formatCurrency(
                                  selectedCity.monthlyCosts.transport * teamSize
                                )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">
                            Medical ({teamSize}x)
                          </span>
                          <span>
                            {formatCurrency(
                              selectedCity.monthlyCosts.medical * teamSize
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">
                            Additional Expenses
                          </span>
                          <span>{formatCurrency(additionalExpenses)}</span>
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
                        Build in Oradea with Bright Labs
                      </h4>
                      <p className="text-2xl font-bold">
                        {formatCurrency(totalMonthlyCostWithBrightLabs())}
                      </p>
                      <p className="text-sm text-white">
                        for {timeframe} months
                      </p>
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Monthly Burn Rate</span>
                          <span>{formatCurrency(burnRate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <p>Stipend grant</p>
                            <div className="relative group">
                              <InfoIcon className="h-3 w-3 ml-1 inline-block text-gray-400" />
                              <span className="w-48 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-sm rounded-lg shadow-lg py-2 px-3">
                                <strong>Info:</strong> You will receive a
                                stipend grant of 2000€/month and because monthly
                                burn rate is for example 2000€/month, we will
                                make up the difference. If you modify the
                                monthly burn rate, the total cost will modify
                                accordingly.
                              </span>
                            </div>
                          </div>
                          <span>-{formatCurrency(2000)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Transport ({teamSize}x)</span>
                          <span>
                            {formatCurrency(
                              cities[0].monthlyCosts.transport * teamSize
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Medical ({teamSize}x)</span>
                          <span>
                            {formatCurrency(
                              cities[0].monthlyCosts.medical * teamSize
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Additional Expenses</span>
                          <span>{formatCurrency(additionalExpenses)}</span>
                        </div>
                        <div className="flex justify-between">
                          <s>Rent + Utilities</s>
                          <span>{formatCurrency(0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <s>Food</s>
                          <span>{formatCurrency(0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <s>Coworking</s>
                          <span>{formatCurrency(0)}</span>
                        </div>
                        <div className="flex justify-between font-medium mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                          <span>Monthly Total</span>
                          <span>
                            {formatCurrency(
                              calculateTotalMonthlyCostWithBrightLabs()
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-black border border-black rounded-lg p-6">
                    <div className="grid grid-cols-1 gap-6">
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
                          That is a {calculateSavingsPercentage(selectedCity)}%
                          reduction in costs!
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
                      <Button className="bg-black cursor-pointer hover:bg-slate-800">
                        <Link href="https://airtable.com/appx6Ioi7YDebB7mW/pagvQAXuSeUplrKYl/form">
                          Apply to Bright Labs
                        </Link>
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
  );
};
