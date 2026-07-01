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

**Immutable id — the sanctioned re-register lever is blocked:**
`verifyAndReplaceArtifactToml` **cannot change an artifact's `id`** — it rejects
with `INVALID_ARTIFACT_ID: verifyAndReplaceArtifactToml cannot change artifact
id`. So you cannot force a fresh registration by rewriting the id. (The fact that
the callback already knows the id also confirms the platform registry has the
artifact correctly identified — the desync is specifically in the deployment's
route→port binding.)

**How to apply / what actually helps:**
1. First confirm it's routing, not the app: check for zero request-logger lines
   in prod while the platform still reports the port detected + app listening.
2. Rule out committed-config causes by git-diffing every deploy-relevant file
   (`.replit` `[[artifacts]]` + `[deployment]`, each `artifact.toml` `id`/`paths`/
   `localPort`/`previewPath`/`production.run`/health) against the last good commit.
3. If config matches known-good and the app is healthy, this is platform-side.
   The remedies are user/support actions, not code: have the user delete and
   recreate the deployment so routing is rebuilt from current config (note: a
   custom domain attached to the deployment may need re-attaching), or contact
   Replit support to purge/re-sync the artifact routing registration for the repl.
4. Prefer renaming an artifact via a sanctioned move (recreate + migrate) over a
   raw `git mv` when the artifact is already deployed, to avoid stranding the route.
