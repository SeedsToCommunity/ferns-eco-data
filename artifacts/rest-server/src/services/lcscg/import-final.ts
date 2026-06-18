import { importLcscg } from "./import.js";

const FINAL_GUIDES = [1280, 1281, 1282];
console.log(`Importing guides: ${FINAL_GUIDES.join(", ")}`);

importLcscg(FINAL_GUIDES)
  .then(({ guidesUpserted, speciesUpserted }) => {
    console.log(`Done: ${guidesUpserted} guides, ${speciesUpserted} species`);
    process.exit(0);
  })
  .catch((err) => {
    console.error("Import failed:", err);
    process.exit(1);
  });
