// Only re-export ./generated/api (not ./generated/types) because orval generates
// both a zod-const (value) and a TS-type with the same name for every param type.
// Re-exporting both produces TS2308 "already exported" collisions. All types are
// available as zod.infer<typeof X> from the schemas exported here. All consumer
// packages verified clean (tsc --noEmit passes in api-client-react, api-server, etc.).
export * from "./generated/api";
