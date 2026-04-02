import app from "./app";
import { logger } from "./lib/logger";
import { ensureBonapRegistryEntry } from "./services/bonap/seed.js";
import { autoImportMnfiIfEmpty } from "./services/mnfi/seed.js";
import { ensureGbifRegistryEntry } from "./services/gbif/seed.js";
import { ensureInatRegistryEntry } from "./services/inat/seed.js";
import { ensureMifloraRegistryEntry } from "./services/miflora/seed.js";
import { ensureCoefficientRegistryEntry } from "./services/coefficient/seed.js";
import { ensureWetlandIndicatorRegistryEntry } from "./services/wetland-indicator/seed.js";
import { ensureWucolsRegistryEntry } from "./services/wucols/seed.js";
import { ensureS2CRegistryEntry } from "./services/s2c/seed.js";
import { ensureUniversalFqaRegistryEntry } from "./services/universal-fqa/seed.js";
import { ensureLcscgRegistryEntry, seedLcscgData } from "./services/lcscg/seed.js";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");

  ensureBonapRegistryEntry().catch((seedErr) => {
    logger.error({ err: seedErr }, "Failed to seed BONAP registry entry at startup");
  });

  ensureInatRegistryEntry().catch((seedErr) => {
    logger.error({ err: seedErr }, "Failed to seed iNaturalist registry entry at startup");
  });

  ensureMifloraRegistryEntry().catch((seedErr) => {
    logger.error({ err: seedErr }, "Failed to seed Michigan Flora registry entry at startup");
  });

  ensureCoefficientRegistryEntry().catch((seedErr) => {
    logger.error({ err: seedErr }, "Failed to seed Coefficient of Conservatism registry entry at startup");
  });

  ensureWetlandIndicatorRegistryEntry().catch((seedErr) => {
    logger.error({ err: seedErr }, "Failed to seed Wetland Indicator Status registry entry at startup");
  });

  ensureWucolsRegistryEntry().catch((seedErr) => {
    logger.error({ err: seedErr }, "Failed to seed WUCOLS registry entry at startup");
  });

  ensureGbifRegistryEntry().catch((seedErr) => {
    logger.error({ err: seedErr }, "Failed to seed GBIF registry entry at startup");
  });

  ensureS2CRegistryEntry().catch((seedErr) => {
    logger.error({ err: seedErr }, "Failed to seed Seeds to Community Washtenaw registry entry at startup");
  });

  ensureUniversalFqaRegistryEntry().catch((seedErr) => {
    logger.error({ err: seedErr }, "Failed to seed Universal FQA registry entry at startup");
  });

  autoImportMnfiIfEmpty(port).catch((err) => {
    logger.error({ err }, "MNFI auto-import check failed at startup");
  });

  ensureLcscgRegistryEntry().catch((seedErr) => {
    logger.error({ err: seedErr }, "Failed to seed LCSCG registry entry at startup");
  });

  seedLcscgData().catch((seedErr) => {
    logger.error({ err: seedErr }, "Failed to seed LCSCG data at startup");
  });
});
