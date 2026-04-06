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
import { ensureGobotanyRegistryEntry } from "./services/gobotany/seed.js";
import { ensureGoogleImagesRegistryEntry } from "./services/google-images/seed.js";
import { ensureMissouriPlantsRegistryEntry } from "./services/missouri-plants/seed.js";
import { ensureMinnesotaWildflowersRegistryEntry } from "./services/minnesota-wildflowers/seed.js";
import { ensureIllinoisWildflowersRegistryEntry } from "./services/illinois-wildflowers/seed.js";
import { ensurePrairieMoonRegistryEntry } from "./services/prairie-moon/seed.js";
import { ensureUsdaPlantsRegistryEntry } from "./services/usda-plants/seed.js";
import { ensureLadyBirdJohnsonRegistryEntry } from "./services/lady-bird-johnson/seed.js";
import { autoImportMissouriPlantsIfEmpty } from "./services/botanical-refs/importers/missouri-plants.js";
import { autoImportMinnesotaWildflowersIfEmpty } from "./services/botanical-refs/importers/minnesota-wildflowers.js";
import { autoImportIllinoisWildflowersIfEmpty } from "./services/botanical-refs/importers/illinois-wildflowers.js";
import { autoImportPrairieMoonIfEmpty } from "./services/botanical-refs/importers/prairie-moon.js";
import { ensureSourceRelationships } from "./services/source-relationships/seed.js";

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

  ensureGobotanyRegistryEntry().catch((seedErr) => {
    logger.error({ err: seedErr }, "Failed to seed Go Botany registry entry at startup");
  });

  ensureGoogleImagesRegistryEntry().catch((seedErr) => {
    logger.error({ err: seedErr }, "Failed to seed Google Images registry entry at startup");
  });

  ensureMissouriPlantsRegistryEntry().catch((seedErr) => {
    logger.error({ err: seedErr }, "Failed to seed Missouri Plants registry entry at startup");
  });

  ensureMinnesotaWildflowersRegistryEntry().catch((seedErr) => {
    logger.error({ err: seedErr }, "Failed to seed Minnesota Wildflowers registry entry at startup");
  });

  ensureIllinoisWildflowersRegistryEntry().catch((seedErr) => {
    logger.error({ err: seedErr }, "Failed to seed Illinois Wildflowers registry entry at startup");
  });

  ensurePrairieMoonRegistryEntry().catch((seedErr) => {
    logger.error({ err: seedErr }, "Failed to seed Prairie Moon registry entry at startup");
  });

  ensureUsdaPlantsRegistryEntry().catch((seedErr) => {
    logger.error({ err: seedErr }, "Failed to seed USDA PLANTS registry entry at startup");
  });

  ensureLadyBirdJohnsonRegistryEntry().catch((seedErr) => {
    logger.error({ err: seedErr }, "Failed to seed Lady Bird Johnson registry entry at startup");
  });

  autoImportMissouriPlantsIfEmpty().catch((err) => {
    logger.error({ err }, "Missouri Plants auto-import check failed at startup");
  });

  autoImportMinnesotaWildflowersIfEmpty().catch((err) => {
    logger.error({ err }, "Minnesota Wildflowers auto-import check failed at startup");
  });

  autoImportIllinoisWildflowersIfEmpty().catch((err) => {
    logger.error({ err }, "Illinois Wildflowers auto-import check failed at startup");
  });

  autoImportPrairieMoonIfEmpty().catch((err) => {
    logger.error({ err }, "Prairie Moon auto-import check failed at startup");
  });

  ensureSourceRelationships().catch((err) => {
    logger.error({ err }, "Failed to seed source relationships at startup");
  });
});
