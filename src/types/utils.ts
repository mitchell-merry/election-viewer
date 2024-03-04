import { z, ZodSchema } from 'zod';

export type HexCode = `#${string}`;

export type Values<T> = T extends readonly (infer ArrVal)[] ? ArrVal : T[keyof T];

const matchesSchema = <Schema extends ZodSchema>(
  schema: Schema,
  value: unknown,
): value is z.infer<Schema> => {
  return schema.safeParse(value).success;
};

export const assertSchema: <Schema extends ZodSchema>(
  schema: Schema,
  value: unknown,
) => asserts value is z.infer<Schema> = <Schema extends ZodSchema>(
  schema: Schema,
  value: unknown,
): asserts value is z.infer<Schema> => {
  schema.parse(value);
};