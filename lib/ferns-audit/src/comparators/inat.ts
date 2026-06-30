/**
 * iNaturalist audit comparator — REMOVED (acknowledged-source redirection)
 *
 * The iNat routes in the EC OpenAPI spec have been repointed to
 * https://api.inaturalist.org/v1 (path-level servers override). EC no longer
 * hosts the 17 iNat passthrough routes at /api/inat/... — they are now
 * documented as living on iNat's own server.
 *
 * As a result, the original comparator design (FERNS route vs. upstream iNat
 * API) cannot be executed: there is no FERNS-hosted endpoint to call on the
 * left-hand side of the diff.
 *
 * AUDIT COVERAGE GAP (documented per playbook requirement):
 * - What was covered: 18 EC-hosted iNat passthrough routes exercised via live
 *   HTTP calls; FERNS envelope shape, provenance block, source_url, and
 *   cache_status verified; response payloads diffed against direct iNat API
 *   calls for histogram, popular_field_values, places/autocomplete, and
 *   species_counts.
 * - What is now absent: no automated audit coverage for iNat data flow.
 * - What a future approach would look like: an MCP-layer audit that exercises
 *   the inaturalist.ts MCP tools directly, capturing the tool output and
 *   validating it against the Zod response schemas generated from the spec.
 *   This requires an audit harness that can invoke MCP tool handlers without
 *   a running REST server — a capability that does not yet exist in the audit
 *   framework and is explicitly out of scope for this task.
 *
 * The corpus entries for TEST_PLACES, TEST_PLACE_QUERIES, and inatTaxonId
 * fields on TEST_SPECIES are retained; they may be useful to a future
 * MCP-layer audit harness.
 */

import type { EndpointComparison } from "../types.js";

export async function runInatComparators(
  _fernsBase: string,
  _species: unknown[],
  _places: unknown[],
  _placeQueries: unknown[],
): Promise<EndpointComparison[]> {
  return [];
}
