'use client';

import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
// @ts-ignore Not my problem
import rewind from '@turf/rewind';
import { type Map } from '@/lib/types';
import { loadMap } from '@/lib/maps';

const WIDTH = 1000;
const HEIGHT = 800;

export default function Home() {
  const [error, setError] = useState<Error | undefined>();
  const [mapData, setMapData] = useState<Map | undefined>();
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    loadMap().then(data => {
      // geoJSON.features = geoJSON.features.map((f) => turf.rewind(f,{reverse:true}));
      const rewindedData: Map = {
        ...data,
        features: data.features.map(f => rewind(f, { reverse: true }))
      };
      setMapData(rewindedData);
    }).catch(setError);
  }, []);

  if (error) return <main className='min-h-screen'>{`${error}`}</main>;
  if (!mapData) return <main className='min-h-screen'>Loading...</main>;

  const projection = d3.geoEquirectangular();
  const path = d3.geoPath(projection);
  projection.fitSize([WIDTH, HEIGHT], mapData);

  const svg = d3.select(svgRef.current)
    .attr("width", WIDTH)
    .attr("height", HEIGHT);

  const g_elements = svg.append("g").attr("class", "elements");
  g_elements.selectAll("path")
    .data(mapData.features)
    .enter()
    .append('path')
    .attr('d', path);

  return <main className="min-h-screen">
    <svg ref={svgRef}></svg>
  </main>;
}
