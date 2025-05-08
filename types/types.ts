export type City = {
    id: string;
    name: string;
    country: string;
    position: [number, number];
    monthlyCosts: {
      rent: number;
      food: number;
      utilities: number;
      coworking: number;
      transport: number;
      other: number;
    };
    startupFriendliness: number;
  };
  
  export type FounderPersona = {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    defaults: {
      teamSize: number;
      burnRate: number;
      additionalExpenses: number;
      isRemoteTeam: boolean;
      timeframe: number;
    };
  };
  
  export type StartupType = {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
  };
  
  export type CityProfile = {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    cities: string[];
    pros: string[];
    cons: string[];
  };
  
  export type BrightLabsBenefits = {
    housing: boolean;
    food: boolean;
    coworking: boolean;
    stipend: number;
    mentorship: boolean;
    networking: boolean;
  };
  
  export type MapComponentProps = {
    selectedCity: City | null;
    setSelectedCity: React.Dispatch<React.SetStateAction<City | null>>;
  };