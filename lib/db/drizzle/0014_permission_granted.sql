-- Envelope Contract v1: per-source permission_granted column on ferns_sources.
-- Added by Task #166. See docs/data-layer-contract.md "Permission Rules".
--
-- `permission_granted` (boolean NOT NULL) — source-level most-restrictive summary
-- across all of the source's endpoints. buildEnvelope() reads this as the default
-- when no per-call permissionGranted is supplied. No column default is set — every
-- source must declare its own value explicitly in its seed.ts.

ALTER TABLE ferns_sources ADD COLUMN IF NOT EXISTS permission_granted boolean;

-- Backfill existing rows with true so NOT NULL constraint can be applied.
-- Seeds will overwrite with the correct per-source value on next startup.
UPDATE ferns_sources SET permission_granted = true WHERE permission_granted IS NULL;

ALTER TABLE ferns_sources ALTER COLUMN permission_granted SET NOT NULL;
