import { z, ZodType } from 'zod';
import type { GeoJSON } from 'geojson';

export const MapMetadataSchema = z.object(
  {
    name: z.string(),
  },
  {
    description: 'Information about our map.',
  },
);

export const PositionSchema = z.union([
  z.tuple([z.number(), z.number()]),
  z.tuple([z.number(), z.number(), z.number()]),
]) satisfies ZodType<GeoJSON.Position>;

export const PolygonGeometrySchema = z.object({
  type: z.literal('Polygon'),
  coordinates: PositionSchema.array().array(),
}) satisfies ZodType<GeoJSON.Polygon>;

export const MultiPolygonGeometrySchema = z.object({
  type: z.literal('MultiPolygon'),
  coordinates: PositionSchema.array().array().array(),
}) satisfies ZodType<GeoJSON.MultiPolygon>;

export const FeaturePropertiesSchema = z.object({
  name: z.string(),
});

export const FeatureSchema = z.object({
  type: z.literal('Feature'),
  properties: FeaturePropertiesSchema,
  geometry: z.union([PolygonGeometrySchema, MultiPolygonGeometrySchema]),
});

export const MapSchema = z.object({
  type: z.literal('FeatureCollection'),
  metadata: MapMetadataSchema,
  features: FeatureSchema.array(),
}) satisfies z.ZodType<
  GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon>
>;

export type Map = z.infer<typeof MapSchema>;
