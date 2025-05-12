"use client";

import {
  Home,
  Gift,
  Train,
  MapPin,
  Utensils,
  InfoIcon,
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

// Dynamic imports
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

// Popup Content Component (unchanged)
const CityPopupContent = ({
  city,
  calculatedCost,
  isOradea,
}: {
  city: City;
  calculatedCost: number;
  isOradea: boolean;
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
      oradeaBrightLabs: false,
    },
    { Icon: Briefcase, label: "Coworking", value: city.monthlyCosts.coworking },
    { Icon: Train, label: "Transport", value: city.monthlyCosts.transport },
    { Icon: HeartPulse, label: "Medical", value: city.monthlyCosts.medical },
  ];

  const renderWithBrightLabs = () => (
    <div className="border rounded-lg p-3 border-[#fff600] bg-[#fff600]">
      <div className="mb-2 text-black font-bold">With Bright Labs</div>
      <ul className="space-y-1.5 text-sm">
        {[Home, Lightbulb, Utensils, Briefcase].map((IconComp, idx) => (
          <li key={idx} className="flex items-center justify-between">
            <s className="flex items-center">
              <IconComp className="w-4 h-4 mr-2 text-black" />
              {costItems[idx].label}:
            </s>
            <span className="font-medium text-black">€0.00</span>
          </li>
        ))}
        <li className="flex items-center justify-between">
          <span className="flex items-center">
            <Train className="w-4 h-4 mr-2 text-black" />
            Transport:
          </span>
          <span className="font-medium text-black">€30</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="flex items-center">
            <HeartPulse className="w-4 h-4 mr-2 text-black" />
            Medical:
          </span>
          <span className="font-medium text-black">€80</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="flex items-center">
            <Gift className="w-4 h-4 mr-2 text-black" />
            Stipend grant:
          </span>
          <span className="font-medium text-black">€2000</span>
        </li>
        <li className="flex items-center justify-between font-bold border-t-2 border-black mt-2">
          <span className="flex items-center text-black">Total:</span>
          <div className="flex items-center gap-1">
            <p className="text-black font-semibold">-€1890</p>
            <div className="relative group">
              <InfoIcon className="h-4 w-4 text-black cursor-pointer" />
              <span className="w-56 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg shadow-lg py-2 px-3">
                <strong>Burn Rate:</strong> Enjoy savings on living, utilities, food, and coworking costs, plus a <strong>€2000</strong> grant to kickstart your prototype with Bright Labs.
              </span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );

  const renderCostList = (
    title: string,
    costs: typeof costItems,
    isBrightLabsSection: boolean = false
  ) => (
    <div className="border rounded-lg p-3 border-black bg-white">
      <div className="mb-2 text-black font-bold">{title}</div>
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
        <li className="flex items-center justify-between font-bold border-t-2 border-black mt-2 pt-2">
          <span className="flex items-center text-black">Total:</span>
          <span className="text-black">
            €{costs.reduce((total, item) => total + item.value, 0)}
          </span>
        </li>
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
          {renderWithBrightLabs()}
          {renderCostList("Without Bright Labs (Standard)", costItems)}
        </div>
      ) : (
        renderCostList("Cost Breakdown", costItems)
      )}
    </div>
  );
};

// Main Map Component
export const Maps = () => {
  const teamSize = 1;
  const isRemoteTeam = false;
  const additionalExpenses = 0;

  const [isClient, setIsClient] = useState(false);
  const [defaultIcon, setDefaultIcon] = useState<Icon<IconOptions> | null>(
    null
  );
  const [oradeaIcon, setOradeaIcon] = useState<Icon<IconOptions> | null>(null);

  useEffect(() => {
    setIsClient(typeof window !== "undefined");

    if (typeof window !== "undefined") {
      import("leaflet").then((L) => {
        const defaultIcon = new L.Icon({
          iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png",
          iconRetinaUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-black-2x.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        const oradeaIcon = new L.Icon({
          iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png",
          iconRetinaUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow-2x.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        setDefaultIcon(defaultIcon);
        setOradeaIcon(oradeaIcon);
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

  if (!isClient || !defaultIcon || !oradeaIcon) {
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
            <Marker
              key={city.id}
              position={city.position}
              icon={city.id === "oradea" ? oradeaIcon : defaultIcon}
            >
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
