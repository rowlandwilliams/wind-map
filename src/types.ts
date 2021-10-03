export interface CitiesData {
  [key: string]: string | number;
  city: string;
  growth_from_2000_to_2013: string;
  latitude: number;
  longitude: number;
  population: string;
  rank: string | number;
  state: string;
  color: string;
  year: number;
}

export interface CitiesDataWithCoords {
  coords: [number, number] | null;
  city: string;
  growth_from_2000_to_2013: string;
  latitude: number;
  longitude: number;
  population: string;
  rank: string | number;
  state: string;
  color: string;
  year: number;
}

export interface TooltipData {
  mouseCoords: [] | number[];
  data: CitiesDataWithCoords | null;
}
