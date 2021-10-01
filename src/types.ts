export interface CitiesData {
  city: string;
  growth_from_2000_to_2013: string;
  latitude: number;
  longitude: number;
  population: string;
  rank: string;
  state: string;
  color: string;
}

export interface CitiesDataWithCoords {
  coords: [number, number] | null;
  city: string;
  growth_from_2000_to_2013: string;
  latitude: number;
  longitude: number;
  population: string;
  rank: string;
  state: string;
  color: string;
}

export interface TooltipData {
  mouseCoords: [] | number[];
  data: CitiesData | null;
}
