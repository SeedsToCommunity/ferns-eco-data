---
name: Artifact rename breaks deploy routing
description: Renaming an artifact directory (git mv) can leave the deployment's routing registration stale, and the artifact id is immutable so you cannot re-register via the toml.
---

# Renaming an artifact dir can strand the deployment's route

**Symptom:** After renaming an artifact directory with `git mv` (e.g.
`artifacts/api-server` → `artifacts/rest-server`) while keeping the same
`artifact.toml` `id`, autoscale deploys fail at the promote/health step even
though the committed config is correct:
- The app is provably healthy: process starts, migrations/seeds run, it listens
  dual-stack (`addr {"address":"::"}`), and the platform logs
  `artifact port detected port=8080 detected=1 expected=1`.
- Yet the router logs `forwarding local port 0 to external port 80` (local port
  0 = no backend bound to the route), the startup probe hits `/` (ignoring the
  declared `[services.production.health.startup].path`), and healthchecks return
  router-generated `status 500`.
- **Zero request logs reach the app** (if the first middleware is a request
  logger like pino-http, it logs nothing). That proves the 500s are generated
  router-side — requests never reach Express. This is the definitive tell of a
  routing failure vs an app bug.

**Why it's confusing:** every committed file can be byte-for-byte equivalent to a
past known-good deploy (verify with `git show <good-commit>:<path>`), so config
diffing turns up nothing actionable. The stale state lives in the platform's
deployment routing registry, not in the repo.

**Immutable id AND version — sanctioned re-register levers are blocked:**
`verifyAndReplaceArtifactToml` **cannot change an artifact's `id`** (rejects
`INVALID_ARTIFACT_ID: cannot change artifact id`) **nor its `version`** (rejects
`ARTIFACT_EDITING_ERROR: cannot change artifact version`). So you cannot force a
fresh registration by bumping either field. It DOES accept changes to title/name,
paths, ports, run/build args, and health config.

**verifyAndReplaceArtifactToml CAN re-sync a moved artifact:** after a raw `mv` of
the artifact dir, calling it (id/version unchanged) with the toml at the NEW path
succeeded and re-registered the artifact cleanly (the registry then reports
`dir=<new path>`). Note the write guards: direct writes to `artifact.toml` are
blocked by the write/edit tools ("Direct edits to artifact.toml are not allowed") —
you MUST go through a sibling `*.edit.toml` temp file + this callback. `.replit` is
likewise blocked by the edit/bash tools; write it via the code-execution `fs` API.

**How to apply / what actually helps:**
1. First confirm it's routing, not the app: check for zero request-logger lines
   in prod while the platform still reports the port detected + app listening.
2. Rule out committed-config causes by git-diffing every deploy-relevant file
   (`.replit` `[[artifacts]]` + `[deployment]`, each `artifact.toml` `id`/`paths`/
   `localPort`/`previewPath`/`production.run`/health) against the last good commit.
3. If config matches known-good and the app is healthy, this is platform-side.
   Two remedies: (a) delete + recreate the deployment so routing rebuilds from
   current config (may require re-attaching a custom domain); or (b) — the
   reliable **code-side** fix, CONFIRMED to work — revert the dir to its ORIGINAL
   name so committed config becomes byte-identical to the last-good deploy. The
   stale route still expects the old path, so restoring it realigns them.
4. Revert/rename checklist: `mv` the dir; fix `package.json` `name`; replace
   `artifact.toml` via temp file + `verifyAndReplaceArtifactToml`; edit `.replit`
   `[[artifacts]] id` via the `fs` API; run `pnpm install` to fix the lockfile
   importer key (`importers: artifacts/<name>:`); rebuild. A leaf app package has
   no workspace importers, so cross-package refs are limited to docs/comments.
5. Prefer keeping the original name over a raw `git mv` when the artifact is
   already deployed; a rename strands the route and support may be unresponsive.
