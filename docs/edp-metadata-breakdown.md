## EDP Metadata Breakdown — Proposal

### The Problem

Every source's `metadata.ts` currently holds all metadata constants in one place — the Adapter's services directory. This conflates two distinct kinds of knowledge:

1. **Source facts** — everything known about the upstream source at research time: what it is, its license and rights terms, its website URL patterns, its attribution, how its data is structured and what the fields mean. These facts exist before any FERNS code is written and are determined by reading the upstream source's documentation and terms. The EDP is the only layer that speaks to the upstream and is therefore the natural owner of these facts.

2. **FERNS wiring** — what FERNS does on top: how the source is registered (`source_id`, `knowledge_type`, `status`), its caching policy, what FERNS has decided about permission, what non-passthrough endpoints exist. These facts are FERNS decisions, not upstream facts.

Additionally, the current `TECHNICAL_DETAILS` strings sometimes include internal implementation details — DB table names, column schemas — that belong to neither layer and should not appear in any user-facing metadata field.

The result is that a single file authored in the Adapter layer contains facts that only the EDP is qualified to state. When the upstream license terms change, or a field definition is clarified, you have to know to look in an Adapter file to update a fact about the upstream.

---

### The Proposed Breakdown

#### Layer 1 — The EDP exports all source facts

The EDP (`lib/external-data-providers/src/{source-id}/index.ts`) exports a typed `SOURCE_FACTS` constant containing everything that is known about the upstream source at research time — before FERNS wires it into a registry entry.

```typescript
export interface UniversalFqaSourceFacts {
  api_base: string;
  license: string;
  licenses: string[];
  license_notes: string;
  rights: string;
  attribution: {
    source_name: string;
    website: string;
    license: string;
    citation: string;
    api_base_url: string;
  };
  website_url_patterns: Record<string, string>;
  general_summary: string;
  upstream_technical_details: string;
}

export const UNIVERSAL_FQA_SOURCE_FACTS: UniversalFqaSourceFacts = {
  api_base: "http://universalfqa.org/get",
  license: "cc-by",
  licenses: ["cc-by"],
  license_notes: "...",
  rights: "...",
  attribution: {
    source_name: "Universal FQA Calculator",
    website: "https://universalfqa.org",
    license: "...",
    citation: "...",
    api_base_url: "http://universalfqa.org/get",
  },
  website_url_patterns: {
    database: "https://universalfqa.org/fqa/#/db/{id}",
    assessment: "https://universalfqa.org/fqa/#/inventory/{id}",
  },
  general_summary: `...`,
  upstream_technical_details: `...`,
};
```

**`api_base`** — the upstream's base URL. Already used privately inside the EDP fetch functions; exported here so the Adapter and attribution block don't duplicate it.

**`license` / `licenses` / `license_notes` / `rights`** — the upstream's access terms and rights statement, determined by reading the upstream's ToS at research time.

**`attribution`** — source name, website URL, citation string. All facts about the upstream, all known at research time.

**`website_url_patterns`** — URL templates for the upstream's companion website. Facts about the upstream's own website structure, independent of anything FERNS does.

**`general_summary`** — what the source is, who runs it, what data it holds, geographic and taxonomic scope, what a query returns in plain terms, known upstream limitations. Authored once in the EDP and imported wherever it is needed.

**`upstream_technical_details`** — endpoint paths and response shapes, field definitions (types, observed values, edge cases), known upstream data quirks, structural idiosyncrasies. Does **not** describe anything FERNS does — no caching, no DB tables, no FERNS error handling.

#### Layer 2 — The Adapter adds FERNS wiring and adapter notes

The Adapter's `metadata.ts` imports `SOURCE_FACTS` from the EDP and adds only what FERNS contributes:

```typescript
import { UNIVERSAL_FQA_SOURCE_FACTS } from "@workspace/external-data-providers/universal-fqa";

// The only thing authored here: FERNS caching behavior
const ADAPTER_NOTES =
  "CACHING: Species databases are cached to PostgreSQL on first fetch and " +
  "reused for all subsequent requests (no TTL; data is static per publication year). " +
  "Assessment lists and individual assessments are fetched live per request — not cached.";

// Composed from EDP facts + adapter behavior
const UNIVERSAL_FQA_TECHNICAL_DETAILS =
  UNIVERSAL_FQA_SOURCE_FACTS.upstream_technical_details + "\n\n" + ADAPTER_NOTES;

// Registry entry: EDP facts slotted into FERNS structure
export const UNIVERSAL_FQA_REGISTRY_ENTRY = {
  source_id: "universal-fqa",           // FERNS decision
  knowledge_type: "source_wrapper",     // FERNS decision
  status: "live",                       // FERNS decision
  permission_granted: true,             // FERNS decision
  non_passthrough_endpoints: [...],     // FERNS decision
  dependencies: [],                     // FERNS decision

  // Everything below: imported from EDP, not re-authored here
  license: UNIVERSAL_FQA_SOURCE_FACTS.license,
  licenses: UNIVERSAL_FQA_SOURCE_FACTS.licenses,
  license_notes: UNIVERSAL_FQA_SOURCE_FACTS.license_notes,
  rights: UNIVERSAL_FQA_SOURCE_FACTS.rights,
  website_url_patterns: UNIVERSAL_FQA_SOURCE_FACTS.website_url_patterns,
  general_summary: UNIVERSAL_FQA_SOURCE_FACTS.general_summary,
  technical_details: UNIVERSAL_FQA_TECHNICAL_DETAILS,
};
```

The Adapter's `metadata.ts` is now strictly **FERNS wiring**: it assigns `source_id`, `knowledge_type`, `status`, `permission_granted`, `non_passthrough_endpoints`, and adds `ADAPTER_NOTES`. It does not re-author any fact about the upstream.

#### What moves out of both layers

DB table names, column schemas, and column descriptions are internal implementation details of the caching layer. They are not facts about the upstream and not facts about FERNS behavior as a user would understand it. They are removed from both strings entirely. A developer who needs the DB schema reads `lib/db/src/schema/`.

---

### Concrete file structure after migration

```
lib/external-data-providers/src/{source-id}/index.ts
  exports: fetch functions, result types, error class
  exports: SOURCE_FACTS { api_base, license, licenses, license_notes, rights,
                          attribution, website_url_patterns,
                          general_summary, upstream_technical_details }

artifacts/rest-server/src/services/{source-id}/metadata.ts
  imports: SOURCE_FACTS from @workspace/external-data-providers/{source-id}
  authors: ADAPTER_NOTES (caching policy — the only thing written here)
  composes: TECHNICAL_DETAILS = upstream_technical_details + ADAPTER_NOTES
  defines: REGISTRY_ENTRY (FERNS wiring: source_id, knowledge_type, status,
                            permission_granted, non_passthrough_endpoints)
           slotting in SOURCE_FACTS fields without re-authoring them
```

---

### Ownership test

Before writing any constant, ask: *was this fact determined by reading the upstream source, or by a FERNS decision?*

| Constant | Determined by | Lives in |
|---|---|---|
| `api_base` | Reading the upstream docs | EDP `SOURCE_FACTS` |
| `license` / `rights` / `attribution` | Reading the upstream ToS | EDP `SOURCE_FACTS` |
| `website_url_patterns` | Reading the upstream website | EDP `SOURCE_FACTS` |
| `general_summary` | Researching the upstream source | EDP `SOURCE_FACTS` |
| `upstream_technical_details` | Reading the upstream API | EDP `SOURCE_FACTS` |
| `adapter_notes` (caching) | FERNS Adapter implementation | Adapter `metadata.ts` |
| `source_id` | FERNS naming decision | Adapter `metadata.ts` |
| `knowledge_type` / `status` | FERNS registry decision | Adapter `metadata.ts` |
| `permission_granted` | FERNS permission decision | Adapter `metadata.ts` |
| `non_passthrough_endpoints` | FERNS route audit decision | Adapter `metadata.ts` |
| DB table names / column schemas | Internal implementation | Neither — not user-facing |

---

### Scope of this proposal

This breakdown applies to **External Data Providers** only — sources in `lib/external-data-providers/`. Internal Data Providers (`lib/internal-data-providers/`) have no upstream to research; their metadata stays entirely in the Adapter's `metadata.ts`.

Sources that do not yet have an EDP layer (those still using the pre-EDP `client.ts` pattern) continue with the current single-file approach until their EDP migration task runs. The breakdown is adopted at migration time, not retrofitted before.

---

### Migration path

1. When a source's EDP is created (as part of its Adapter & DB Migration task), the author moves all upstream facts into `SOURCE_FACTS` in the EDP, strips DB internals from both strings, authors `ADAPTER_NOTES` in `metadata.ts`, and composes the final `TECHNICAL_DETAILS` there.
2. The Adapter's `metadata.ts` becomes a thin wiring file: it imports `SOURCE_FACTS`, adds `ADAPTER_NOTES`, and assembles the registry entry from FERNS decisions + imported facts.
3. The source onboarding playbook Step 5 is updated to reflect the new authorship rule: `SOURCE_FACTS` (including descriptions, license, rights, attribution, URL patterns) is written in the EDP; `ADAPTER_NOTES` and registry wiring are written in the Adapter.
4. No mechanical migration of existing sources is required before those sources reach their EDP task.
