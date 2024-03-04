'use client';

import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
// @ts-ignore Not my problem
import rewind from '@turf/rewind';
import { loadMap, loadVotes } from '@/lib/maps';
import type { Map } from '@/types/maps';
import { FirstPrefsResults, partyConfig, PartyConfigType } from '@/types/votes';

const WIDTH = 1000;
const HEIGHT = 800;

const getParty = (results: FirstPrefsResults, region: string): PartyConfigType => {
  const partyThatWon = results[region];
  if (!partyThatWon) {
    throw new Error(`Found no match for ${partyThatWon}!`);
  }

  return {
    name: partyThatWon,
    colour: partyThatWon in partyConfig
      ? partyConfig[partyThatWon as keyof typeof partyConfig].colour
      : partyConfig[''].colour,
  };
};

export default function Home() {
  const [error, setError] = useState<Error | undefined>();
  const [mapData, setMapData] = useState<Map | undefined>();
  const [results, setResults] = useState<FirstPrefsResults | undefined>();
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    loadMap()
      .then(data => {
        setMapData({
          ...data,
          features: data.features.map(f => rewind(f, { reverse: true })),
        });
      })
      .catch(setError);

    loadVotes().then(setResults)
      .catch(setError);
  }, []);

  useEffect(() => {
    if (!mapData || !results || !svgRef.current) return;

    const projection = d3.geoEquirectangular();
    const path = d3.geoPath(projection);
    projection.fitSize([WIDTH, HEIGHT], mapData);

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g_elements = svg.append('g').attr('class', 'elements');
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .on('zoom', e => g_elements.attr('transform', e.transform));
    svg.call(zoom);

    g_elements
      .selectAll('path')
      .data(mapData.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('data-name', datum => datum.properties.name)
      .attr('data-party', datum => getParty(results, datum.properties.name).name)
      .attr('fill', datum => getParty(results, datum.properties.name).colour);
      // .attr('class', () => getParty());
  }, [mapData, results]);

  if (error) return <main className="min-h-screen">{`${error}`}</main>;
  if (!mapData || !results) return <main className="min-h-screen">Loading...</main>;

  return (
    <main className="min-h-screen">
      <svg
        ref={svgRef}
        className="min-h-screen"
        width="100%"
        height="100%"
      />
    </main>
  );
}
