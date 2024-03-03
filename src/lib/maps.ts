import { MapSchema } from '@/lib/types';

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