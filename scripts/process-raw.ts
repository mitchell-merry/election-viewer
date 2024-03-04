import { readFileSync } from "node:fs";

import { parse } from "csv-parse/sync";
import groupBy from 'object.groupby';
import path from 'node:path';
import { z } from 'zod';
import { State } from '@/types/votes';

export const RawFirstPrefsSchema = z.object({
  StateAb: z.nativeEnum(State),
  DivisionID: z.string(),
  DivisionNm: z.string(),
  CandidateNm: z.string().optional(),
  Surname: z.string(),
  GivenNm: z.string(),
  BallotPosition: z.string(),
  Elected: z.enum(["N", "Y"]),
  HistoricElected: z.enum(["N", "Y"]),
  PartyAb: z.string().optional(),
  PartyNm: z.string(),
  OrdinaryVotes: z.string(),
  AbsentVotes: z.string(),
  ProvisionalVotes: z.string(),
  PrePollVotes: z.string(),
  PostalVotes: z.string(),
  TotalVotes: z.string(),
  Swing: z.string(),
}).array();

// 2022 Federal Election House of Representatives First Preferences By Candidate By Vote Type [Event:27966 Phase:FinalResults Generated:2022-07-19T10:29:59 Cycle:06578790-03c6-4cf4-b786-103cfb915abd Created:2022-07-19T10:24:10 Environment:PROD Site:CANBERRA Server:TALLYROOM Version:10.9.9.0]
const data = RawFirstPrefsSchema.parse(
  parse(
    readFileSync(path.join(__filename, '..', 'data', '2022-FirstPrefs.csv')), {
      columns: true,
    }
  )
);

const stripData = Object.fromEntries(data
  .filter(divisionCandidate => divisionCandidate.Elected === "Y")
  .map(divisionCandidate => [divisionCandidate.DivisionNm, divisionCandidate.PartyAb]));

// console.log(JSON.stringify(stripData, null, 2));

let allParties = data.map(candidate => ({
  ab: candidate.PartyAb,
  name: candidate.PartyNm,
}));
allParties = allParties.filter(
  (party, currIdx) => allParties.findIndex(p => p.ab === party.ab) === currIdx
);
console.log(allParties.map(party => party.ab));
// console.log(allParties.map(party => `${party.ab},${party.name}`).join('\n'));