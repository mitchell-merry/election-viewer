'use client';

import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import { type Map } from '@/lib/types';
import { loadMap } from '@/lib/maps';

export default function Home() {
  const [error, setError] = useState<Error | undefined>();
  const [mapData, setMapData] = useState<Map | undefined>();
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    loadMap().then(setMapData).catch(setError);
  }, []);

  if (error) return <main className='min-h-screen'>{`${error}`}</main>;
  if (!mapData) return <main className='min-h-screen'>Loading...</main>;

  const projection = d3.geoEqualEarth();
  const a = d3.geoPath(projection);
  const WIDTH = 1000;
  const HEIGHT = 800;
  const path = projection.fitSize([WIDTH, HEIGHT], mapData);

  const svg = d3.select(svgRef.current)
    .attr("width", WIDTH)
    .attr("height", HEIGHT);

  return <main className="min-h-screen">
    <svg ref={svgRef}></svg>
  </main>;
}
