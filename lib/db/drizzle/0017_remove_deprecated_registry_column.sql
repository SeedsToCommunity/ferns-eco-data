-- Drop the deprecated registry column that pointed to the removed registry explorer UI.
-- The registry explorer has been removed and this field is no longer meaningful.
ALTER TABLE "ferns_sources" DROP COLUMN IF EXISTS "explorer_url";
