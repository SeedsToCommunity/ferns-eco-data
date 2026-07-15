import app from "./app";
import { logger } from "./lib/logger";
import { runMigrations } from "@workspace/db/migrate";
import { ensureBonapRegistryEntry } from "./services/bonap/seed.js";
import { ensureGbifRegistryEntry } from "./services/gbif/seed.js";
import { ensureInatRegistryEntry } from "./services/inat/seed.js";
import { ensureMifloraRegistryEntry } from "./services/miflora/seed.js";
import { ensureCoefficientOfConservatismRegistryEntry } from "./services/coefficient-of-conservatism/seed.js";
import { ensureWetlandIndicatorStatusRegistryEntry } from "./services/wetland-indicator-status/seed.js";
import { ensureWucolsWaterUseRegistryEntry } from "./services/wucols-water-use/seed.js";
import { ensureS2CRegistryEntry } from "./services/s2c-mi-wash/seed.js";
import { ensureUniversalFqaRegistryEntry } from "./services/universal-fqa/seed.js";
import { ensureLcscgRegistryEntry } from "./services/lcscg/seed.js";
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
import { ensureSourceRelationships, ensureSourceRelationshipsRegistryEntry } from "./services/source-relationships/seed.js";
import { ensureAnnArborNpnRegistryEntry } from "./services/ann-arbor-npn/seed.js";
import { ensureWildTypeNativePlantsRegistryEntry } from "./services/wildtype-native-plants/seed.js";

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

async function main() {
  logger.info("Running database migrations...");
  await runMigrations();
  logger.info("Database migrations complete.");

  // Use Node's default host binding: it listens on the dual-stack IPv6
  // wildcard (::) when IPv6 is available (accepting both IPv6 and IPv4),
  // and falls back to 0.0.0.0 otherwise. The production application router
  // reaches the backend over the IPv6 loopback (::1), so an explicit
  // IPv4-only "0.0.0.0" bind makes the app unreachable and fails the health
  // check. This matches the last known-good production configuration.
  const server = app.listen(port, () => {
    const addr = server.address();
    logger.info({ port, addr }, "Server listening");

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

    const registrySeedLabels = [
      ["BONAP", ensureBonapRegistryEntry()],
      ["iNaturalist", ensureInatRegistryEntry()],
      ["Michigan Flora", ensureMifloraRegistryEntry()],
      ["Coefficient of Conservatism", ensureCoefficientOfConservatismRegistryEntry()],
      ["Wetland Indicator Status", ensureWetlandIndicatorStatusRegistryEntry()],
      ["WUCOLS", ensureWucolsWaterUseRegistryEntry()],
      ["GBIF", ensureGbifRegistryEntry()],
      ["Seeds to Community Washtenaw", ensureS2CRegistryEntry()],
      ["Universal FQA", ensureUniversalFqaRegistryEntry()],
      ["LCSCG", ensureLcscgRegistryEntry()],
      ["Go Botany", ensureGobotanyRegistryEntry()],
      ["Google Images", ensureGoogleImagesRegistryEntry()],
      ["Missouri Plants", ensureMissouriPlantsRegistryEntry()],
      ["Minnesota Wildflowers", ensureMinnesotaWildflowersRegistryEntry()],
      ["Illinois Wildflowers", ensureIllinoisWildflowersRegistryEntry()],
      ["Prairie Moon", ensurePrairieMoonRegistryEntry()],
      ["USDA PLANTS", ensureUsdaPlantsRegistryEntry()],
      ["Lady Bird Johnson", ensureLadyBirdJohnsonRegistryEntry()],
      ["Ann Arbor NPN", ensureAnnArborNpnRegistryEntry()],
      ["WildType Native Plants", ensureWildTypeNativePlantsRegistryEntry()],
      ["Source Relationships", ensureSourceRelationshipsRegistryEntry()],
    ] as const;

    Promise.allSettled(registrySeedLabels.map(([, p]) => p))
      .then((results) => {
        results.forEach((result, i) => {
          if (result.status === "rejected") {
            logger.error(
              { err: result.reason },
              `Failed to seed ${registrySeedLabels[i][0]} registry entry at startup`,
            );
          }
        });
        return ensureSourceRelationships();
      })
      .catch((err) => {
        logger.error({ err }, "Failed to seed source relationships at startup");
      });
  });

  server.on("error", (err) => {
    logger.error({ err }, "Server bind error");
    process.exit(1);
  });
}

main().catch((err) => {
  logger.error({ err }, "Fatal startup error");
  process.exit(1);
});
