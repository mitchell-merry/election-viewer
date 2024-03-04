import { MapSchema } from '@/types/maps';
import { SimpleFirstPrefsSchema } from '@/types/votes';

export const loadMap = async () => {
  const response = await fetch('/2021_ELB_region.geojson');

  if (!response.ok) {
    throw new Error(response.statusText);

    // const error = await response.text();
    // throw new Error(error);
  }

  const rawMap = await response.json();
  const parsedMap = MapSchema.parse(rawMap);
  console.log(`Loaded map: ${parsedMap.metadata.name}`);
  return parsedMap;
};

export const loadVotes = async () => {
  const file = '/2022-FirstPrefs.json';
  const response = await fetch(file);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const rawMap = await response.json();
  const parsedMap = SimpleFirstPrefsSchema.parse(rawMap);
  console.log(`Loaded votes: ${file}`);
  return parsedMap;
};
