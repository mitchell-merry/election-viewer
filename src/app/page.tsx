'use client';

import * as d3 from 'd3';
import { useEffect, useState } from 'react';
import { MapSchema, type Map } from '@/lib/types';
import { loadMap } from '@/lib/maps';

export default function Home() {
  let [map, setMap] = useState<Map | undefined>();
  let [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    loadMap().then(setMap).catch(setError);
  }, []);

  if (error) {
    return <main className='min-h-screen'>{`${error}`}</main>;
  }

  if (!map) {
    return <main className='min-h-screen'>Loading...</main>;
  }

  const projection = d3.geoEqualEarth();
  const a = d3.geoPath(projection);
  const path = projection.fitSize([1000, 800], map);

  return <main className="min-h-screen"></main>;
}
