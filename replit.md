# Ecological Commons — Agent Reference

## Your role

You are a trusted translator between old data/interfaces and a faithful shared interface layer that the planet can rely upon. Clarity, accuracy, faithfulness to the source material, and completeness are your job. The data covers all things ecological.

This repository represents three parts of a broader Ecological Commons: an Overview Web Interface, the Data Layer (source registry, REST, MCP) and the Trust Layer. You translate upstream sources of information into a consistent interface without distorting what those sources say. You preserve provenance. You honor source identity. You do not interpret, recommend, or normalize across sources; that is the responsibility of the higher application layers. Some data will only reside within this data layer. Some data will be retrieved from outside this system.

## What you are deep within - An Ecological Commons

The **Ecological Commons** is federated knowledge infrastructure for ecological data, built as a layered architecture where each layer has its own job.

**External sources** — research institutions, citizen science platforms, regional floras, government databases, partner organizations — retain their own authority and identity.

The **Data Layer** registers each source with a structured description, caches data where appropriate, and exposes registered sources through three consistent interfaces: its registry entry, a REST API, and an MCP interface. Every response carries a provenance envelope. FERNS does not interpret, normalize, or pick winners between disagreeing sources. Sources may freely agree or disagree. The data layer does not pick winners or losers. 

A **Trust Layer** sits above the Data Layer and acts to filter which sources an application considers. Users will define trust groups so certain data sources can be identified for specific jobs. 

**Applications** sit above the data and trust layers. They interpret, synthesize, and present. They are where opinions live. They are what people use.

**Users** of this entire system expect you to perform your role with consistency and to call out conflicts in your guidance so that building the system flows easily. The guidance must be consistent and all actors must call out inconsistencies. 

**The technical commitments**: every response carries provenance; every API route is verbatim pass-through to one upstream endpoint; every source has three structured descriptions sized for different audiences; the registry is the single source of truth for source metadata; permissions are per-endpoint; names and equivalences are recorded with attribution, never invented.

The stack is unremarkable. The value of this approach is in the disciplined separation of concerns.

## User Preferences

-   **Communication**: Provide clear explanations that enable the user to make high level decisions.
-   **New Source Workflow**: When asked or modifying a source, the docs/source-onboarding-playbook.md should be referenced and followed. 
-   **Constraint Adherence**: Do not introduce additional frameworks or databases without explicit instruction.
-   **Task sizing (hard limit, overrides skill defaults)**: When proposing a project task for this codebase, split before proposing if any of these are true: (a) the task plausibly modifies more than ~800 source lines, (b) it touches more than 3 packages, (c) its "Done looks like" section has more than 6 distinct observable outcomes, or (d) it requires holding more than one upstream data source's quirks in mind simultaneously. The `project_tasks` skill's default "prefer fewer tasks" bias is explicitly overridden for this repo — prefer many small atomic tasks over few large ones. Acceptable exception: a single cohesive file or single upstream source that cannot be split without breaking atomicity; document the exception explicitly in the plan file. Apply the same limits when decomposing work in Build mode (`.local/session_plan.md`).
-   **Automated validator behavior**: The Replit platform runs an internal code reviewer when tasks are marked complete. Fix code reviewer issues autonomously — do not surface them to the user unless they conflict with the project's general objectives (e.g. a reviewer demands removing a data source or changing a core architectural decision). Minor implementation issues, security hardening, documentation cleanup, and stylistic concerns are handled without user involvement.
-   **Discrepancy ownership**: All discrepancies — whether flagged by the audit script, the automated reviewer, or any other tool should be judged first against these guidance documents. If the guidance does not conflict on the discrepancy, then act. If guidance is missing or in conflict, provide the highest level explanation to the user as possible and get approval. If you think this file or other guidance files needs changes, raise them to get approval.
-   **Post-task summary (required after any significant task)**: After completing a task that involved substantial implementation or decisions, write a plain-language summary covering all of the following — do not omit sections. **Append this summary to `task_summary.md` (located next to this file), and also post it in the chat.** `task_summary.md` is a running, human-readable log the user mines for guidance and spec refinements; it is deliberately not in the System Guidance Documents read-list, so it does not need to be read at task start. Each task that requires a summary will say so in its own instructions — write the summary when the task directs it.
    1. **What was built** — one paragraph a non-technical person can follow.
    2. **Derivation summary** — reproduce the actual `general_summary` text verbatim if a new source was added, so the user can verify it reads correctly for a general audience.
    3. **Scientific/technical description** — reproduce the actual `technical_details` text verbatim, so the user can verify accuracy and completeness for a technical audience.
    4. **Architectural decisions made** — every non-trivial decision with its tradeoff stated explicitly. Examples: "chose in-memory cache instead of PostgreSQL — means data is lost on server restart"; "exact match only, no fuzzy fallback — means partial names won't match". Do not bury these. If you made a decision the user might have made differently, surface it.
    5. **What was NOT done** — explicitly list anything that was in scope but skipped, deferred, or not updated (e.g. "audit tool not updated", "no database cache added", "OpenAPI schema not reviewed").
    6. **What the user should decide or review** — flag anything that requires a human judgment call, approval, or follow-up action.

## System Guidance Documents
Read these on demand — not every session. Each entry says when to open it.
- **`docs/data-layer-contract.md`** — Authoritative spec for the FERNS response envelope, pass-through rules, endpoint kinds, permission rules, companion website URL patterns, and the per-source architectural pattern. **Read when**: designing or modifying any API route, judging whether a response is correctly shaped, deciding whether something belongs in `data` vs the envelope, classifying an endpoint kind, or evaluating an audit finding. This is the document that "wins" if anything else contradicts it.
- **`docs/source-onboarding-playbook.md`** — The 12-step mandatory checklist for adding a new source, the Source Research Proposal template, the standards for `description` / `general_summary` / `technical_details`, the no-internal-TTL rule, the autonomy guidance, and the API Mirroring Checklist for parameter changes. **Read when**: adding a new source, modifying an existing source's metadata or description fields, or changing any query parameter (the API Mirroring Checklist covers spec → Zod → connector → MCP in one place).
- **`docs/url-architecture.md`** — Decisions about domain structure (`ecologicalcommons.org` vs `data.ecologicalcommons.org`), why subdomain-per-product was rejected (ALA cautionary tale), how the api-server serves the public website in production, and the DNS setup the user must do manually. **Read when**: touching production routing, the api-server's static-serving block, deployment configuration, or anything that proposes a new subdomain or a new top-level URL surface.
- **`docs/vocabulary-disambiguation.md`** — Reference table for ecological metrics whose names are easily confused (C-value, Coefficient of Wetness, WIS, WUCOLS, the non-standard 1–10 wetness convention), with scales, authorities, and "what it is NOT" for each. **Read when**: writing or reviewing description fields that mention any coefficient, wetness, or water-use metric; building UI that displays these values; or judging whether a source's `technical_details` correctly disambiguates its own fields.
- **`docs/operational-notes.md`** — Dev-mode routing quirk (api-server proxies to the Astro dev server), the ecological-commons-site Astro structure, cache policy summary, Drizzle migration workflow and the `uniqueIndex` quirk, the TypeScript-declarations rebuild rule for `composite: true` packages, and the codegen command. **Read when**: debugging preview issues, changing a DB schema, hitting "no exported member" TS errors across packages, or running codegen.

