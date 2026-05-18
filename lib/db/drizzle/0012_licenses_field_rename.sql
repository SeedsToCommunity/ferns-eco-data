-- Rename permission_granted (boolean) → licenses (text[]) and permission_status (text) → license_notes (text)
ALTER TABLE ferns_sources DROP COLUMN IF EXISTS permission_granted;
ALTER TABLE ferns_sources DROP COLUMN IF EXISTS permission_status;
ALTER TABLE ferns_sources ADD COLUMN IF NOT EXISTS licenses text[] NOT NULL DEFAULT '{}';
ALTER TABLE ferns_sources ADD COLUMN IF NOT EXISTS license_notes text NOT NULL DEFAULT '';
