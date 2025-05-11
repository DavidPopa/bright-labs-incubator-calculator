"use client";

import {
  Home,
  Train,
  MapPin,
  Utensils,
  Briefcase,
  Lightbulb,
  LoaderIcon,
  HeartPulse,
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { City } from "@/types/types";
import { useEffect, useState, useCallback } from "react";
import { cities as initialCities } from "@/helpers/data";
import { Icon, IconOptions, LatLngBoundsExpression } from "leaflet";

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

interface CityPopupContentProps {
  city: City;
  calculatedCost: number;
  isOradea: boolean;
}

const CityPopupContent: React.FC<CityPopupContentProps> = ({
  city,
  calculatedCost,
  isOradea,
}) => {
  const costItems = [
    {
      Icon: Home,
      label: "Rent",
      value: city.monthlyCosts.rent,
      oradeaValue: "Free",
      oradeaBrightLabs: true,
    },
    {
      Icon: Lightbulb,
      label: "Utilities",
      value: city.monthlyCosts.utilities,
      oradeaValue: "Free",
      oradeaBrightLabs: true,
    },
    {
      Icon: Utensils,
      label: "Food",
      value: city.monthlyCosts.food,
      oradeaValue: `€${city.monthlyCosts.food}`,
      oradeaBrightLabs: false,
    },
    { Icon: Briefcase, label: "Coworking", value: city.monthlyCosts.coworking },
    { Icon: Train, label: "Transport", value: city.monthlyCosts.transport },
    { Icon: HeartPulse, label: "Medical", value: city.monthlyCosts.medical },
  ];

  const renderCostList = (
    title: string,
    costs: typeof costItems,
    highlight: boolean,
    isBrightLabsSection: boolean = false
  ) => (
    <div
      className={`border rounded-lg p-3 ${
        highlight ? "border-[#fff600] bg-[#fff600] " : "border-black bg-white"
      }`}
    >
      <div className={`mb-2 ${highlight ? "text-black" : "text-black"}`}>
        {isBrightLabsSection}
        {title}
      </div>
      <ul className="space-y-1.5 text-sm">
        {costs.map((item) => (
          <li key={item.label} className="flex items-center justify-between">
            <span className="flex items-center text-black">
              <item.Icon className="w-4 h-4 mr-2 text-black" />
              {item.label}:
            </span>
            <span
              className={
                isBrightLabsSection && item.oradeaBrightLabs
                  ? "text-black font-semibold"
                  : "font-medium text-black"
              }
            >
              {isBrightLabsSection && item.oradeaValue !== undefined
                ? item.oradeaValue
                : `€${item.value}`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="w-64 space-y-3 p-1">
      <div className="text-center">
        <h3 className="text-lg font-bold text-black flex items-center justify-center">
          <MapPin className="w-5 h-5 mr-2 text-black" />
          {city.name}, {city.country}
        </h3>
      </div>

      {!isOradea && (
        <div className="text-center my-2 p-2 bg-gray-200 rounded-md">
          <span className="text-xs text-black">Estimated Monthly Cost</span>
          <div className="text-2xl font-bold text-black">
            €{calculatedCost.toLocaleString()}
          </div>
        </div>
      )}

      {isOradea ? (
        <div className="space-y-3">
          {renderCostList("With Bright Labs", costItems, true, true)}
          {renderCostList("Without Bright Labs (Standard)", costItems, false)}
          <div className="text-center my-2 p-2 bg-gray-200 rounded-md">
            <span className="text-xs text-black">
              Est. Cost with Bright Labs
            </span>
            <div className="text-2xl font-bold text-black">
              €{calculatedCost.toLocaleString()}{" "}
            </div>
          </div>
        </div>
      ) : (
        renderCostList("Cost Breakdown", costItems, false)
      )}
    </div>
  );
};

export const Maps = () => {
  const teamSize = 1;
  const isRemoteTeam = false;
  const additionalExpenses = 0;

  const [isClient, setIsClient] = useState(false);
  const [customIcon, setCustomIcon] = useState<Icon<IconOptions> | null>(null);

  useEffect(() => {
    setIsClient(typeof window !== "undefined");

    if (typeof window !== "undefined") {
      import("leaflet").then((L) => {
        const icon = new L.Icon({
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
        });
        setCustomIcon(icon);
      });
    }
  }, []);

  const calculateCost = useCallback(
    (city: City): number => {
      let { rent, food, utilities } = city.monthlyCosts;
      const { coworking, transport, medical } = city.monthlyCosts;

      if (city.id === "oradea") {
        rent = 0;
        utilities = 0;
        food *= 0.8;
      }

      let base = rent + food + utilities + coworking + transport + medical;

      if (isRemoteTeam && city.id !== "oradea") {
        base =
          city.monthlyCosts.rent * 0.7 +
          food +
          city.monthlyCosts.utilities +
          coworking * 0.5 +
          transport * 0.5 +
          medical;
      } else if (isRemoteTeam && city.id === "oradea") {
        base =
          rent + food + utilities + coworking * 0.5 + transport * 0.5 + medical;
      }

      return Math.round(base * teamSize + additionalExpenses);
    },
    [teamSize, additionalExpenses, isRemoteTeam]
  );

  if (!isClient || !customIcon) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <LoaderIcon className="animate-spin h-12 w-12 text-black" />
        <p className="ml-4 text-lg text-black">Loading Map...</p>
      </div>
    );
  }

  const mapBounds: LatLngBoundsExpression = [
    [34.0, -10.0],
    [72.0, 40.0],
  ];

  return (
    <div className="flex flex-col h-screen gap-4">
      <div className="flex-grow rounded-xl overflow-hidden shadow-xl border border-black">
        <MapContainer
          center={[50.0755, 10.4378]}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
          maxBounds={mapBounds}
          minZoom={4}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'
          />
          {initialCities.map((city) => (
            <Marker key={city.id} position={city.position} icon={customIcon}>
              <Popup>
                <CityPopupContent
                  city={city}
                  calculatedCost={calculateCost(city)}
                  isOradea={city.id === "oradea"}
                />
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};
