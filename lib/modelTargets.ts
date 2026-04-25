import { Bike } from "@/lib/data";

export type ModelTarget = {
  label: string;
  searchTokens: string[];
  fallbackTokens?: string[];
};

export const normalizeModelName = (value: string) => value.trim().toUpperCase();

export const homeAndSparesModelTargets: ModelTarget[] = [
  {
    label: "EKON450M1V2",
    searchTokens: ["EKON450M1V2", "EKCON450M1V2", "450M1V2"],
    fallbackTokens: ["EKON450M1", "EKCON450M1", "450M1"]
  },
  {
    label: "EKON450M2V2",
    searchTokens: ["EKON450M2V2", "EKCON450M2V2", "450M2V2"],
    fallbackTokens: ["EKON450M2", "EKON450M2", "450M2"]
  },
  {
    label: "EKON450M3",
    searchTokens: ["EKON450M3", "EKON450M3", "450M3"]
  },
  {
    label: "VEO",
    searchTokens: ["VEO"]
  },
  {
    label: "EKON450M1",
    searchTokens: ["EKON450M1", "EKCON450M1", "450M1"]
  },
  {
    label: "EKON400M2",
    searchTokens: ["EKON400M2", "EKCON400M2", "400M2"],
    fallbackTokens: ["EKON400M1", "EKCON400M1", "400M1"]
  }
];

export const bikesPageModelTargets: ModelTarget[] = [
  {
    label: "EKON450M1V2",
    searchTokens: ["EKON450M1V2", "EKCON450M1V2", "450M1V2"],
  },
  {
    label: "EKON450M2V2",
    searchTokens: ["EKON450M2V2", "EKCON450M2V2", "450M2V2"],
  }
];

export const findBikeByTokens = (
  bikes: Bike[],
  searchTokens: string[],
  fallbackTokens?: string[]
) => {
  const matchByTokens = (tokens: string[]) =>
    bikes.find((bike) => {
      const bikeName = normalizeModelName(bike.name);
      return tokens.some((token) => bikeName.includes(token));
    });

  return matchByTokens(searchTokens) ?? (fallbackTokens ? matchByTokens(fallbackTokens) : undefined);
};