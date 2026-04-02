export interface MnfiCommunityRecord {
  community_id: number;
  slug: string;
  name: string;
  community_class: string;
  community_group: string;
  global_rank: string;
  state_rank: string;
  mnfi_url: string;
  county_map_url: string;
}

const BASE = "https://mnfi.anr.msu.edu";

function community(
  id: number,
  slug: string,
  name: string,
  cls: string,
  grp: string,
  g: string,
  s: string,
): MnfiCommunityRecord {
  return {
    community_id: id,
    slug,
    name,
    community_class: cls,
    community_group: grp,
    global_rank: g,
    state_rank: s,
    mnfi_url: `${BASE}/communities/description/${id}/${slug}`,
    county_map_url: `${BASE}/community-maps/County_${id}.png`,
  };
}

export const MNFI_COMMUNITIES: MnfiCommunityRecord[] = [
  // ─── Palustrine Class — Bog Group ────────────────────────────────
  community(10666, "bog", "Bog", "Palustrine", "Bog Group", "G3G5", "S4"),
  community(10678, "muskeg", "Muskeg", "Palustrine", "Bog Group", "G4G5", "S3"),

  // ─── Palustrine Class — Fen Group ────────────────────────────────
  community(19006, "coastal-fen", "Coastal Fen", "Palustrine", "Fen Group", "G1G2", "S2"),
  community(10673, "northern-fen", "Northern Fen", "Palustrine", "Fen Group", "G3", "S3"),
  community(10669, "patterned-fen", "Patterned Fen", "Palustrine", "Fen Group", "GU", "S2"),
  community(10662, "poor-fen", "Poor Fen", "Palustrine", "Fen Group", "G3", "S3"),
  community(10667, "prairie-fen", "Prairie Fen", "Palustrine", "Fen Group", "G3", "S3"),

  // ─── Palustrine Class — Forested Wetland Group ───────────────────
  community(10658, "floodplain-forest", "Floodplain Forest", "Palustrine", "Forested Wetland Group", "G3?", "S3"),
  community(10656, "hardwood-conifer-swamp", "Hardwood-Conifer Swamp", "Palustrine", "Forested Wetland Group", "G4", "S3"),
  community(10659, "northern-hardwood-swamp", "Northern Hardwood Swamp", "Palustrine", "Forested Wetland Group", "G4", "S3"),
  community(10653, "poor-conifer-swamp", "Poor Conifer Swamp", "Palustrine", "Forested Wetland Group", "G4", "S4"),
  community(10652, "rich-conifer-swamp", "Rich Conifer Swamp", "Palustrine", "Forested Wetland Group", "G4", "S3"),
  community(10660, "rich-tamarack-swamp", "Rich Tamarack Swamp", "Palustrine", "Forested Wetland Group", "G4", "S3"),
  community(10655, "southern-hardwood-swamp", "Southern Hardwood Swamp", "Palustrine", "Forested Wetland Group", "G3", "S3"),
  community(19009, "wet-mesic-flatwoods", "Wet-mesic Flatwoods", "Palustrine", "Forested Wetland Group", "G2G3", "S2"),

  // ─── Palustrine Class — Marsh Group ──────────────────────────────
  community(10670, "coastal-plain-marsh", "Coastal Plain Marsh", "Palustrine", "Marsh Group", "G2", "S2"),
  community(10654, "emergent-marsh", "Emergent Marsh", "Palustrine", "Marsh Group", "GU", "S4"),
  community(10671, "great-lakes-marsh", "Great Lakes Marsh", "Palustrine", "Marsh Group", "G2", "S3"),
  community(10664, "inland-salt-marsh", "Inland Salt Marsh", "Palustrine", "Marsh Group", "G1", "S1"),
  community(10668, "interdunal-wetland", "Interdunal Wetland", "Palustrine", "Marsh Group", "G2?", "S2"),
  community(10661, "intermittent-wetland", "Intermittent Wetland", "Palustrine", "Marsh Group", "G2", "S3"),
  community(10663, "northern-wet-meadow", "Northern Wet Meadow", "Palustrine", "Marsh Group", "G4G5", "S4"),
  community(10657, "southern-wet-meadow", "Southern Wet Meadow", "Palustrine", "Marsh Group", "G4?", "S3"),
  community(10651, "submergent-marsh", "Submergent Marsh", "Palustrine", "Marsh Group", "GU", "S4"),

  // ─── Palustrine Class — Shrub Wetland Group ───────────────────────
  community(10680, "inundated-shrub-swamp", "Inundated Shrub Swamp", "Palustrine", "Shrub Wetland Group", "G4", "S3"),
  community(10677, "northern-shrub-thicket", "Northern Shrub Thicket", "Palustrine", "Shrub Wetland Group", "G4", "S5"),
  community(10676, "southern-shrub-carr", "Southern Shrub-carr", "Palustrine", "Shrub Wetland Group", "GU", "S4"),

  // ─── Palustrine Class — Wet Prairie Group ────────────────────────
  community(10672, "lakeplain-wet-prairie", "Lakeplain Wet Prairie", "Palustrine", "Wet Prairie Group", "G2", "S1"),
  community(10675, "lakeplain-wet-mesic-prairie", "Lakeplain Wet-mesic Prairie", "Palustrine", "Wet Prairie Group", "G1?", "S1"),
  community(10665, "wet-prairie", "Wet Prairie", "Palustrine", "Wet Prairie Group", "G3", "S1"),
  community(10674, "wet-mesic-prairie", "Wet-mesic Prairie", "Palustrine", "Wet Prairie Group", "G2", "S1"),
  community(10682, "wet-mesic-sand-prairie", "Wet-mesic Sand Prairie", "Palustrine", "Wet Prairie Group", "G2G3", "S2"),

  // ─── Palustrine/Terrestrial Class ────────────────────────────────
  community(10679, "wooded-dune-and-swale-complex", "Wooded Dune and Swale Complex", "Palustrine/Terrestrial", "Wooded Dune and Swale Group", "G3", "S3"),

  // ─── Primary Class — Bedrock Glade Group ─────────────────────────
  community(15978, "granite-bedrock-glade", "Granite Bedrock Glade", "Primary", "Bedrock Glade Group", "G3G5", "S2"),
  community(15983, "limestone-bedrock-glade", "Limestone Bedrock Glade", "Primary", "Bedrock Glade Group", "G2G4", "S2"),
  community(10695, "northern-bald", "Northern Bald", "Primary", "Bedrock Glade Group", "GU", "S1"),
  community(10715, "volcanic-bedrock-glade", "Volcanic Bedrock Glade", "Primary", "Bedrock Glade Group", "GU", "S2"),

  // ─── Primary Class — Bedrock Grassland Group ─────────────────────
  community(10702, "alvar", "Alvar", "Primary", "Bedrock Grassland Group", "G2?", "S1"),

  // ─── Primary Class — Bedrock Lakeshore Group ─────────────────────
  community(15989, "granite-bedrock-lakeshore", "Granite Bedrock Lakeshore", "Primary", "Bedrock Lakeshore Group", "G4G5", "S2"),
  community(10717, "limestone-bedrock-lakeshore", "Limestone Bedrock Lakeshore", "Primary", "Bedrock Lakeshore Group", "G3", "S2"),
  community(18988, "sandstone-bedrock-lakeshore", "Sandstone Bedrock Lakeshore", "Primary", "Bedrock Lakeshore Group", "G4G5", "S2"),
  community(10716, "volcanic-bedrock-lakeshore", "Volcanic Bedrock Lakeshore", "Primary", "Bedrock Lakeshore Group", "G4G5", "S2"),

  // ─── Primary Class — Dunes Group ─────────────────────────────────
  community(10712, "great-lakes-barrens", "Great Lakes Barrens", "Primary", "Dunes Group", "G3", "S2"),
  community(10699, "open-dunes", "Open Dunes", "Primary", "Dunes Group", "G3", "S3"),

  // ─── Primary Class — Inland Cliff Group ──────────────────────────
  community(10706, "granite-cliff", "Granite Cliff", "Primary", "Inland Cliff Group", "G4G5", "S2"),
  community(10703, "limestone-cliff", "Limestone Cliff", "Primary", "Inland Cliff Group", "G4G5", "S2"),
  community(18997, "sandstone-cliff", "Sandstone Cliff", "Primary", "Inland Cliff Group", "G4G5", "S2"),
  community(19000, "volcanic-cliff", "Volcanic Cliff", "Primary", "Inland Cliff Group", "G4G5", "S2"),

  // ─── Primary Class — Lakeshore Cliff/Bluff Group ─────────────────
  community(19926, "clay-bluff", "Clay Bluff", "Primary", "Lakeshore Cliff/Bluff Group", "GNR", "S2"),
  community(19003, "granite-lakeshore-cliff", "Granite Lakeshore Cliff", "Primary", "Lakeshore Cliff/Bluff Group", "GU", "S1"),
  community(18991, "limestone-lakeshore-cliff", "Limestone Lakeshore Cliff", "Primary", "Lakeshore Cliff/Bluff Group", "G4G5", "S1"),
  community(10719, "sandstone-lakeshore-cliff", "Sandstone Lakeshore Cliff", "Primary", "Lakeshore Cliff/Bluff Group", "G3", "S2"),
  community(10723, "volcanic-lakeshore-cliff", "Volcanic Lakeshore Cliff", "Primary", "Lakeshore Cliff/Bluff Group", "GU", "S1"),

  // ─── Primary Class — Sand/Cobble Shore Group ──────────────────────
  community(18982, "limestone-cobble-shore", "Limestone Cobble Shore", "Primary", "Sand/Cobble Shore Group", "G2G3", "S3"),
  community(10714, "sand-and-gravel-beach", "Sand and Gravel Beach", "Primary", "Sand/Cobble Shore Group", "G3?", "S3"),
  community(18985, "sandstone-cobble-shore", "Sandstone Cobble Shore", "Primary", "Sand/Cobble Shore Group", "G2G3", "S2"),
  community(18994, "volcanic-cobble-shore", "Volcanic Cobble Shore", "Primary", "Sand/Cobble Shore Group", "G4G5", "S3"),

  // ─── Subterranean/Sink Class — Karst Group ────────────────────────
  community(10683, "cave", "Cave", "Subterranean/Sink", "Karst Group", "G4?", "S1"),
  community(10707, "sinkhole", "Sinkhole", "Subterranean/Sink", "Karst Group", "G3G5", "S2"),

  // ─── Terrestrial Class — Forest Group ────────────────────────────
  community(10690, "boreal-forest", "Boreal Forest", "Terrestrial", "Forest Group", "GU", "S3"),
  community(10689, "dry-northern-forest", "Dry Northern Forest", "Terrestrial", "Forest Group", "G3?", "S3"),
  community(10686, "dry-southern-forest", "Dry Southern Forest", "Terrestrial", "Forest Group", "G4", "S3"),
  community(10688, "dry-mesic-northern-forest", "Dry-mesic Northern Forest", "Terrestrial", "Forest Group", "G4", "S3"),
  community(10685, "dry-mesic-southern-forest", "Dry-mesic Southern Forest", "Terrestrial", "Forest Group", "G4", "S3"),
  community(10687, "mesic-northern-forest", "Mesic Northern Forest", "Terrestrial", "Forest Group", "G4", "S3"),
  community(10684, "mesic-southern-forest", "Mesic Southern Forest", "Terrestrial", "Forest Group", "G2G3", "S3"),

  // ─── Terrestrial Class — Prairie Group ───────────────────────────
  community(10698, "dry-sand-prairie", "Dry Sand Prairie", "Terrestrial", "Prairie Group", "G3", "S2"),
  community(10708, "dry-mesic-prairie", "Dry-mesic Prairie", "Terrestrial", "Prairie Group", "G3", "S1"),
  community(10709, "hillside-prairie", "Hillside Prairie", "Terrestrial", "Prairie Group", "G3", "S1"),
  community(10697, "mesic-prairie", "Mesic Prairie", "Terrestrial", "Prairie Group", "G2", "S1"),
  community(10696, "mesic-sand-prairie", "Mesic Sand Prairie", "Terrestrial", "Prairie Group", "G2", "S1"),

  // ─── Terrestrial Class — Savanna Group ───────────────────────────
  community(10713, "bur-oak-plains", "Bur Oak Plains", "Terrestrial", "Savanna Group", "G1SX", "SX"),
  community(10710, "lakeplain-oak-openings", "Lakeplain Oak Openings", "Terrestrial", "Savanna Group", "G2?", "S1"),
  community(10693, "oak-barrens", "Oak Barrens", "Terrestrial", "Savanna Group", "G2?", "S1"),
  community(10691, "oak-openings", "Oak Openings", "Terrestrial", "Savanna Group", "G1", "S1"),
  community(10692, "oak-pine-barrens", "Oak-Pine Barrens", "Terrestrial", "Savanna Group", "G3", "S2"),
  community(10694, "pine-barrens", "Pine Barrens", "Terrestrial", "Savanna Group", "G3", "S2"),
];
