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

  autoImportMnfiIfEmpty(port).catch((err) => {
    logger.error({ err }, "MNFI auto-import check failed at startup");
  });

  seedLcscgData().catch((seedErr) => {
    logger.error({ err: seedErr }, "Failed to seed LCSCG data at startup");
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

  Promise.all([
    ensureBonapRegistryEntry(),
    ensureInatRegistryEntry(),
    ensureMifloraRegistryEntry(),
    ensureCoefficientRegistryEntry(),
    ensureWetlandIndicatorRegistryEntry(),
    ensureWucolsRegistryEntry(),
    ensureGbifRegistryEntry(),
    ensureS2CRegistryEntry(),
    ensureUniversalFqaRegistryEntry(),
    ensureLcscgRegistryEntry(),
    ensureGobotanyRegistryEntry(),
    ensureGoogleImagesRegistryEntry(),
    ensureMissouriPlantsRegistryEntry(),
    ensureMinnesotaWildflowersRegistryEntry(),
    ensureIllinoisWildflowersRegistryEntry(),
    ensurePrairieMoonRegistryEntry(),
    ensureUsdaPlantsRegistryEntry(),
    ensureLadyBirdJohnsonRegistryEntry(),
  ])
    .then(() => ensureSourceRelationships())
    .catch((err) => {
      logger.error({ err }, "Failed to seed source relationships at startup");
    });
});
