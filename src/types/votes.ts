import { z } from 'zod';
import { HexCode, Values } from '@/types/utils';

export enum State {
  ACT = "ACT",
  NSW = "NSW",
  NT = "NT",
  QLD = "QLD",
  SA = "SA",
  TAS = "TAS",
  VIC = "VIC",
  WA = "WA",
}

export type PartyConfigType = {
  name: string,
  colour: HexCode;
  // colourHover: HexCode;
};

// From 2022 only
export const Parties = [
  "UAPP", "ON", "ALP", "IND", "GRN", "LP", "", "LDP", "NAFD", "SOPA", "DPDA", "CYA", "NP", "CEC", "SPP", "AUD", "IMO",
  "ASP", "AJP", "TNL", "IAP", "SAL", "CLP", "AUVA", "LNP", "GAP", "KAP", "HMP", "AUP", "XEN", "JLN", "TLOC", "VNS",
  "DHJP", "REAS", "AUC", "WAP"
] as const;
export type Party = Values<typeof Parties>;

export const partyConfig = {
  "ALP": {
    name: "Australian Labour Party",
    colour: "#E13940",
  },
  "LP": {
    name: "Liberal Party",
    colour: "#1C4F9C",
  },
  "NP": {
    name: "National Party",
    colour: "#006946",
  },
  "LNP": {
    name: "Liberal National Party (Qld)",
    colour: "#1456F1",
  },
  "GRN": {
    name: "The Greens",
    colour: "#009C3D",
  },
  "KAP": {
    name: "Katter's Australia Party",
    colour: "#B50204",
  },
  "XEN": {
    name: "Centre Alliance",
    colour: "#ff6300",
  },
  "IND": {
    name: "Independents",
    colour: "#888888",
  },
  // The default
  "": {
    name: "N/A",
    colour: "#cccccc",
  }
// TODO make not partial (specify values for everything)
} as const satisfies Partial<Record<Party, PartyConfigType>>;

export const SimpleFirstPrefsSchema = z.record(z.string(), z.enum(Parties));
export type FirstPrefsResults = z.infer<typeof SimpleFirstPrefsSchema>;