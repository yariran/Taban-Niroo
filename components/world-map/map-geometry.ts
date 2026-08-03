import type { FeatureCollection, Geometry } from "geojson";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import worldAtlas from "world-atlas/countries-110m.json";

import {
  getInteractiveCountryKey,
  type InteractiveCountryKey,
} from "./country-data";
import { MAP_VIEWBOX } from "./map-config";

type AtlasProperties = {
  name?: string;
};

type AtlasTopology = Topology<{
  countries: GeometryCollection<AtlasProperties>;
}>;

export type CountryShape = {
  id: string;
  atlasName: string;
  d: string;
  centroid: readonly [number, number];
  interactiveKey?: InteractiveCountryKey;
};

function buildCountryShapes(): readonly CountryShape[] {
  const topology = worldAtlas as unknown as AtlasTopology;
  const collection = feature(
    topology,
    topology.objects.countries,
  ) as FeatureCollection<Geometry, AtlasProperties>;

  // Antarctica is intentionally omitted from the visual frame. It is not a
  // sovereign country and removing it creates the familiar 2:1 world layout.
  const visibleFeatures = collection.features.filter(
    (country) => country.properties?.name !== "Antarctica",
  );

  const visibleCollection: FeatureCollection<Geometry, AtlasProperties> = {
    type: "FeatureCollection",
    features: visibleFeatures,
  };

  // Center near the Middle East. Do not translate after fitExtent — that
  // pushes southern landmasses outside the viewBox and crops the bottom.
  const projection = geoNaturalEarth1()
    .rotate([-28, 0])
    .fitExtent(
      [
        [MAP_VIEWBOX.padding + 10, MAP_VIEWBOX.padding],
        [
          MAP_VIEWBOX.width - MAP_VIEWBOX.padding - 4,
          MAP_VIEWBOX.height - MAP_VIEWBOX.padding,
        ],
      ],
      visibleCollection,
    );

  const path = geoPath(projection);

  return Object.freeze(
    visibleFeatures.flatMap((country, index) => {
      const d = path(country);
      if (!d) return [];

      const atlasName = country.properties?.name ?? `Country ${index + 1}`;
      const rawCentroid = path.centroid(country);
      const centroid: readonly [number, number] = [
        Number.isFinite(rawCentroid[0]) ? rawCentroid[0] : MAP_VIEWBOX.width / 2,
        Number.isFinite(rawCentroid[1]) ? rawCentroid[1] : MAP_VIEWBOX.height / 2,
      ];

      return [
        Object.freeze({
          id: String(country.id ?? `${atlasName}-${index}`),
          atlasName,
          d,
          centroid,
          interactiveKey: getInteractiveCountryKey(atlasName),
        }),
      ];
    }),
  );
}

/** Built once at module load, so projection/path work is never repeated. */
export const COUNTRY_SHAPES = buildCountryShapes();

export const INTERACTIVE_SHAPES = new Map(
  COUNTRY_SHAPES.flatMap((shape) =>
    shape.interactiveKey ? [[shape.interactiveKey, shape] as const] : [],
  ),
);
