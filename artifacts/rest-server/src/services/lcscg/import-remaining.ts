import { importLcscg } from "./import.js";

const REMAINING_GUIDES = [1276, 1277, 1278, 1279, 1280, 1281, 1282];

console.log(`Starting targeted import for guides: ${REMAINING_GUIDES.join(", ")}`);

importLcscg(REMAINING_GUIDES)
  .then(({ guidesUpserted, speciesUpserted }) => {
    console.log(`Import complete: ${guidesUpserted} guides, ${speciesUpserted} species upserted`);
    process.exit(0);
  })
  .catch((err) => {
    console.error("Import failed:", err);
    process.exit(1);
  });
