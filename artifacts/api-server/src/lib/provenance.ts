export function filterProvenance(
  provenance: Record<string, unknown>,
  verbosity?: string,
): Record<string, unknown> {
  if (!verbosity || verbosity === "full") return provenance;
  const { general_summary, technical_details, ...rest } = provenance;
  if (verbosity === "summary") return { ...rest, general_summary };
  if (verbosity === "none") return rest;
  return provenance;
}
