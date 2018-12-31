import React from 'react'
import { letterFrequency } from '@vx/mock-data';
import { Group } from '@vx/group';
import { Bar } from '@vx/shape';
import { scaleLinear, scaleBand } from '@vx/scale';

import * as topojson from 'topojson-client';
import { scaleQuantize } from '@vx/scale';
import { Mercator, Graticule, Albers } from '@vx/geo';
import topology from '../../static/vx-geo/world-topo.json';
import topologyBD from '../../static/vx-geo/bangladesh_topo.json';

import Layout from '../components/layout'
import SEO from '../components/seo'

// We'll use some mock data from `@vx/mock-data` for this.
const data = letterFrequency;

// Define the graph dimensions and margins
const width = window.innerWidth - 300;
const height = 500;

const bg = '#f9f7e8';

console.group("Before topojson");
console.log(topologyBD);
console.log(topology);
console.groupEnd();

const world = topojson.feature(topology, topology.objects.units);
const bd = topojson.feature(topologyBD, topologyBD.objects.bangladesh);
const color = scaleQuantize({
  domain: [
    Math.min(...bd.features.map(f => f.geometry.coordinates.length)),
    Math.max(...bd.features.map(f => f.geometry.coordinates.length))
  ],
  range: ['#ffb01d', '#ffa020', '#ff9221', '#ff8424', '#ff7425', '#fc5e2f', '#f94b3a', '#f63a48']
});

console.group("After topojson");
console.log(bd.features);
console.log(world.features);
console.groupEnd();

const IndexPage = () => {

  const centerX = width / 2;
  const centerY = height / 2;
  const scale = width / 630 * 100;

  return (
    <Layout>
      <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />

      <svg width={width} height={height}>
        <rect x={0} y={0} width={width} height={height} fill={bg} rx={14} />
        <Mercator data={bd.features} scale={scale} translate={[centerX, centerY + 50]}>
          {mercator => {
            return (
              <g>
                <Graticule graticule={g => mercator.path(g)} stroke={'rgba(33,33,33,0.05)'} />
                {mercator.features.map((feature, i) => {
                  const { feature: f } = feature;
                  return (
                    <path
                      key={`map-feature-${i}`}
                      d={mercator.path(f)}
                      fill={color(f.geometry.coordinates.length)}
                      stroke={bg}
                      strokeWidth={0.5}
                      onClick={event => {
                        console.log(`clicked: ${f.properties.name} (${f.id})`);
                      }}
                    />
                  );
                })}
              </g>
            );
          }}
        </Mercator>
      </svg>
    </Layout>
  )
}

export default IndexPage
