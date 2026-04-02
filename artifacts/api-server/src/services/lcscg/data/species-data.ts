export interface LcscgSpeciesRecord {
    guide_id: number;
    species_id: string;
    scientific_name: string;
    common_name: string;
    family: string;
    photo_date: string;
    description: string;
    seed_group_names: string[];
    seed_group_details: Array<{ name: string; description: string; images: string[] }>;
    image_filenames: string[];
    image_urls: (string | null)[];
    page_number: number;
  }

  export const LCSCG_SPECIES: LcscgSpeciesRecord[] = [
  {
    "guide_id": 1271,
    "species_id": "sp_1",
    "scientific_name": "Krigia biflora",
    "common_name": "False Dandelion",
    "family": "Asteraceae",
    "photo_date": "6-25-20",
    "description": "Fluffy. This flower blooms with an orange-yellow flower, closer to tang-orange than the yellow of dandelions. Leaves are unique: the stem leaves broadly clasp the stem and are echoed in a smaller form under the flower stalks. Two (or more) flowers per stem. Grows in sandy habitats, savannas and their associated prairies.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "krigia_biflora_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p3_1.png",
      "krigia_biflora_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p3_2.png",
      "krigia_biflora_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p3_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858464/krigia_biflora_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p3_1_azyfu9.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858464/krigia_biflora_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p3_2_h8d4ok.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858466/krigia_biflora_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p3_3_qv3ift.png"
    ],
    "page_number": 3
  },
  {
    "guide_id": 1271,
    "species_id": "sp_2",
    "scientific_name": "Actaea rubra",
    "common_name": "Red Baneberry",
    "family": "Ranunculaceae",
    "photo_date": "7-5-18",
    "description": "Berries. Red baneberry is the bright sister to doll’s eyes aka white baneberry. Berries need to be reddish before collecting. Birds are apparently immune to the toxicity of this plant, but berries often linger, uneaten.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "actaea_rubra_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p3_4.png",
      "actaea_rubra_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p3_5.png",
      "actaea_rubra_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p3_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858345/actaea_rubra_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p3_4_kpx7hw.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858346/actaea_rubra_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p3_5_nxermn.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858348/actaea_rubra_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p3_6_fyfziu.png"
    ],
    "page_number": 3
  },
  {
    "guide_id": 1271,
    "species_id": "sp_3",
    "scientific_name": "Allium canadense",
    "common_name": "Wild Onion",
    "family": "Alliaceae",
    "photo_date": "7-7-19",
    "description": "Shattering. This native garlic rarely forms seed, but it does form “bulblets.” Collect the bulblets when they easily separate from the plant. The outer papery shell will be beige and the inner bulblet can vary in color.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "allium_canadense_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p3_7.png",
      "allium_canadense_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p3_8.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858367/allium_canadense_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p3_7_clpftm.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858369/allium_canadense_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p3_8_jpzrud.png"
    ],
    "page_number": 3
  },
  {
    "guide_id": 1271,
    "species_id": "sp_4",
    "scientific_name": "Conopholis americana",
    "common_name": "Cancer Root",
    "family": "Orobanchaceae",
    "photo_date": "7-18-2019",
    "description": "Berries. This uncommon parasite attaches to the roots of Oaks, primarily the red oak group. Little is known about germination. Capsules are dull and dark when ripe, due to the deep brown color of the seeds inside, and start to fall off the \"cone.\" Fleshy capsules are reportedly eaten by mammals, but can also dry & split open. Collect <10%. Sow fresh around red oaks. 4+ years to attach & flower.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "conopholis_americana_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p4_1.png",
      "conopholis_americana_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p4_2.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858422/conopholis_americana_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p4_1_tjlmw1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858422/conopholis_americana_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p4_2_esgkug.png"
    ],
    "page_number": 4
  },
  {
    "guide_id": 1271,
    "species_id": "sp_5",
    "scientific_name": "Osmorhiza longistylis",
    "common_name": "Smooth Sweet Cicely",
    "family": "Apiaceae",
    "photo_date": "7-15-2017",
    "description": "And 8-10-2019 Shattering. Hitchhikers. The sweet cicely species are very similar. This species has anise-scented foliage, 5-6 bracts, and 8-16 flowers per umbellet. Plants are smooth or fuzzy, but do not have long hairs. Seeds shatter in place, but can hitch a ride by the tips.",
    "seed_group_names": [
      "Hitchhikers",
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Hitchhikers",
        "images": [
          "Hitchhikers_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_page1_img1.png"
        ],
        "description": "Hitchhikers are easy to tell when ripe – they hitch a ride on your pants! Color can be an indicator, but not always. Do Not Collect."
      },
      {
        "name": "Shattering",
        "images": [
          "Shattering_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "osmorhiza_longistylis_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p4_3.png",
      "osmorhiza_longistylis_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p4_4.png",
      "osmorhiza_longistylis_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p4_5.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858479/osmorhiza_longistylis_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p4_3_fcog16.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858482/osmorhiza_longistylis_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p4_4_ecimsj.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858483/osmorhiza_longistylis_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p4_5_mthyqq.png"
    ],
    "page_number": 4
  },
  {
    "guide_id": 1271,
    "species_id": "sp_6",
    "scientific_name": "Osmorhiza claytonii",
    "common_name": "Hairy Sweet Cicely",
    "family": "Apiaceae",
    "photo_date": "7-18-2017",
    "description": "Shattering. Hitchhikers. The sweet cicely species are very similar. This species has 3-4 bracts, typically 4-7 flowers per umbellet. Lacks the anise (licorice) odor. Plants have long spreading hairs. Seeds shatter in place, but can hitch a ride by the tips.",
    "seed_group_names": [
      "Hitchhikers",
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Hitchhikers",
        "images": [
          "Hitchhikers_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_page1_img1.png"
        ],
        "description": "Hitchhikers are easy to tell when ripe – they hitch a ride on your pants! Color can be an indicator, but not always. Do Not Collect."
      },
      {
        "name": "Shattering",
        "images": [
          "Shattering_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "osmorhiza_claytonii_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p4_6.png",
      "osmorhiza_claytonii_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p4_7.png",
      "osmorhiza_claytonii_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p4_8.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858472/osmorhiza_claytonii_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p4_6_at39tb.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858473/osmorhiza_claytonii_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p4_7_lwtvyx.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858476/osmorhiza_claytonii_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p4_8_nz1y4y.png"
    ],
    "page_number": 4
  },
  {
    "guide_id": 1271,
    "species_id": "sp_7",
    "scientific_name": "Hydrophyllum virginianum",
    "common_name": "Virginia Waterleaf",
    "family": "Hydrophyllaceae",
    "photo_date": "7-18-19",
    "description": "Beaks. Seeds are shades of brown and cratered. Capsules split open to release seeds. Snip entire head once an open capsule has been spotted. Variable patterns on the leaves: some are entirely green, others have “water spots” - white or pale green blotches of various sizes.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "hydrophyllum_virginianum_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p5_1.png",
      "hydrophyllum_virginianum_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p5_2.png",
      "hydrophyllum_virginianum_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p5_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858455/hydrophyllum_virginianum_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p5_1_mshsup.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858458/hydrophyllum_virginianum_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p5_2_xfcyvo.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858459/hydrophyllum_virginianum_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p5_3_ueof4p.png"
    ],
    "page_number": 5
  },
  {
    "guide_id": 1271,
    "species_id": "sp_8",
    "scientific_name": "Podophyllum peltatum",
    "common_name": "Mayapple",
    "family": "Berberidaceae",
    "photo_date": "7-23-18",
    "description": "Berries. These fruits are reportedly eaten by box turtles. The fruits turn from unripe green to a ripe pale yellow; the inside should be soft & gelatinous. Most spread by rhizomes so it’s nice to provide genetic diversity by moving seeds around.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "podophyllum_peltatum_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p5_4.png",
      "podophyllum_peltatum_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p5_5.png",
      "podophyllum_peltatum_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p5_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858488/podophyllum_peltatum_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p5_4_ifpjnw.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858488/podophyllum_peltatum_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p5_5_ilggcu.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858490/podophyllum_peltatum_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p5_6_y1ht4o.png"
    ],
    "page_number": 5
  },
  {
    "guide_id": 1271,
    "species_id": "sp_9",
    "scientific_name": "Scrophularia lanceolata",
    "common_name": "Early Figwort",
    "family": "Scrophulariaceae",
    "photo_date": "7-24-20",
    "description": "Beaks. Mama’s Boy. In the extended family of the mints, with square stems. Brown teardrop capsules open to release tiny seeds. Blooms earlier than S. marilandica. Leaves on this species are lance-shaped; heart-shaped on the later species.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "scrophularia_lanceolata_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p5_7.png",
      "scrophularia_lanceolata_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p5_8.png",
      "scrophularia_lanceolata_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p5_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858499/scrophularia_lanceolata_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p5_7_ft5pkp.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858502/scrophularia_lanceolata_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p5_8_b7w43n.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858503/scrophularia_lanceolata_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p5_9_cvpbdp.png"
    ],
    "page_number": 5
  },
  {
    "guide_id": 1271,
    "species_id": "sp_10",
    "scientific_name": "Alliaria petiolata",
    "common_name": "Garlic Mustard",
    "family": "Brassicaceae",
    "photo_date": "7-28-18",
    "description": "Ballistic. This evil invasive spreads throughout woodlands, especially right after clearing work. Flowers have 4 petals, indicating this is in the mustard family, and leaves have a garlicy odor. Pull it when blooming or pods are green. Beige seed pods are fragile & ballistic; pulling at this stage only scatters the seeds around. Reportedly harms the beneficial mycorrhizal fungi that natives need to thrive.",
    "seed_group_names": [
      "Ballistic"
    ],
    "seed_group_details": [
      {
        "name": "Ballistic",
        "images": [
          "Ballistic_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_page1_img1.png"
        ],
        "description": "Ballistic capsules catapult their babies away, up to 30 feet! Search YouTube for “exploding seeds” to see these in action. To harvest: learn the ripening sequence & harvest just before explosion; store in a *sealed* paper bag or mesh bag for a day or two."
      }
    ],
    "image_filenames": [
      "alliaria_petiolata_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p6_1.png",
      "alliaria_petiolata_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p6_2.png",
      "alliaria_petiolata_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p6_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858359/alliaria_petiolata_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p6_1_djjrkm.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858359/alliaria_petiolata_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p6_2_p02afh.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858360/alliaria_petiolata_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p6_3_owjhie.png"
    ],
    "page_number": 6
  },
  {
    "guide_id": 1271,
    "species_id": "sp_11",
    "scientific_name": "Dodecatheon meadia",
    "common_name": "Shooting Star",
    "family": "Primulaceae",
    "photo_date": "7-29-17",
    "description": "Beaks. Look for brown & open capsules. Capsules start off green-yellow and nodding, then they raise to the sky, then turn brown, and finally open. Seeds are tiny. Germination is high, but survival past seedling stage is low due to damping off. Takes several years to flower.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "dodecatheon_meadia_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p6_4.png",
      "dodecatheon_meadia_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p6_5.png",
      "dodecatheon_meadia_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p6_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858436/dodecatheon_meadia_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p6_4_lwnysj.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858437/dodecatheon_meadia_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p6_5_u6nnp4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858438/dodecatheon_meadia_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p6_6_yihqrt.png"
    ],
    "page_number": 6
  },
  {
    "guide_id": 1271,
    "species_id": "sp_12",
    "scientific_name": "Anemone virginiana",
    "common_name": "Eastern Tall Anemone",
    "family": "Ranunculaceae",
    "photo_date": "8-1-17",
    "description": "Crumbly coneheads. The thimble-shaped cone fluffs up into a cottony mass when ripe. Check for loose cotton, strips easily by hand when ripe. A. cylindrica leaves are more deeply lobed, have more slender coneheads (pencil-width), and are found in full sun.",
    "seed_group_names": [
      "Coneheads"
    ],
    "seed_group_details": [
      {
        "name": "Coneheads",
        "images": [
          "Coneheads_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_page1_img1.png"
        ],
        "description": "Coneheads are flowers with a cone-shaped center. Imagine these flowers without their colorful parts, and you know exactly what they look like when seeds are ripe."
      }
    ],
    "image_filenames": [
      "anemone_virginiana_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p6_7.png",
      "anemone_virginiana_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p6_8.png",
      "anemone_virginiana_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p6_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858372/anemone_virginiana_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p6_7_tbgrta.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858376/anemone_virginiana_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p6_8_bvkmnd.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858377/anemone_virginiana_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p6_9_mvyk8n.png"
    ],
    "page_number": 6
  },
  {
    "guide_id": 1271,
    "species_id": "sp_13",
    "scientific_name": "Prunella vulgaris var. lanceolata",
    "common_name": "Wood Self Heal",
    "family": "Lamiaceae",
    "photo_date": "8-3-18",
    "description": "Shakers. This ultra-common native weed grows in disturbed old fields, woodlands, and prairies. A variety of the lawn weed, both have purple flowers & square stems. The native one grows upright. Ultra common, this species doesn’t need to be collected & sown.",
    "seed_group_names": [
      "Shakers"
    ],
    "seed_group_details": [
      {
        "name": "Shakers",
        "images": [
          "Shakers_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_page1_img1.png"
        ],
        "description": "Shakers drop seeds very close to the mother plant, when shaken loose by the wind or a passing critter. Usually a Mama’s Boy, unless strong weather occurs."
      }
    ],
    "image_filenames": [
      "prunella_vulgaris_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p7_1.png",
      "prunella_vulgaris_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p7_2.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858494/prunella_vulgaris_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p7_1_nbblo5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858496/prunella_vulgaris_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p7_2_cbabfl.png"
    ],
    "page_number": 7
  },
  {
    "guide_id": 1271,
    "species_id": "sp_14",
    "scientific_name": "Allium burdickii",
    "common_name": "Chicago Leek",
    "family": "Alliaceae",
    "photo_date": "8-5-18",
    "description": "Shattering. Black pearls hiding in the understory. Formerly a variety of A. tricoccum, this species of leek has green petioles, smaller clusters of flowers & seed, and typically starts to ripen first. Poor from seed, leeks spread locally by bulbs. Poaching is a problem.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "allium_burdickii_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p7_3.png",
      "allium_burdickii_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p7_4.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858369/allium_burdickii_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p7_3_xxumzw.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858370/allium_burdickii_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p7_4_xipafo.png"
    ],
    "page_number": 7
  },
  {
    "guide_id": 1271,
    "species_id": "sp_15",
    "scientific_name": "Scutellaria ovata",
    "common_name": "Heart-leaved Skullcap",
    "family": "Lamiaceae",
    "photo_date": "8-9-18",
    "description": "Shakers. Skullcaps hold their seeds in “scoop shovels” that are covered by a cap. When ripe, the cap falls off and seeds easily shake loose. Look for open scoops, then snip the entire stalk. Hand collecting leaves a weird residue that is easily washed off, no known skin issues. This uncommon species appears to be a short-lived perennial. It moves around and sometimes creates fairy rings. Two years to germinate.",
    "seed_group_names": [
      "Shakers"
    ],
    "seed_group_details": [
      {
        "name": "Shakers",
        "images": [
          "Shakers_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_page1_img1.png"
        ],
        "description": "Shakers drop seeds very close to the mother plant, when shaken loose by the wind or a passing critter. Usually a Mama’s Boy, unless strong weather occurs."
      }
    ],
    "image_filenames": [
      "scutellaria_ovata_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p7_5.png",
      "scutellaria_ovata_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p7_6.png",
      "scutellaria_ovata_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p7_7.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858508/scutellaria_ovata_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p7_5_c4kw4g.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858509/scutellaria_ovata_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p7_6_jyqohx.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858510/scutellaria_ovata_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p7_7_cabvhf.png"
    ],
    "page_number": 7
  },
  {
    "guide_id": 1271,
    "species_id": "sp_16",
    "scientific_name": "Taenidia integerrima",
    "common_name": "Yellow Pimpernel",
    "family": "Apiaceae",
    "photo_date": "8-16-18",
    "description": "Shattering. Mama’s Boy. Like Alexanders and other parsley-relatives, this species has an umbel (flat umbrella) of flowers and seeds. Collect seed when they easily strip free by hand. Smells like celery. A true savanna species, occasionally in prairies.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "taenidia_integerrima_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p8_1.png",
      "taenidia_integerrima_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p8_2.png",
      "taenidia_integerrima_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p8_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858525/taenidia_integerrima_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p8_1_es3enx.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858529/taenidia_integerrima_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p8_2_wyrgod.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858532/taenidia_integerrima_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p8_3_pdrfdb.png"
    ],
    "page_number": 8
  },
  {
    "guide_id": 1271,
    "species_id": "sp_17",
    "scientific_name": "Geum canadense",
    "common_name": "White Avens",
    "family": "Rosaceae",
    "photo_date": "8-23-18",
    "description": "Hitchhikers. A common white-flowered forb, found in woodlands, savannas, and pastures. This pioneering species easily moves around with its hitchhiker seeds and colonizes new areas. Not a species to target for collection, but often asked about when it appears on socks.",
    "seed_group_names": [
      "Hitchhikers"
    ],
    "seed_group_details": [
      {
        "name": "Hitchhikers",
        "images": [
          "Hitchhikers_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_page1_img1.png"
        ],
        "description": "Hitchhikers are easy to tell when ripe – they hitch a ride on your pants! Color can be an indicator, but not always. Do Not Collect."
      }
    ],
    "image_filenames": [
      "geum_canadense_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p8_4.png",
      "geum_canadense_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p8_5.png",
      "geum_canadense_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p8_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858447/geum_canadense_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p8_4_axodmo.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858448/geum_canadense_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p8_5_fwylna.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858450/geum_canadense_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p8_6_erbtwu.png"
    ],
    "page_number": 8
  },
  {
    "guide_id": 1271,
    "species_id": "sp_18",
    "scientific_name": "Cryptotaenia canadensis",
    "common_name": "Honewort",
    "family": "Apiaceae",
    "photo_date": "8-24-17",
    "description": "Shattering. A woodland parsley relative, this name comes from the historic treatment of swelling (hone) by the plant (wort). Collect when easy to strip off the stem. Host plant for swallowtail caterpillars.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "cryptotaenia_canadensis_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p8_7.png",
      "cryptotaenia_canadensis_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p8_8.png",
      "cryptotaenia_canadensis_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p8_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858428/cryptotaenia_canadensis_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p8_7_gyenvs.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858428/cryptotaenia_canadensis_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p8_8_zaan89.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858432/cryptotaenia_canadensis_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p8_9_v52wdw.png"
    ],
    "page_number": 8
  },
  {
    "guide_id": 1271,
    "species_id": "sp_19",
    "scientific_name": "Caulophyllum thalictroides",
    "common_name": "Blue Cohosh",
    "family": "Berberidaceae",
    "photo_date": "8-25-18",
    "description": "Berries. Looks like a blueberry, but it is actually a hard nut with a dry papery blue shell. Leaves are shaped like Thalictrum (“thalictroides”). Reportedly takes 5 years to germinate from seeds (yes, 5!) but may germinate faster when sown fresh. Individuals dug up during a plant rescue went dormant for 2 years from transplant shock. A conservative species of mesic woodlands & savannas.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "caulophyllum_thalictroides_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p9_1.png",
      "caulophyllum_thalictroides_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p9_2.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858408/caulophyllum_thalictroides_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p9_1_akz7xm.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858408/caulophyllum_thalictroides_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p9_2_dc5lbo.png"
    ],
    "page_number": 9
  },
  {
    "guide_id": 1271,
    "species_id": "sp_20",
    "scientific_name": "Circaea canadensis",
    "common_name": "Enchanter’s Nightshade",
    "family": "Onagraceae",
    "photo_date": "8-25-18",
    "description": "Hitchhikers. This species is abundant throughout our region’s woodlands and is only worth (intentionally) collecting for new restorations. Collect when it sticks to your socks.",
    "seed_group_names": [
      "Hitchhikers"
    ],
    "seed_group_details": [
      {
        "name": "Hitchhikers",
        "images": [
          "Hitchhikers_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_page1_img1.png"
        ],
        "description": "Hitchhikers are easy to tell when ripe – they hitch a ride on your pants! Color can be an indicator, but not always. Do Not Collect."
      }
    ],
    "image_filenames": [
      "circaea_canadensis_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p9_3.png",
      "circaea_canadensis_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p9_4.png",
      "circaea_canadensis_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p9_5.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858412/circaea_canadensis_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p9_3_xxkez4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858413/circaea_canadensis_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p9_4_q3sepe.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858415/circaea_canadensis_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p9_5_j3coqr.png"
    ],
    "page_number": 9
  },
  {
    "guide_id": 1271,
    "species_id": "sp_21",
    "scientific_name": "Actaea pachypoda",
    "common_name": "White Baneberry",
    "family": "Ranunculaceae",
    "photo_date": "8-31-18",
    "description": "Berries. An awesomely creepy plant, the common name is very appropriate. Collect when berries are white-ish. As with any plant called a “bane,” this is not one you want to eat.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "actaea_pachypoda_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p9_6.png",
      "actaea_pachypoda_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p9_7.png",
      "actaea_pachypoda_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p9_8.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858341/actaea_pachypoda_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p9_6_cw5lvl.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858342/actaea_pachypoda_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p9_7_zudrky.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858343/actaea_pachypoda_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p9_8_emtgzl.png"
    ],
    "page_number": 9
  },
  {
    "guide_id": 1271,
    "species_id": "sp_22",
    "scientific_name": "Zizia aurea",
    "common_name": "Golden Alexanders",
    "family": "Apiaceae",
    "photo_date": "8-25-17",
    "description": "Shattering. This common parsley-relative has bright yellow flowers that turn to green seeds and finally ripen to brown. Collect when easy to strip by hand. Most often mesic to wet-mesic prairies, but can be in open woodlands, savannas, prairies, and fens, from wet to dry.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "zizia_aurea_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p10_1.png",
      "zizia_aurea_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p10_2.png",
      "zizia_aurea_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p10_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858535/zizia_aurea_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p10_1_cyofdh.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858536/zizia_aurea_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p10_2_sbtoo7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858539/zizia_aurea_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p10_3_mx2tv5.png"
    ],
    "page_number": 10
  },
  {
    "guide_id": 1271,
    "species_id": "sp_23",
    "scientific_name": "Boechera laevigata",
    "common_name": "Smooth Bank Cress",
    "family": "Brassicaceae",
    "photo_date": "8-26-18",
    "description": "Ballistic. This easily overlooked native biennial loves rocky shady habitats. The small flowers become thin “siliques” (skinny pods, like garlic mustard’s, but those point upward). Look for open siliques, collect some unopened pods (<10%).",
    "seed_group_names": [
      "Ballistic"
    ],
    "seed_group_details": [
      {
        "name": "Ballistic",
        "images": [
          "Ballistic_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_page1_img1.png"
        ],
        "description": "Ballistic capsules catapult their babies away, up to 30 feet! Search YouTube for “exploding seeds” to see these in action. To harvest: learn the ripening sequence & harvest just before explosion; store in a *sealed* paper bag or mesh bag for a day or two."
      }
    ],
    "image_filenames": [
      "boechera_laevigata_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p10_4.png",
      "boechera_laevigata_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p10_5.png",
      "boechera_laevigata_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p10_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858399/boechera_laevigata_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p10_4_zsb3zv.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858402/boechera_laevigata_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p10_5_s1wgy8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858402/boechera_laevigata_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p10_6_kib9bi.png"
    ],
    "page_number": 10
  },
  {
    "guide_id": 1271,
    "species_id": "sp_24",
    "scientific_name": "Blephilia hirsuta",
    "common_name": "Wood Mint",
    "family": "Lamiaceae",
    "photo_date": "8-28-19",
    "description": "Shakers. Like Monarda and many other mints, seeds are held in “tubes” (the calyx). Tip into your hand, seeds will fall out if ripe. Differs from Ohio horse mint (B. ciliata) with longer petioles & longer stem hairs, minty odor when the leaves are crushed, prefers a little shade.",
    "seed_group_names": [
      "Shakers"
    ],
    "seed_group_details": [
      {
        "name": "Shakers",
        "images": [
          "Shakers_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_page1_img1.png"
        ],
        "description": "Shakers drop seeds very close to the mother plant, when shaken loose by the wind or a passing critter. Usually a Mama’s Boy, unless strong weather occurs."
      }
    ],
    "image_filenames": [
      "blephilia_hirsuta_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p10_7.png",
      "blephilia_hirsuta_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p10_8.png",
      "blephilia_hirsuta_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p10_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858392/blephilia_hirsuta_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p10_7_t9n4r1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858393/blephilia_hirsuta_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p10_8_ojeeht.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858395/blephilia_hirsuta_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p10_9_iqb3m5.png"
    ],
    "page_number": 10
  },
  {
    "guide_id": 1271,
    "species_id": "sp_25",
    "scientific_name": "Agrimonia gryposepala",
    "common_name": "Tall Agrimony",
    "family": "Rosaceae",
    "photo_date": "8-30-18",
    "description": "Hitchhikers. All agrimony species are priceless aka unavailable on the commercial market. This is the most common of them. Little yellow flowers turn into green burs, about ¼” in diameter. Easy to spot due to the seed size, easy to collect, good for early woodland restorations.",
    "seed_group_names": [
      "Hitchhikers"
    ],
    "seed_group_details": [
      {
        "name": "Hitchhikers",
        "images": [
          "Hitchhikers_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_page1_img1.png"
        ],
        "description": "Hitchhikers are easy to tell when ripe – they hitch a ride on your pants! Color can be an indicator, but not always. Do Not Collect."
      }
    ],
    "image_filenames": [
      "agrimonia_gryposepala_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p11_1.png",
      "agrimonia_gryposepala_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p11_2.png",
      "agrimonia_gryposepala_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p11_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858350/agrimonia_gryposepala_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p11_1_mhexoa.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858350/agrimonia_gryposepala_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p11_2_cies0t.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858352/agrimonia_gryposepala_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p11_3_gzgz2x.png"
    ],
    "page_number": 11
  },
  {
    "guide_id": 1271,
    "species_id": "sp_26",
    "scientific_name": "Agrimonia rostellata",
    "common_name": "Beaked Agrimony",
    "family": "Rosaceae",
    "photo_date": "8-30-18",
    "description": "Hitchhikers. This species favors mesic/upland woodlands and has smaller fruits than the common A. gryposepala. Collect when it sticks to your clothes, easily strips by hand. Agrimony are relatively friendly hitchhikers – very easy to clean off of your pants.",
    "seed_group_names": [
      "Hitchhikers"
    ],
    "seed_group_details": [
      {
        "name": "Hitchhikers",
        "images": [
          "Hitchhikers_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_page1_img1.png"
        ],
        "description": "Hitchhikers are easy to tell when ripe – they hitch a ride on your pants! Color can be an indicator, but not always. Do Not Collect."
      }
    ],
    "image_filenames": [
      "agrimonia_rostellata_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p11_4.png",
      "agrimonia_rostellata_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p11_5.png",
      "agrimonia_rostellata_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p11_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858355/agrimonia_rostellata_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p11_4_yzud0a.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858355/agrimonia_rostellata_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p11_5_rxo1sf.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858359/agrimonia_rostellata_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p11_6_syauv8.png"
    ],
    "page_number": 11
  },
  {
    "guide_id": 1271,
    "species_id": "sp_27",
    "scientific_name": "Silene stellata",
    "common_name": "Starry Campion",
    "family": "Caryophyllaceae",
    "photo_date": "8-28-18",
    "description": "Beaks. This lovely plant can be found in healthy savannas, open woods, and sometimes wet-mesic prairies. The flower is a white fringed star. Capsules form inside the paper calyx; collect beige capsules.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "silene_stellata_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p11_7.png",
      "silene_stellata_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p11_8.png",
      "silene_stellata_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p11_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858519/silene_stellata_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p11_7_iorzy9.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858520/silene_stellata_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p11_8_vd4oaj.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858524/silene_stellata_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p11_9_gezqop.png"
    ],
    "page_number": 11
  },
  {
    "guide_id": 1271,
    "species_id": "sp_28",
    "scientific_name": "Arnoglossum atriplicifolium",
    "common_name": "Pale Indian Plantain",
    "family": "Asteraceae",
    "photo_date": "8-31-18",
    "description": "Fluffy. This towering plant is regionally uncommon (C = 8) but locally abundant. Underside of leaves are *pale* and lobed. Snip when fluffy, pappus (fluff) is bleach white and seeds are plump and blackish. Readily self-seeds.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "arnoglossum_atriplicifolium_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p12_1.png",
      "arnoglossum_atriplicifolium_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p12_2.png",
      "arnoglossum_atriplicifolium_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p12_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858381/arnoglossum_atriplicifolium_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p12_1_nctr5y.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858382/arnoglossum_atriplicifolium_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p12_2_zjhaop.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766858384/arnoglossum_atriplicifolium_1271_usa_illinois_lakecounty_summerwoodlandforbs_v2_p12_3_raruzy.png"
    ],
    "page_number": 12
  },
  {
    "guide_id": 1272,
    "species_id": "sp_1",
    "scientific_name": "Amelanchier laevis",
    "common_name": "Allegheny Juneberry",
    "family": "Rosaceae",
    "photo_date": "6-30-19, 7-15-20",
    "description": "Berries. Amelanchier species are a challenge to ID: flowers or fruit must be present (sometimes must check both) and they hybridize. This species has longer pedicels (stalks to the fruit/flower), often more than 2.2 cm long. Few to no hairs on the ovary. At flowering time, leaves are reddish-tinged & half-grown; later in the season they become green and hairless. Purple fruit preferred, but animals love to eat them too.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "amelanchier_laevis_1272_usa_illinois_lakecounty_woodyplantsv2_p3_1.png",
      "amelanchier_laevis_1272_usa_illinois_lakecounty_woodyplantsv2_p3_2.png",
      "amelanchier_laevis_1272_usa_illinois_lakecounty_woodyplantsv2_p3_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871781/1272_usa_illinois_lakecounty_woodyplantsv2/amelanchier_laevis_1272_usa_illinois_lakecounty_woodyplantsv2_p3_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871781/1272_usa_illinois_lakecounty_woodyplantsv2/amelanchier_laevis_1272_usa_illinois_lakecounty_woodyplantsv2_p3_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871783/1272_usa_illinois_lakecounty_woodyplantsv2/amelanchier_laevis_1272_usa_illinois_lakecounty_woodyplantsv2_p3_3.png"
    ],
    "page_number": 3
  },
  {
    "guide_id": 1272,
    "species_id": "sp_2",
    "scientific_name": "Amelanchier interior",
    "common_name": "Inland Juneberry",
    "family": "Rosaceae",
    "photo_date": "7-16-20, 5-4-20",
    "description": "Berries. This species is furry on the top of the ovary, which can be observed in flower and somewhat evident on the tip of the fruit. Leaves have many teeth, more than twice the number of veins. The longer pedicels are more than 16 mm long. Ripe fruits are purple or purple-black.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "amelanchier_interior_1272_usa_illinois_lakecounty_woodyplantsv2_p3_4.png",
      "amelanchier_interior_1272_usa_illinois_lakecounty_woodyplantsv2_p3_5.png",
      "amelanchier_interior_1272_usa_illinois_lakecounty_woodyplantsv2_p3_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871779/1272_usa_illinois_lakecounty_woodyplantsv2/amelanchier_interior_1272_usa_illinois_lakecounty_woodyplantsv2_p3_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871780/1272_usa_illinois_lakecounty_woodyplantsv2/amelanchier_interior_1272_usa_illinois_lakecounty_woodyplantsv2_p3_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871780/1272_usa_illinois_lakecounty_woodyplantsv2/amelanchier_interior_1272_usa_illinois_lakecounty_woodyplantsv2_p3_6.png"
    ],
    "page_number": 3
  },
  {
    "guide_id": 1272,
    "species_id": "sp_3",
    "scientific_name": "Amelanchier x grandiflora",
    "common_name": "Serviceberry Cultivar",
    "family": "Rosaceae",
    "photo_date": "5-5-20, 7-1-20, 10-30-19",
    "description": "Berries. Serviceberry hybrids and cultivars are commonly sold for landscape shrubbery. A popular one is A. x grandiflora (autumn brilliance) an A. laevis hybrid which may or may not fit the Flora key in all aspects of pubescence, fruit size and fruit stem length. Do not collect Amelanchier berries from landscape plants. Source only from remnant native populations for use in restorations.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "amelanchier_x_1272_usa_illinois_lakecounty_woodyplantsv2_p3_7.png",
      "amelanchier_x_1272_usa_illinois_lakecounty_woodyplantsv2_p3_8.png",
      "amelanchier_x_1272_usa_illinois_lakecounty_woodyplantsv2_p3_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871783/1272_usa_illinois_lakecounty_woodyplantsv2/amelanchier_x_1272_usa_illinois_lakecounty_woodyplantsv2_p3_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871784/1272_usa_illinois_lakecounty_woodyplantsv2/amelanchier_x_1272_usa_illinois_lakecounty_woodyplantsv2_p3_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871784/1272_usa_illinois_lakecounty_woodyplantsv2/amelanchier_x_1272_usa_illinois_lakecounty_woodyplantsv2_p3_9.png"
    ],
    "page_number": 3
  },
  {
    "guide_id": 1272,
    "species_id": "sp_4",
    "scientific_name": "Rubus occidentalis",
    "common_name": "Black Raspberry",
    "family": "Rosaceae",
    "photo_date": "7-10-18",
    "description": "Berries. These sweet berries are found in many habitats. Prickly stems with a blue/white waxy coating (“glaucous”). Leaves typically in 3s, green above and white below. Immature reddish fruits and finally ripening to dark black berries that are easy to pluck off the plant.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "rubus_occidentalis_1272_usa_illinois_lakecounty_woodyplantsv2_p4_1.png",
      "rubus_occidentalis_1272_usa_illinois_lakecounty_woodyplantsv2_p4_2.png",
      "rubus_occidentalis_1272_usa_illinois_lakecounty_woodyplantsv2_p4_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871878/1272_usa_illinois_lakecounty_woodyplantsv2/rubus_occidentalis_1272_usa_illinois_lakecounty_woodyplantsv2_p4_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871879/1272_usa_illinois_lakecounty_woodyplantsv2/rubus_occidentalis_1272_usa_illinois_lakecounty_woodyplantsv2_p4_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871879/1272_usa_illinois_lakecounty_woodyplantsv2/rubus_occidentalis_1272_usa_illinois_lakecounty_woodyplantsv2_p4_3.png"
    ],
    "page_number": 4
  },
  {
    "guide_id": 1272,
    "species_id": "sp_5",
    "scientific_name": "Rubus bellobatus",
    "common_name": "Kittatinny Blackberry",
    "family": "Rosaceae",
    "photo_date": "7-26-18",
    "description": "Berries. Compared to raspberries: blackberry plants have thicker canes, leaves typically in 5s, and the fruit cluster is bigger and longer. This common species is hairless. The fruit is 1.5 – 3 cm long. Easily plucked when ripe.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "rubus_bellobatus_1272_usa_illinois_lakecounty_woodyplantsv2_p4_4.png",
      "rubus_bellobatus_1272_usa_illinois_lakecounty_woodyplantsv2_p4_5.png",
      "rubus_bellobatus_1272_usa_illinois_lakecounty_woodyplantsv2_p4_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871876/1272_usa_illinois_lakecounty_woodyplantsv2/rubus_bellobatus_1272_usa_illinois_lakecounty_woodyplantsv2_p4_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871877/1272_usa_illinois_lakecounty_woodyplantsv2/rubus_bellobatus_1272_usa_illinois_lakecounty_woodyplantsv2_p4_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871877/1272_usa_illinois_lakecounty_woodyplantsv2/rubus_bellobatus_1272_usa_illinois_lakecounty_woodyplantsv2_p4_6.png"
    ],
    "page_number": 4
  },
  {
    "guide_id": 1272,
    "species_id": "sp_6",
    "scientific_name": "Rubus allegheniensis",
    "common_name": "Highbush Blackberry",
    "family": "Rosaceae",
    "photo_date": "8-1-18",
    "description": "Berries. This common species has glandular hairs (looks like lollipops under magnification) on the pedicels (the small stems to the flower/fruit). Primary stalks are 7-11mm wide. Fruit are typically 1.5 cm or longer.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "rubus_allegheniensis_1272_usa_illinois_lakecounty_woodyplantsv2_p4_7.png",
      "rubus_allegheniensis_1272_usa_illinois_lakecounty_woodyplantsv2_p4_8.png",
      "rubus_allegheniensis_1272_usa_illinois_lakecounty_woodyplantsv2_p4_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871872/1272_usa_illinois_lakecounty_woodyplantsv2/rubus_allegheniensis_1272_usa_illinois_lakecounty_woodyplantsv2_p4_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871873/1272_usa_illinois_lakecounty_woodyplantsv2/rubus_allegheniensis_1272_usa_illinois_lakecounty_woodyplantsv2_p4_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871875/1272_usa_illinois_lakecounty_woodyplantsv2/rubus_allegheniensis_1272_usa_illinois_lakecounty_woodyplantsv2_p4_9.png"
    ],
    "page_number": 4
  },
  {
    "guide_id": 1272,
    "species_id": "sp_7",
    "scientific_name": "Ribes missouriense",
    "common_name": "Missouri Wild Gooseberry",
    "family": "Grossulariaceae",
    "photo_date": "7-22-19",
    "description": "Berries. Currants & gooseberries are tasty to many critters; don’t wait long to collect these. This species has spines at the nodes plus prickles (skinnier, smaller spines) on the stem, no prickles on fruit, and leaves do not have golden dots. Collect when berries are plump & dark.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "ribes_missouriense_1272_usa_illinois_lakecounty_woodyplantsv2_p5_1.png",
      "ribes_missouriense_1272_usa_illinois_lakecounty_woodyplantsv2_p5_2.png",
      "ribes_missouriense_1272_usa_illinois_lakecounty_woodyplantsv2_p5_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871859/1272_usa_illinois_lakecounty_woodyplantsv2/ribes_missouriense_1272_usa_illinois_lakecounty_woodyplantsv2_p5_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871860/1272_usa_illinois_lakecounty_woodyplantsv2/ribes_missouriense_1272_usa_illinois_lakecounty_woodyplantsv2_p5_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871862/1272_usa_illinois_lakecounty_woodyplantsv2/ribes_missouriense_1272_usa_illinois_lakecounty_woodyplantsv2_p5_3.png"
    ],
    "page_number": 5
  },
  {
    "guide_id": 1272,
    "species_id": "sp_8",
    "scientific_name": "Ribes cynosbati",
    "common_name": "Prickly Wild Gooseberry",
    "family": "Grossulariaceae",
    "photo_date": "8-15-18",
    "description": "Berries. This species is unique with the “medieval mace” berries. Despite the prickly fruits, critters will eat them. Collect promptly when burgundy or darker. Mesic woodlands & seeps.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "ribes_cynosbati_1272_usa_illinois_lakecounty_woodyplantsv2_p5_4.png",
      "ribes_cynosbati_1272_usa_illinois_lakecounty_woodyplantsv2_p5_5.png",
      "ribes_cynosbati_1272_usa_illinois_lakecounty_woodyplantsv2_p5_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871856/1272_usa_illinois_lakecounty_woodyplantsv2/ribes_cynosbati_1272_usa_illinois_lakecounty_woodyplantsv2_p5_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871857/1272_usa_illinois_lakecounty_woodyplantsv2/ribes_cynosbati_1272_usa_illinois_lakecounty_woodyplantsv2_p5_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871858/1272_usa_illinois_lakecounty_woodyplantsv2/ribes_cynosbati_1272_usa_illinois_lakecounty_woodyplantsv2_p5_6.png"
    ],
    "page_number": 5
  },
  {
    "guide_id": 1272,
    "species_id": "sp_9",
    "scientific_name": "Ribes americanum",
    "common_name": "Wild Black Currant",
    "family": "Grossulariaceae",
    "photo_date": "8-10-17",
    "description": "Berries. This Ribes species has leaves with golden glandular dots, and stems lack prickles and thorns. Flowers typically about 1 cm long. Var. mesochorum (known in IN) has different sepals, and the terminal lobe of the leaf is longer with longer teeth. Collect plump black fruits.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "ribes_americanum_1272_usa_illinois_lakecounty_woodyplantsv2_p5_7.png",
      "ribes_americanum_1272_usa_illinois_lakecounty_woodyplantsv2_p5_8.png",
      "ribes_americanum_1272_usa_illinois_lakecounty_woodyplantsv2_p5_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871855/1272_usa_illinois_lakecounty_woodyplantsv2/ribes_americanum_1272_usa_illinois_lakecounty_woodyplantsv2_p5_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871855/1272_usa_illinois_lakecounty_woodyplantsv2/ribes_americanum_1272_usa_illinois_lakecounty_woodyplantsv2_p5_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871856/1272_usa_illinois_lakecounty_woodyplantsv2/ribes_americanum_1272_usa_illinois_lakecounty_woodyplantsv2_p5_9.png"
    ],
    "page_number": 5
  },
  {
    "guide_id": 1272,
    "species_id": "sp_10",
    "scientific_name": "Prunus virginiana",
    "common_name": "Choke Cherry",
    "family": "Rosaceae",
    "photo_date": "8-10-17",
    "description": "Berries. This shrub has long clusters of white flowers like its tree sister - black cherry (P. serotina). Fruits are dark when ripe and very astringent when raw (hence the name). Prone to black knot, a fungus that grows on the stems of cherries & plums. Birds love the fruit.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "prunus_virginiana_1272_usa_illinois_lakecounty_woodyplantsv2_p6_1.png",
      "prunus_virginiana_1272_usa_illinois_lakecounty_woodyplantsv2_p6_2.png",
      "prunus_virginiana_1272_usa_illinois_lakecounty_woodyplantsv2_p6_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871842/1272_usa_illinois_lakecounty_woodyplantsv2/prunus_virginiana_1272_usa_illinois_lakecounty_woodyplantsv2_p6_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871843/1272_usa_illinois_lakecounty_woodyplantsv2/prunus_virginiana_1272_usa_illinois_lakecounty_woodyplantsv2_p6_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871843/1272_usa_illinois_lakecounty_woodyplantsv2/prunus_virginiana_1272_usa_illinois_lakecounty_woodyplantsv2_p6_3.png"
    ],
    "page_number": 6
  },
  {
    "guide_id": 1272,
    "species_id": "sp_11",
    "scientific_name": "Vitis riparia",
    "common_name": "Riverbank Grape",
    "family": "Vitaceae",
    "photo_date": "8-10-18",
    "description": "Berries. Grape vines are often spotted sprawling over and through trees, like Tarzan vines holding up the buckthorn you are trying to cut! Older vines are covered in peeling brown bark and ooze a gelatinous sap when cut. Fruits are blue-black with a waxy gray-blue color when ripe. Leaves are lobed, and the underside of the leaf is hairy only on the veins or completely hairless. Good food for birds & insects.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "vitis_riparia_1272_usa_illinois_lakecounty_woodyplantsv2_p6_4.png",
      "vitis_riparia_1272_usa_illinois_lakecounty_woodyplantsv2_p6_5.png",
      "vitis_riparia_1272_usa_illinois_lakecounty_woodyplantsv2_p6_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871897/1272_usa_illinois_lakecounty_woodyplantsv2/vitis_riparia_1272_usa_illinois_lakecounty_woodyplantsv2_p6_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871897/1272_usa_illinois_lakecounty_woodyplantsv2/vitis_riparia_1272_usa_illinois_lakecounty_woodyplantsv2_p6_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871898/1272_usa_illinois_lakecounty_woodyplantsv2/vitis_riparia_1272_usa_illinois_lakecounty_woodyplantsv2_p6_6.png"
    ],
    "page_number": 6
  },
  {
    "guide_id": 1272,
    "species_id": "sp_12",
    "scientific_name": "Menispermum canadense",
    "common_name": "Moonseed",
    "family": "Menispermaceae",
    "photo_date": "9-11-19",
    "description": "Berries. Typical leaves look like a cross between a grape & ivy with 3-5 lobes, but can be rounded or egg-shaped. Leaves are “peltate” (petioles - leaf stems - are attached under the leaf. Like an umbrella). This species is dioecious; it needs male & female plants to produce fruit. Vines are woody. Berries are blue-black, like wild grapes, but seeds are crescent moons. Toxic – do not eat!!",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "menispermum_canadense_1272_usa_illinois_lakecounty_woodyplantsv2_p6_7.png",
      "menispermum_canadense_1272_usa_illinois_lakecounty_woodyplantsv2_p6_8.png",
      "menispermum_canadense_1272_usa_illinois_lakecounty_woodyplantsv2_p6_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871836/1272_usa_illinois_lakecounty_woodyplantsv2/menispermum_canadense_1272_usa_illinois_lakecounty_woodyplantsv2_p6_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871837/1272_usa_illinois_lakecounty_woodyplantsv2/menispermum_canadense_1272_usa_illinois_lakecounty_woodyplantsv2_p6_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871838/1272_usa_illinois_lakecounty_woodyplantsv2/menispermum_canadense_1272_usa_illinois_lakecounty_woodyplantsv2_p6_9.png"
    ],
    "page_number": 6
  },
  {
    "guide_id": 1272,
    "species_id": "sp_13",
    "scientific_name": "Cornus racemosa",
    "common_name": "Gray Dogwood",
    "family": "Cornaceae",
    "photo_date": "8-16-18",
    "description": "Berries. This native shrub inspires mixed reactions in land managers. Used by numerous native bees, moths, flies, butterflies, birds, and mammals. Prone to creating thickets, which are essential for the struggling shrubland birds, but can readily take over prairies; finding the right balance is key. White berries on bold red pedicels. Leaves are opposite; gently tear one in half, and it will dangle by stringy veins.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "cornus_racemosa_1272_usa_illinois_lakecounty_woodyplantsv2_p7_1.png",
      "cornus_racemosa_1272_usa_illinois_lakecounty_woodyplantsv2_p7_2.png",
      "cornus_racemosa_1272_usa_illinois_lakecounty_woodyplantsv2_p7_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871801/1272_usa_illinois_lakecounty_woodyplantsv2/cornus_racemosa_1272_usa_illinois_lakecounty_woodyplantsv2_p7_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871802/1272_usa_illinois_lakecounty_woodyplantsv2/cornus_racemosa_1272_usa_illinois_lakecounty_woodyplantsv2_p7_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871802/1272_usa_illinois_lakecounty_woodyplantsv2/cornus_racemosa_1272_usa_illinois_lakecounty_woodyplantsv2_p7_3.png"
    ],
    "page_number": 7
  },
  {
    "guide_id": 1272,
    "species_id": "sp_14",
    "scientific_name": "Cornus obliqua",
    "common_name": "Blue-fruited Dogwood",
    "family": "Cornaceae",
    "photo_date": "9-22-19",
    "description": "Berries. Can be mistaken for red-twig dogwood (C. sericea), but C. obliqua is the only red dogwood with blue fruit. 2nd year twigs have a brown pith (the twig core). Twigs are usually red with gray streaks but can be yellowish in winter. Bluer fruits preferred. Wetlands.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "cornus_obliqua_1272_usa_illinois_lakecounty_woodyplantsv2_p7_4.png",
      "cornus_obliqua_1272_usa_illinois_lakecounty_woodyplantsv2_p7_5.png",
      "cornus_obliqua_1272_usa_illinois_lakecounty_woodyplantsv2_p7_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871799/1272_usa_illinois_lakecounty_woodyplantsv2/cornus_obliqua_1272_usa_illinois_lakecounty_woodyplantsv2_p7_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871799/1272_usa_illinois_lakecounty_woodyplantsv2/cornus_obliqua_1272_usa_illinois_lakecounty_woodyplantsv2_p7_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871800/1272_usa_illinois_lakecounty_woodyplantsv2/cornus_obliqua_1272_usa_illinois_lakecounty_woodyplantsv2_p7_6.png"
    ],
    "page_number": 7
  },
  {
    "guide_id": 1272,
    "species_id": "sp_15",
    "scientific_name": "Cornus sericea",
    "common_name": "Red Sticks",
    "family": "Cornaceae",
    "photo_date": "9-22-19",
    "description": "Berries. Commonly called “red twig” or “red osier.” Ripe berries are white. Seeds are dark, which appears to be a unique trait among Cornus. Pith (twig core) is lighter than surrounding wood. Flora also recognizes C. baileyi. Examine the hairs on the underside of the leaf for ID.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "cornus_sericea_1272_usa_illinois_lakecounty_woodyplantsv2_p7_7.png",
      "cornus_sericea_1272_usa_illinois_lakecounty_woodyplantsv2_p7_8.png",
      "cornus_sericea_1272_usa_illinois_lakecounty_woodyplantsv2_p7_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871803/1272_usa_illinois_lakecounty_woodyplantsv2/cornus_sericea_1272_usa_illinois_lakecounty_woodyplantsv2_p7_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871803/1272_usa_illinois_lakecounty_woodyplantsv2/cornus_sericea_1272_usa_illinois_lakecounty_woodyplantsv2_p7_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871804/1272_usa_illinois_lakecounty_woodyplantsv2/cornus_sericea_1272_usa_illinois_lakecounty_woodyplantsv2_p7_9.png"
    ],
    "page_number": 7
  },
  {
    "guide_id": 1272,
    "species_id": "sp_16",
    "scientific_name": "Lonicera reticulata",
    "common_name": "Yellow Honeysuckle",
    "family": "Caprifoliaceae",
    "photo_date": "9-4-18",
    "description": "Berries. Yes, there are good honeysuckles! Viney. Leaves along the vine are oval paired opposites. The terminal leaves are perfoliate (stem perforates the leaf), providing a backdrop for flowers & fruit. It is rare to find flowering specimens in the wild. Commonly creeping along the ground; flowering plants are more likely on edges (a little more sun), with something to climb, and deer protection.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "lonicera_reticulata_1272_usa_illinois_lakecounty_woodyplantsv2_p8_1.png",
      "lonicera_reticulata_1272_usa_illinois_lakecounty_woodyplantsv2_p8_2.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871835/1272_usa_illinois_lakecounty_woodyplantsv2/lonicera_reticulata_1272_usa_illinois_lakecounty_woodyplantsv2_p8_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871835/1272_usa_illinois_lakecounty_woodyplantsv2/lonicera_reticulata_1272_usa_illinois_lakecounty_woodyplantsv2_p8_2.png"
    ],
    "page_number": 8
  },
  {
    "guide_id": 1272,
    "species_id": "sp_17",
    "scientific_name": "Lonicera maackii",
    "common_name": "Amur Honeysuckle",
    "family": "Caprifoliaceae",
    "photo_date": "10-30-20",
    "description": "Berries. One of several non-native honeysuckles; bush honeysuckles in our area are almost always non-native. This species has flowers & fruit that are sessile (stalkless) or minute (always shorter than the leaf stalks). Leaves have an elongated tip. Stems are hollow. Red berries linger in winter, indicating even the birds don’t like them. Kill it.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "lonicera_maackii_1272_usa_illinois_lakecounty_woodyplantsv2_p8_3.png",
      "lonicera_maackii_1272_usa_illinois_lakecounty_woodyplantsv2_p8_4.png",
      "lonicera_maackii_1272_usa_illinois_lakecounty_woodyplantsv2_p8_5.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871833/1272_usa_illinois_lakecounty_woodyplantsv2/lonicera_maackii_1272_usa_illinois_lakecounty_woodyplantsv2_p8_3.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871833/1272_usa_illinois_lakecounty_woodyplantsv2/lonicera_maackii_1272_usa_illinois_lakecounty_woodyplantsv2_p8_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871834/1272_usa_illinois_lakecounty_woodyplantsv2/lonicera_maackii_1272_usa_illinois_lakecounty_woodyplantsv2_p8_5.png"
    ],
    "page_number": 8
  },
  {
    "guide_id": 1272,
    "species_id": "sp_18",
    "scientific_name": "Corylus americana",
    "common_name": "American Hazelnut",
    "family": "Betulaceae",
    "photo_date": "9-12-17",
    "description": "Shattering. The “Nutella shrub” excites groups into collecting. The nut is a wrapped in a pair of oversized bracts, like insane eyelashes. Watch for the nut & bracts to turn brown; collect promptly before the squirrels. If too tight, pliers or nutcracker can help with processing.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "corylus_americana_1272_usa_illinois_lakecounty_woodyplantsv2_p8_6.png",
      "corylus_americana_1272_usa_illinois_lakecounty_woodyplantsv2_p8_7.png",
      "corylus_americana_1272_usa_illinois_lakecounty_woodyplantsv2_p8_8.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871805/1272_usa_illinois_lakecounty_woodyplantsv2/corylus_americana_1272_usa_illinois_lakecounty_woodyplantsv2_p8_6.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871805/1272_usa_illinois_lakecounty_woodyplantsv2/corylus_americana_1272_usa_illinois_lakecounty_woodyplantsv2_p8_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871806/1272_usa_illinois_lakecounty_woodyplantsv2/corylus_americana_1272_usa_illinois_lakecounty_woodyplantsv2_p8_8.png"
    ],
    "page_number": 8
  },
  {
    "guide_id": 1272,
    "species_id": "sp_19",
    "scientific_name": "Lindera benzoin",
    "common_name": "Spicebush",
    "family": "Lauraceae",
    "photo_date": "9-14-17",
    "description": "Berries. More common in the southeast part of the region. Flowers and crushed leaves are aromatic. Bright red, flattened oval-shaped fruits. Only local species in the genus. Seeds are unusually tender – do not use a blender or other aggressive processing methods.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "lindera_benzoin_1272_usa_illinois_lakecounty_woodyplantsv2_p9_1.png",
      "lindera_benzoin_1272_usa_illinois_lakecounty_woodyplantsv2_p9_2.png",
      "lindera_benzoin_1272_usa_illinois_lakecounty_woodyplantsv2_p9_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871830/1272_usa_illinois_lakecounty_woodyplantsv2/lindera_benzoin_1272_usa_illinois_lakecounty_woodyplantsv2_p9_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871831/1272_usa_illinois_lakecounty_woodyplantsv2/lindera_benzoin_1272_usa_illinois_lakecounty_woodyplantsv2_p9_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871832/1272_usa_illinois_lakecounty_woodyplantsv2/lindera_benzoin_1272_usa_illinois_lakecounty_woodyplantsv2_p9_3.png"
    ],
    "page_number": 9
  },
  {
    "guide_id": 1272,
    "species_id": "sp_20",
    "scientific_name": "Viburnum lentago",
    "common_name": "Nannyberry",
    "family": "Adoxaceae",
    "photo_date": "9-12-17",
    "description": "Berries. Mama’s Boy. Viburnums are fantastic shrubs to use in restorations since they are rarely eaten by deer. This common species grows in wet to mesic, sun to shade environments. Look for opposite leaves and droopy clusters of dark blue-black fruits on vibrant red pedicels (the fruit/flower stems). Leaf stems have a skinny winged margin. End buds are unusually elongated. One of the larger species, up to 25’ tall.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "viburnum_lentago_1272_usa_illinois_lakecounty_woodyplantsv2_p9_4.png",
      "viburnum_lentago_1272_usa_illinois_lakecounty_woodyplantsv2_p9_5.png",
      "viburnum_lentago_1272_usa_illinois_lakecounty_woodyplantsv2_p9_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871891/1272_usa_illinois_lakecounty_woodyplantsv2/viburnum_lentago_1272_usa_illinois_lakecounty_woodyplantsv2_p9_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871891/1272_usa_illinois_lakecounty_woodyplantsv2/viburnum_lentago_1272_usa_illinois_lakecounty_woodyplantsv2_p9_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871892/1272_usa_illinois_lakecounty_woodyplantsv2/viburnum_lentago_1272_usa_illinois_lakecounty_woodyplantsv2_p9_6.png"
    ],
    "page_number": 9
  },
  {
    "guide_id": 1272,
    "species_id": "sp_21",
    "scientific_name": "Viburnum prunifolium",
    "common_name": "Black Haw",
    "family": "Adoxaceae",
    "photo_date": "12-3-17, 7-18-20",
    "description": "Berries. Mama’s Boy. Another Viburnum with dark blue-black fruits on drooping reddish pedicles. Bark is similar to hawthorns (haw). Mesic to dry woodlands & savannas, max 15’. Simple petioles, leaf tip can be rounded or pointed (V. lentago has winged or wavy petiole; abruptly pinches to a pointed tip). Leaves are usually much smaller than V. lentago.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "viburnum_prunifolium_1272_usa_illinois_lakecounty_woodyplantsv2_p9_7.png",
      "viburnum_prunifolium_1272_usa_illinois_lakecounty_woodyplantsv2_p9_8.png",
      "viburnum_prunifolium_1272_usa_illinois_lakecounty_woodyplantsv2_p9_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871895/1272_usa_illinois_lakecounty_woodyplantsv2/viburnum_prunifolium_1272_usa_illinois_lakecounty_woodyplantsv2_p9_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871895/1272_usa_illinois_lakecounty_woodyplantsv2/viburnum_prunifolium_1272_usa_illinois_lakecounty_woodyplantsv2_p9_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871896/1272_usa_illinois_lakecounty_woodyplantsv2/viburnum_prunifolium_1272_usa_illinois_lakecounty_woodyplantsv2_p9_9.png"
    ],
    "page_number": 9
  },
  {
    "guide_id": 1272,
    "species_id": "sp_22",
    "scientific_name": "Viburnum dentatum",
    "common_name": "Southern Arrowwood",
    "family": "Adoxaceae",
    "photo_date": "9-21-20",
    "description": "Berries. This Viburnum has prominent veins and coarse teeth on the margins, but it is not lobed. Often 3 or more branches at each node. Young branches have starry hairs, like little bristly starfish. Native to the east, most often found from planting projects but possibly an escapee from cultivation.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "viburnum_dentatum_1272_usa_illinois_lakecounty_woodyplantsv2_p10_1.png",
      "viburnum_dentatum_1272_usa_illinois_lakecounty_woodyplantsv2_p10_2.png",
      "viburnum_dentatum_1272_usa_illinois_lakecounty_woodyplantsv2_p10_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871889/1272_usa_illinois_lakecounty_woodyplantsv2/viburnum_dentatum_1272_usa_illinois_lakecounty_woodyplantsv2_p10_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871889/1272_usa_illinois_lakecounty_woodyplantsv2/viburnum_dentatum_1272_usa_illinois_lakecounty_woodyplantsv2_p10_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871890/1272_usa_illinois_lakecounty_woodyplantsv2/viburnum_dentatum_1272_usa_illinois_lakecounty_woodyplantsv2_p10_3.png"
    ],
    "page_number": 10
  },
  {
    "guide_id": 1272,
    "species_id": "sp_23",
    "scientific_name": "Viburnum opulus",
    "common_name": "European Cranberry Bush",
    "family": "Adoxaceae",
    "photo_date": "10-13-20",
    "description": "Berries. The common cranberry bush in our region. Leaves have 3 lobes, fruits are a bold red. Distinguish from the native V. trilobum by looking at the glands at the base of the leaf: this species has concave glands, like inner tubes or hemoglobin blood cells. The native species has glands like clubs or columns, never with a concave depression, and is incredibly rare. Nurseries misidentify these species too.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "viburnum_opulus_1272_usa_illinois_lakecounty_woodyplantsv2_p10_4.png",
      "viburnum_opulus_1272_usa_illinois_lakecounty_woodyplantsv2_p10_5.png",
      "viburnum_opulus_1272_usa_illinois_lakecounty_woodyplantsv2_p10_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871893/1272_usa_illinois_lakecounty_woodyplantsv2/viburnum_opulus_1272_usa_illinois_lakecounty_woodyplantsv2_p10_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871893/1272_usa_illinois_lakecounty_woodyplantsv2/viburnum_opulus_1272_usa_illinois_lakecounty_woodyplantsv2_p10_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871894/1272_usa_illinois_lakecounty_woodyplantsv2/viburnum_opulus_1272_usa_illinois_lakecounty_woodyplantsv2_p10_6.png"
    ],
    "page_number": 10
  },
  {
    "guide_id": 1272,
    "species_id": "sp_24",
    "scientific_name": "Viburnum acerifolium",
    "common_name": "Maple-leaved Arrowwood",
    "family": "Adoxaceae",
    "photo_date": "11-2-18",
    "description": "Berries. Mama’s Boy. A more conservative Viburnum, often in sandy or morainic soils. The species name literally means “maple-leaved.” Fruits are dark blue-black on red pedicles, but these stand upright. Reportedly prone to transplant shock, sowing seeds may be the best option.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "viburnum_acerifolium_1272_usa_illinois_lakecounty_woodyplantsv2_p10_7.png",
      "viburnum_acerifolium_1272_usa_illinois_lakecounty_woodyplantsv2_p10_8.png",
      "viburnum_acerifolium_1272_usa_illinois_lakecounty_woodyplantsv2_p10_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871887/1272_usa_illinois_lakecounty_woodyplantsv2/viburnum_acerifolium_1272_usa_illinois_lakecounty_woodyplantsv2_p10_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871887/1272_usa_illinois_lakecounty_woodyplantsv2/viburnum_acerifolium_1272_usa_illinois_lakecounty_woodyplantsv2_p10_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871888/1272_usa_illinois_lakecounty_woodyplantsv2/viburnum_acerifolium_1272_usa_illinois_lakecounty_woodyplantsv2_p10_9.png"
    ],
    "page_number": 10
  },
  {
    "guide_id": 1272,
    "species_id": "sp_25",
    "scientific_name": "Rosa carolina subsp. subserrulata",
    "common_name": "Prickly Pasture Rose",
    "family": "Rosaceae",
    "photo_date": "9-15-18",
    "description": "Berries. R. carolina has straight, needle-like prickles, paired at the stem nodes and often densely at the base; var. subserrulata also has prickles scattered throughout the stem. Usually 5-7 leaflets. Height usually 70 cm or less. Rose hips aka the fruit should be red-orange.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "rosa_carolina_1272_usa_illinois_lakecounty_woodyplantsv2_p11_1.png",
      "rosa_carolina_1272_usa_illinois_lakecounty_woodyplantsv2_p11_2.png",
      "rosa_carolina_1272_usa_illinois_lakecounty_woodyplantsv2_p11_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871865/1272_usa_illinois_lakecounty_woodyplantsv2/rosa_carolina_1272_usa_illinois_lakecounty_woodyplantsv2_p11_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871865/1272_usa_illinois_lakecounty_woodyplantsv2/rosa_carolina_1272_usa_illinois_lakecounty_woodyplantsv2_p11_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871866/1272_usa_illinois_lakecounty_woodyplantsv2/rosa_carolina_1272_usa_illinois_lakecounty_woodyplantsv2_p11_3.png"
    ],
    "page_number": 11
  },
  {
    "guide_id": 1272,
    "species_id": "sp_26",
    "scientific_name": "Rosa setigera var. tomentosa",
    "common_name": "Downy Illinois Rose",
    "family": "Rosaceae",
    "photo_date": "10-6-18",
    "description": "Berries. Mama’s Boy. Leaflets primarily in groups of 3, sometimes 5. Plants can be more than 1 m tall, found in wet to mesic open woodlands, marshes & sedge meadows, wet to dry mesic prairies. This variety has hairs all over the underside of the leaf face. The straight species is less common in the region and has hairs only on the veins or is hairless.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "rosa_setigera_1272_usa_illinois_lakecounty_woodyplantsv2_p11_4.png",
      "rosa_setigera_1272_usa_illinois_lakecounty_woodyplantsv2_p11_5.png",
      "rosa_setigera_1272_usa_illinois_lakecounty_woodyplantsv2_p11_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871869/1272_usa_illinois_lakecounty_woodyplantsv2/rosa_setigera_1272_usa_illinois_lakecounty_woodyplantsv2_p11_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871871/1272_usa_illinois_lakecounty_woodyplantsv2/rosa_setigera_1272_usa_illinois_lakecounty_woodyplantsv2_p11_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871872/1272_usa_illinois_lakecounty_woodyplantsv2/rosa_setigera_1272_usa_illinois_lakecounty_woodyplantsv2_p11_6.png"
    ],
    "page_number": 11
  },
  {
    "guide_id": 1272,
    "species_id": "sp_27",
    "scientific_name": "Rosa blanda",
    "common_name": "Early Wild Rose",
    "family": "Rosaceae",
    "photo_date": "10-9-19",
    "description": "Berries. Mama’s Boy. Leaflets 5-7. Marketed as “smooth rose,” this species can be completely thornless, but the lower stems often have slender prickles. Part shade to sunny, dry to wet. Most local Rosa species bloom Jun/Jul; this species usually starts in mid-May. Collect plump red hips.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "rosa_blanda_1272_usa_illinois_lakecounty_woodyplantsv2_p11_7.png",
      "rosa_blanda_1272_usa_illinois_lakecounty_woodyplantsv2_p11_8.png",
      "rosa_blanda_1272_usa_illinois_lakecounty_woodyplantsv2_p11_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871863/1272_usa_illinois_lakecounty_woodyplantsv2/rosa_blanda_1272_usa_illinois_lakecounty_woodyplantsv2_p11_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871863/1272_usa_illinois_lakecounty_woodyplantsv2/rosa_blanda_1272_usa_illinois_lakecounty_woodyplantsv2_p11_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871864/1272_usa_illinois_lakecounty_woodyplantsv2/rosa_blanda_1272_usa_illinois_lakecounty_woodyplantsv2_p11_9.png"
    ],
    "page_number": 11
  },
  {
    "guide_id": 1272,
    "species_id": "sp_28",
    "scientific_name": "Rosa multiflora",
    "common_name": "Multiflora Rose",
    "family": "Rosaceae",
    "photo_date": "9-26-20",
    "description": "Berries. Worthy of Sleeping Beauty’s castle, with its aggressively sprawling shape and wicked thorns. Many flowers (“multiflora”) become many red fruits (rose hips). Unique with fringed stipules: leafy bracts at the base of the leaf stalk are fringed, like eyelashes. Once promoted for erosion control, living fences, and wildlife; this species has since invaded pretty much every habitat, especially disturbed ones. Kill it.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "rosa_multiflora_1272_usa_illinois_lakecounty_woodyplantsv2_p12_1.png",
      "rosa_multiflora_1272_usa_illinois_lakecounty_woodyplantsv2_p12_2.png",
      "rosa_multiflora_1272_usa_illinois_lakecounty_woodyplantsv2_p12_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871867/1272_usa_illinois_lakecounty_woodyplantsv2/rosa_multiflora_1272_usa_illinois_lakecounty_woodyplantsv2_p12_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871868/1272_usa_illinois_lakecounty_woodyplantsv2/rosa_multiflora_1272_usa_illinois_lakecounty_woodyplantsv2_p12_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871869/1272_usa_illinois_lakecounty_woodyplantsv2/rosa_multiflora_1272_usa_illinois_lakecounty_woodyplantsv2_p12_3.png"
    ],
    "page_number": 12
  },
  {
    "guide_id": 1272,
    "species_id": "sp_29",
    "scientific_name": "Celastrus scandens",
    "common_name": "Climbing Bittersweet",
    "family": "Celastraceae",
    "photo_date": "9-18-19",
    "description": "Berries. This native bittersweet vine is overshadowed by its aggressive Oriental sister. The easiest way to tell these species apart is that C. scandens only has flowers & fruit at the tips of the terminal stems; the invasive C. orbiculatus forms tons of berries in the axils (where the leaves meet the stem).",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "celastrus_scandens_1272_usa_illinois_lakecounty_woodyplantsv2_p12_4.png",
      "celastrus_scandens_1272_usa_illinois_lakecounty_woodyplantsv2_p12_5.png",
      "celastrus_scandens_1272_usa_illinois_lakecounty_woodyplantsv2_p12_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871794/1272_usa_illinois_lakecounty_woodyplantsv2/celastrus_scandens_1272_usa_illinois_lakecounty_woodyplantsv2_p12_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871794/1272_usa_illinois_lakecounty_woodyplantsv2/celastrus_scandens_1272_usa_illinois_lakecounty_woodyplantsv2_p12_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871795/1272_usa_illinois_lakecounty_woodyplantsv2/celastrus_scandens_1272_usa_illinois_lakecounty_woodyplantsv2_p12_6.png"
    ],
    "page_number": 12
  },
  {
    "guide_id": 1272,
    "species_id": "sp_30",
    "scientific_name": "Celastrus orbiculatus",
    "common_name": "Oriental Bittersweet",
    "family": "Celastraceae",
    "photo_date": "11-4-19",
    "description": "Berries. Both sisters have round-ish leaves; C. scandens leaves are widest in the middle or closer to the stem, or oval shaped (C. orbiculatus is wider beyond the middle or completely round). C. orbiculatus is a jerk, able to strangle trees or swallow them up like kudzu. Kill it!",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "celastrus_orbiculatus_1272_usa_illinois_lakecounty_woodyplantsv2_p12_7.png",
      "celastrus_orbiculatus_1272_usa_illinois_lakecounty_woodyplantsv2_p12_8.png",
      "celastrus_orbiculatus_1272_usa_illinois_lakecounty_woodyplantsv2_p12_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871792/1272_usa_illinois_lakecounty_woodyplantsv2/celastrus_orbiculatus_1272_usa_illinois_lakecounty_woodyplantsv2_p12_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871793/1272_usa_illinois_lakecounty_woodyplantsv2/celastrus_orbiculatus_1272_usa_illinois_lakecounty_woodyplantsv2_p12_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871793/1272_usa_illinois_lakecounty_woodyplantsv2/celastrus_orbiculatus_1272_usa_illinois_lakecounty_woodyplantsv2_p12_9.png"
    ],
    "page_number": 12
  },
  {
    "guide_id": 1272,
    "species_id": "sp_31",
    "scientific_name": "Berberis thunbergii",
    "common_name": "Japanese Barberry",
    "family": "Berberidaceae",
    "photo_date": "9-25-20",
    "description": "Berries. Garden escapee. Clusters of spatula-shaped leaves on branches like octopus arms (when not shaped by gardeners). Pretty burgundy in fall, depending on the cultivar. Single spines, 1-few red fruits per cluster. Linked to higher presence of ticks & Lyme disease. Kill it.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "berberis_thunbergii_1272_usa_illinois_lakecounty_woodyplantsv2_p13_1.png",
      "berberis_thunbergii_1272_usa_illinois_lakecounty_woodyplantsv2_p13_2.png",
      "berberis_thunbergii_1272_usa_illinois_lakecounty_woodyplantsv2_p13_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871787/1272_usa_illinois_lakecounty_woodyplantsv2/berberis_thunbergii_1272_usa_illinois_lakecounty_woodyplantsv2_p13_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871788/1272_usa_illinois_lakecounty_woodyplantsv2/berberis_thunbergii_1272_usa_illinois_lakecounty_woodyplantsv2_p13_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871789/1272_usa_illinois_lakecounty_woodyplantsv2/berberis_thunbergii_1272_usa_illinois_lakecounty_woodyplantsv2_p13_3.png"
    ],
    "page_number": 13
  },
  {
    "guide_id": 1272,
    "species_id": "sp_32",
    "scientific_name": "Rhamnus cathartica",
    "common_name": "Common Buckthorn",
    "family": "Rhamnaceae",
    "photo_date": "9-27-20",
    "description": "Berries. This bully is abundant, alters soil chemistry & moisture, contains emodin which leaches into ephemeral pools and kills frogs, forms berries that are a laxative to birds, and shades out native species. Fruits are black; 3-year-old plants may form seed. Tips of stems have a small \"thorn” sandwiched between 2 dark buds, like a buck’s hoof. Gray bark, peeling with age; orange wood. Kill it.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "rhamnus_cathartica_1272_usa_illinois_lakecounty_woodyplantsv2_p13_4.png",
      "rhamnus_cathartica_1272_usa_illinois_lakecounty_woodyplantsv2_p13_5.png",
      "rhamnus_cathartica_1272_usa_illinois_lakecounty_woodyplantsv2_p13_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871845/1272_usa_illinois_lakecounty_woodyplantsv2/rhamnus_cathartica_1272_usa_illinois_lakecounty_woodyplantsv2_p13_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871846/1272_usa_illinois_lakecounty_woodyplantsv2/rhamnus_cathartica_1272_usa_illinois_lakecounty_woodyplantsv2_p13_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871847/1272_usa_illinois_lakecounty_woodyplantsv2/rhamnus_cathartica_1272_usa_illinois_lakecounty_woodyplantsv2_p13_6.png"
    ],
    "page_number": 13
  },
  {
    "guide_id": 1272,
    "species_id": "sp_33",
    "scientific_name": "Frangula alnus",
    "common_name": "Glossy Buckthorn",
    "family": "Rhamnaceae",
    "photo_date": "10-16-20",
    "description": "Berries. This invasive is contained to wetland habitats: fens, bogs, flatwoods, and old fields with high water tables. Leaves are glossy, especially in comparison to the more common R. cathartica, and leaf edges are entire (no serrations). Veins are prominent parallel lines, feathering out to the margins. Fruits red to black. Stems have prominent lenticels - light colored freckles against the dark bark.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "frangula_alnus_1272_usa_illinois_lakecounty_woodyplantsv2_p13_7.png",
      "frangula_alnus_1272_usa_illinois_lakecounty_woodyplantsv2_p13_8.png",
      "frangula_alnus_1272_usa_illinois_lakecounty_woodyplantsv2_p13_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871817/1272_usa_illinois_lakecounty_woodyplantsv2/frangula_alnus_1272_usa_illinois_lakecounty_woodyplantsv2_p13_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871818/1272_usa_illinois_lakecounty_woodyplantsv2/frangula_alnus_1272_usa_illinois_lakecounty_woodyplantsv2_p13_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871819/1272_usa_illinois_lakecounty_woodyplantsv2/frangula_alnus_1272_usa_illinois_lakecounty_woodyplantsv2_p13_9.png"
    ],
    "page_number": 13
  },
  {
    "guide_id": 1272,
    "species_id": "sp_34",
    "scientific_name": "Amorpha fruticosa",
    "common_name": "Indigo Bush",
    "family": "Fabaceae",
    "photo_date": "9-28-17",
    "description": "Shattering. Blooms just like A. canescens (lead plant) with purple flower & bright orange stamens, but this shrub grows to head height. Mini banana-shaped seed pods are quite different from its sister. Collect when brown. Wet to wet-mesic habitats, often near streams and rivers.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "amorpha_fruticosa_1272_usa_illinois_lakecounty_woodyplantsv2_p14_1.png",
      "amorpha_fruticosa_1272_usa_illinois_lakecounty_woodyplantsv2_p14_2.png",
      "amorpha_fruticosa_1272_usa_illinois_lakecounty_woodyplantsv2_p14_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871785/1272_usa_illinois_lakecounty_woodyplantsv2/amorpha_fruticosa_1272_usa_illinois_lakecounty_woodyplantsv2_p14_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871785/1272_usa_illinois_lakecounty_woodyplantsv2/amorpha_fruticosa_1272_usa_illinois_lakecounty_woodyplantsv2_p14_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871786/1272_usa_illinois_lakecounty_woodyplantsv2/amorpha_fruticosa_1272_usa_illinois_lakecounty_woodyplantsv2_p14_3.png"
    ],
    "page_number": 14
  },
  {
    "guide_id": 1272,
    "species_id": "sp_35",
    "scientific_name": "Staphylea trifolia",
    "common_name": "Bladdernut",
    "family": "Staphyleaceae",
    "photo_date": "10-7-17",
    "description": "Shattering. Mama’s Boy. This shrub forms dangling Chinese paper lanterns with 3 fused chambers, which can float downstream. A few glossy taupe seeds in each lantern. Leaflets in 3s. Forms rhizomatous colonies. Rich woodlands, wet to mesic, often growing just above wet places. Collect beige-brown lanterns. Sow promptly, seeds take a long time to germinate.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "staphylea_trifolia_1272_usa_illinois_lakecounty_woodyplantsv2_p14_4.png",
      "staphylea_trifolia_1272_usa_illinois_lakecounty_woodyplantsv2_p14_5.png",
      "staphylea_trifolia_1272_usa_illinois_lakecounty_woodyplantsv2_p14_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871881/1272_usa_illinois_lakecounty_woodyplantsv2/staphylea_trifolia_1272_usa_illinois_lakecounty_woodyplantsv2_p14_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871884/1272_usa_illinois_lakecounty_woodyplantsv2/staphylea_trifolia_1272_usa_illinois_lakecounty_woodyplantsv2_p14_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871884/1272_usa_illinois_lakecounty_woodyplantsv2/staphylea_trifolia_1272_usa_illinois_lakecounty_woodyplantsv2_p14_6.png"
    ],
    "page_number": 14
  },
  {
    "guide_id": 1272,
    "species_id": "sp_36",
    "scientific_name": "Ceanothus americanus",
    "common_name": "New Jersey Tea",
    "family": "Rhamnaceae",
    "photo_date": "10-8-18",
    "description": "Ballistic. This prairie shrub is naturally dwarf-sized and deer like to prune it even shorter. Capsules go from green, to black, then black crackled with beige (like a burnt marshmallow), before catapulting away. Collect capsules that are crackled or all black. Store in a sealed paper or mesh bag. Seeds are glossy little beans in assorted colors. Needs hot water scarification & cold-moist stratification to germinate.",
    "seed_group_names": [
      "Ballistic"
    ],
    "seed_group_details": [
      {
        "name": "Ballistic",
        "images": [
          "Ballistic_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Ballistic capsules catapult their babies away, up to 30 feet! Search YouTube for “exploding seeds” to see these in action. To harvest: learn the ripening sequence & harvest just before explosion; store in a *sealed* paper bag or mesh bag for a day or two."
      }
    ],
    "image_filenames": [
      "ceanothus_americanus_1272_usa_illinois_lakecounty_woodyplantsv2_p14_7.png",
      "ceanothus_americanus_1272_usa_illinois_lakecounty_woodyplantsv2_p14_8.png",
      "ceanothus_americanus_1272_usa_illinois_lakecounty_woodyplantsv2_p14_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871789/1272_usa_illinois_lakecounty_woodyplantsv2/ceanothus_americanus_1272_usa_illinois_lakecounty_woodyplantsv2_p14_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871790/1272_usa_illinois_lakecounty_woodyplantsv2/ceanothus_americanus_1272_usa_illinois_lakecounty_woodyplantsv2_p14_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871791/1272_usa_illinois_lakecounty_woodyplantsv2/ceanothus_americanus_1272_usa_illinois_lakecounty_woodyplantsv2_p14_9.png"
    ],
    "page_number": 14
  },
  {
    "guide_id": 1272,
    "species_id": "sp_37",
    "scientific_name": "Physocarpus opulifolius",
    "common_name": "Ninebark",
    "family": "Rosaceae",
    "photo_date": "10-9-17",
    "description": "Beaks. The many layers of peeling bark in assorted shades of brown give this shrub a distinct appearance. Loaded with white flowers. Seed capsules are clustered with 3 – 5 chambers, which split open to release tiny shiny seeds.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "physocarpus_opulifolius_1272_usa_illinois_lakecounty_woodyplantsv2_p15_1.png",
      "physocarpus_opulifolius_1272_usa_illinois_lakecounty_woodyplantsv2_p15_2.png",
      "physocarpus_opulifolius_1272_usa_illinois_lakecounty_woodyplantsv2_p15_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871839/1272_usa_illinois_lakecounty_woodyplantsv2/physocarpus_opulifolius_1272_usa_illinois_lakecounty_woodyplantsv2_p15_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871840/1272_usa_illinois_lakecounty_woodyplantsv2/physocarpus_opulifolius_1272_usa_illinois_lakecounty_woodyplantsv2_p15_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871841/1272_usa_illinois_lakecounty_woodyplantsv2/physocarpus_opulifolius_1272_usa_illinois_lakecounty_woodyplantsv2_p15_3.png"
    ],
    "page_number": 15
  },
  {
    "guide_id": 1272,
    "species_id": "sp_38",
    "scientific_name": "Ilex verticillata",
    "common_name": "Winterberry",
    "family": "Aquifoliaceae",
    "photo_date": "10-11-18",
    "description": "Berries. This native holly has dense clusters of red berries. Leaves are deciduous and light green. Flowers are in whorls (“verticillata”) around the leaf axils. Likes flatwoods, bogs, swamps. Collect Christmas-red berries.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "ilex_verticillata_1272_usa_illinois_lakecounty_woodyplantsv2_p15_4.png",
      "ilex_verticillata_1272_usa_illinois_lakecounty_woodyplantsv2_p15_5.png",
      "ilex_verticillata_1272_usa_illinois_lakecounty_woodyplantsv2_p15_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871825/1272_usa_illinois_lakecounty_woodyplantsv2/ilex_verticillata_1272_usa_illinois_lakecounty_woodyplantsv2_p15_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871826/1272_usa_illinois_lakecounty_woodyplantsv2/ilex_verticillata_1272_usa_illinois_lakecounty_woodyplantsv2_p15_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871828/1272_usa_illinois_lakecounty_woodyplantsv2/ilex_verticillata_1272_usa_illinois_lakecounty_woodyplantsv2_p15_6.png"
    ],
    "page_number": 15
  },
  {
    "guide_id": 1272,
    "species_id": "sp_39",
    "scientific_name": "Toxicodendron radicans",
    "common_name": "Poison Ivy",
    "family": "Anacardiaceae",
    "photo_date": "10-12-19",
    "description": "Berries. YIKES!! Don’t collect that! Leaflets three, leave it be, it’s poison ivy. Other natives have three leaflets but notice the centipede-like clinging aerial roots and creamy white ripe berries to confidently identify poison ivy. Here, a flock of yellow warblers chow down on it on their way south. No photographers were harmed in collecting these images.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "toxicodendron_radicans_1272_usa_illinois_lakecounty_woodyplantsv2_p15_7.png",
      "toxicodendron_radicans_1272_usa_illinois_lakecounty_woodyplantsv2_p15_8.png",
      "toxicodendron_radicans_1272_usa_illinois_lakecounty_woodyplantsv2_p15_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871885/1272_usa_illinois_lakecounty_woodyplantsv2/toxicodendron_radicans_1272_usa_illinois_lakecounty_woodyplantsv2_p15_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871886/1272_usa_illinois_lakecounty_woodyplantsv2/toxicodendron_radicans_1272_usa_illinois_lakecounty_woodyplantsv2_p15_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871886/1272_usa_illinois_lakecounty_woodyplantsv2/toxicodendron_radicans_1272_usa_illinois_lakecounty_woodyplantsv2_p15_9.png"
    ],
    "page_number": 15
  },
  {
    "guide_id": 1272,
    "species_id": "sp_40",
    "scientific_name": "Hypericum kalmianum",
    "common_name": "Kalm’s St. John’s Wort",
    "family": "Hypericaceae",
    "photo_date": "10-14-19",
    "description": "Beaks. An uncommon short shrub found close to Lake Michigan in wet to dry sand prairies and marly pannes. Yellow flowers loaded with so many stamens, it is like a yellow pompom was placed in the center. Bees love it! Capsules split into 5s. Flower clusters at tips only.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "hypericum_kalmianum_1272_usa_illinois_lakecounty_woodyplantsv2_p16_1.png",
      "hypericum_kalmianum_1272_usa_illinois_lakecounty_woodyplantsv2_p16_2.png",
      "hypericum_kalmianum_1272_usa_illinois_lakecounty_woodyplantsv2_p16_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871820/1272_usa_illinois_lakecounty_woodyplantsv2/hypericum_kalmianum_1272_usa_illinois_lakecounty_woodyplantsv2_p16_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871821/1272_usa_illinois_lakecounty_woodyplantsv2/hypericum_kalmianum_1272_usa_illinois_lakecounty_woodyplantsv2_p16_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871821/1272_usa_illinois_lakecounty_woodyplantsv2/hypericum_kalmianum_1272_usa_illinois_lakecounty_woodyplantsv2_p16_3.png"
    ],
    "page_number": 16
  },
  {
    "guide_id": 1272,
    "species_id": "sp_41",
    "scientific_name": "Hypericum prolificum",
    "common_name": "Shrubby St. John’s Wort",
    "family": "Hypericaceae",
    "photo_date": "10-14-19",
    "description": "Beaks. Very similar to H. kalmianum. Capsules split into 3s. This species flowers & seeds at the top *and* in the upper axils. Bark is slower to peel than its sister. An uncommon shrub found in mesic to dry savannas, prairies, and seeps; usually near bluffs. Short (less than 2 m).",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "hypericum_prolificum_1272_usa_illinois_lakecounty_woodyplantsv2_p16_4.png",
      "hypericum_prolificum_1272_usa_illinois_lakecounty_woodyplantsv2_p16_5.png",
      "hypericum_prolificum_1272_usa_illinois_lakecounty_woodyplantsv2_p16_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871822/1272_usa_illinois_lakecounty_woodyplantsv2/hypericum_prolificum_1272_usa_illinois_lakecounty_woodyplantsv2_p16_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871823/1272_usa_illinois_lakecounty_woodyplantsv2/hypericum_prolificum_1272_usa_illinois_lakecounty_woodyplantsv2_p16_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871824/1272_usa_illinois_lakecounty_woodyplantsv2/hypericum_prolificum_1272_usa_illinois_lakecounty_woodyplantsv2_p16_6.png"
    ],
    "page_number": 16
  },
  {
    "guide_id": 1272,
    "species_id": "sp_42",
    "scientific_name": "Ligustrum vulgare",
    "common_name": "Common Privet",
    "family": "Oleaceae",
    "photo_date": "10-24-20",
    "description": "Berries. Privets are native to Europe & Asia and escape from hedgerows. Leaves are ladder-like and persist into early winter in shades of yellow-green, burgundy, or purple. Fruits are dark blue-black, clustered at the tips of branches. The other non-native privet has hairs of mixed lengths; this species is hairless or even-lengthe hairs.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "ligustrum_vulgare_1272_usa_illinois_lakecounty_woodyplantsv2_p16_7.png",
      "ligustrum_vulgare_1272_usa_illinois_lakecounty_woodyplantsv2_p16_8.png",
      "ligustrum_vulgare_1272_usa_illinois_lakecounty_woodyplantsv2_p16_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871828/1272_usa_illinois_lakecounty_woodyplantsv2/ligustrum_vulgare_1272_usa_illinois_lakecounty_woodyplantsv2_p16_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871829/1272_usa_illinois_lakecounty_woodyplantsv2/ligustrum_vulgare_1272_usa_illinois_lakecounty_woodyplantsv2_p16_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871829/1272_usa_illinois_lakecounty_woodyplantsv2/ligustrum_vulgare_1272_usa_illinois_lakecounty_woodyplantsv2_p16_9.png"
    ],
    "page_number": 16
  },
  {
    "guide_id": 1272,
    "species_id": "sp_43",
    "scientific_name": "Euonymus atropurpureus",
    "common_name": "Wahoo",
    "family": "Celastraceae",
    "photo_date": "10-24-20",
    "description": "Berries. The only native upright Euonymus, this species has long petioles (typically 1 cm) and purple flowers. Leaves are hairy on the underside. Stems become ridged but not winged. Euonymus seeds are wrapped up in many layers: capsules are crimson, berries (arils) inside are red, seeds are white.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "euonymus_atropurpureus_1272_usa_illinois_lakecounty_woodyplantsv2_p17_1.png",
      "euonymus_atropurpureus_1272_usa_illinois_lakecounty_woodyplantsv2_p17_2.png",
      "euonymus_atropurpureus_1272_usa_illinois_lakecounty_woodyplantsv2_p17_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871812/1272_usa_illinois_lakecounty_woodyplantsv2/euonymus_atropurpureus_1272_usa_illinois_lakecounty_woodyplantsv2_p17_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871812/1272_usa_illinois_lakecounty_woodyplantsv2/euonymus_atropurpureus_1272_usa_illinois_lakecounty_woodyplantsv2_p17_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871814/1272_usa_illinois_lakecounty_woodyplantsv2/euonymus_atropurpureus_1272_usa_illinois_lakecounty_woodyplantsv2_p17_3.png"
    ],
    "page_number": 17
  },
  {
    "guide_id": 1272,
    "species_id": "sp_44",
    "scientific_name": "Euonymus alatus",
    "common_name": "Winged Euonymus",
    "family": "Celastraceae",
    "photo_date": "10-30-20",
    "description": "Berries. An escapee from gardens, this species is readily identified by the winged stems. Found in many woodlands, especially in upland disturbed woods. Seed capsules are purple, berries (arils) are red-orange, seeds are white.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "euonymus_alatus_1272_usa_illinois_lakecounty_woodyplantsv2_p17_4.png",
      "euonymus_alatus_1272_usa_illinois_lakecounty_woodyplantsv2_p17_5.png",
      "euonymus_alatus_1272_usa_illinois_lakecounty_woodyplantsv2_p17_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871809/1272_usa_illinois_lakecounty_woodyplantsv2/euonymus_alatus_1272_usa_illinois_lakecounty_woodyplantsv2_p17_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871810/1272_usa_illinois_lakecounty_woodyplantsv2/euonymus_alatus_1272_usa_illinois_lakecounty_woodyplantsv2_p17_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871811/1272_usa_illinois_lakecounty_woodyplantsv2/euonymus_alatus_1272_usa_illinois_lakecounty_woodyplantsv2_p17_6.png"
    ],
    "page_number": 17
  },
  {
    "guide_id": 1272,
    "species_id": "sp_45",
    "scientific_name": "Euonymus europaeus",
    "common_name": "European Spindle Tree",
    "family": "Celastraceae",
    "photo_date": "11-2-20",
    "description": "Berries. An escapee from gardens, this species has stems that are ridged but not winged. Leaves are hairless, and have an elongated tip. Seed capsule pink to red, berries (arils) are orange, seeds are white.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "euonymus_europaeus_1272_usa_illinois_lakecounty_woodyplantsv2_p17_7.png",
      "euonymus_europaeus_1272_usa_illinois_lakecounty_woodyplantsv2_p17_8.png",
      "euonymus_europaeus_1272_usa_illinois_lakecounty_woodyplantsv2_p17_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871815/1272_usa_illinois_lakecounty_woodyplantsv2/euonymus_europaeus_1272_usa_illinois_lakecounty_woodyplantsv2_p17_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871816/1272_usa_illinois_lakecounty_woodyplantsv2/euonymus_europaeus_1272_usa_illinois_lakecounty_woodyplantsv2_p17_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871816/1272_usa_illinois_lakecounty_woodyplantsv2/euonymus_europaeus_1272_usa_illinois_lakecounty_woodyplantsv2_p17_9.png"
    ],
    "page_number": 17
  },
  {
    "guide_id": 1272,
    "species_id": "sp_46",
    "scientific_name": "Rhus typhina",
    "common_name": "Staghorn Sumac",
    "family": "Anacardiaceae",
    "photo_date": "11-2-20",
    "description": "Berries. Sumacs are another native shrub that inspires mixed reactions. Lovely fall color, but overwhelms grasslands without fire. Forms dense thickets, great for pollinators, birds, and mammals. This species has hairy branches, like velvety antlers, including 2nd-year branches. Fruits are hairy with thin needle-like hairs, many 1.5 mm or longer. Leaves have serrated edges but are not divided.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "rhus_typhina_1272_usa_illinois_lakecounty_woodyplantsv2_p18_1.png",
      "rhus_typhina_1272_usa_illinois_lakecounty_woodyplantsv2_p18_2.png",
      "rhus_typhina_1272_usa_illinois_lakecounty_woodyplantsv2_p18_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871851/1272_usa_illinois_lakecounty_woodyplantsv2/rhus_typhina_1272_usa_illinois_lakecounty_woodyplantsv2_p18_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871851/1272_usa_illinois_lakecounty_woodyplantsv2/rhus_typhina_1272_usa_illinois_lakecounty_woodyplantsv2_p18_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871852/1272_usa_illinois_lakecounty_woodyplantsv2/rhus_typhina_1272_usa_illinois_lakecounty_woodyplantsv2_p18_3.png"
    ],
    "page_number": 18
  },
  {
    "guide_id": 1272,
    "species_id": "sp_47",
    "scientific_name": "Rhus glabra",
    "common_name": "Smooth Sumac",
    "family": "Anacardiaceae",
    "photo_date": "12-25-18",
    "description": "Berries. The branches of R. glabra are “glabrous” (hairless) and smooth. The fruits are also relatively smooth, hairs are 0.2 mm or shorter and noticed by touch rather than sight.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "rhus_glabra_1272_usa_illinois_lakecounty_woodyplantsv2_p18_4.png",
      "rhus_glabra_1272_usa_illinois_lakecounty_woodyplantsv2_p18_5.png",
      "rhus_glabra_1272_usa_illinois_lakecounty_woodyplantsv2_p18_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871849/1272_usa_illinois_lakecounty_woodyplantsv2/rhus_glabra_1272_usa_illinois_lakecounty_woodyplantsv2_p18_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871850/1272_usa_illinois_lakecounty_woodyplantsv2/rhus_glabra_1272_usa_illinois_lakecounty_woodyplantsv2_p18_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871850/1272_usa_illinois_lakecounty_woodyplantsv2/rhus_glabra_1272_usa_illinois_lakecounty_woodyplantsv2_p18_6.png"
    ],
    "page_number": 18
  },
  {
    "guide_id": 1272,
    "species_id": "sp_48",
    "scientific_name": "Rhus x pulvinata",
    "common_name": "Northern Sumac (R. glabra x typhina)",
    "family": "Anacardiaceae",
    "photo_date": "12-25-18",
    "description": "Berries. A natural hybrid between smooth & staghorn sumac. This species has fuzzy new branches (same as R. typhina) but smooth 2nd year branches (like R. glabra). The fruit hairs on R. glabra are typically less than 0.5 mm, R. typhina hairs are mostly 1.5 mm long; this hybrid has hairs in between.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "rhus_x_1272_usa_illinois_lakecounty_woodyplantsv2_p18_7.png",
      "rhus_x_1272_usa_illinois_lakecounty_woodyplantsv2_p18_8.png",
      "rhus_x_1272_usa_illinois_lakecounty_woodyplantsv2_p18_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871853/1272_usa_illinois_lakecounty_woodyplantsv2/rhus_x_1272_usa_illinois_lakecounty_woodyplantsv2_p18_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871854/1272_usa_illinois_lakecounty_woodyplantsv2/rhus_x_1272_usa_illinois_lakecounty_woodyplantsv2_p18_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871854/1272_usa_illinois_lakecounty_woodyplantsv2/rhus_x_1272_usa_illinois_lakecounty_woodyplantsv2_p18_9.png"
    ],
    "page_number": 18
  },
  {
    "guide_id": 1272,
    "species_id": "sp_49",
    "scientific_name": "Dasiphora fruticosa",
    "common_name": "Shrubby Cinquefoil",
    "family": "Rosaceae",
    "photo_date": "10-28-20",
    "description": "Beaks. This dwarf shrub is often only 2-3 feet tall. Sunny yellow flowers like cinquefoils in the Potentilla genus, but with woody stems. Leaves are divided, usually 5-7 leaflets. Leaves covered in silky hairs, especially on the underside. Calyx surrounding the seeds is also hairy. This uncommon shrub grows on beach ridges along Lake Michigan, and also in fens.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "dasiphora_fruticosa_1272_usa_illinois_lakecounty_woodyplantsv2_p19_1.png",
      "dasiphora_fruticosa_1272_usa_illinois_lakecounty_woodyplantsv2_p19_2.png",
      "dasiphora_fruticosa_1272_usa_illinois_lakecounty_woodyplantsv2_p19_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871807/1272_usa_illinois_lakecounty_woodyplantsv2/dasiphora_fruticosa_1272_usa_illinois_lakecounty_woodyplantsv2_p19_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871808/1272_usa_illinois_lakecounty_woodyplantsv2/dasiphora_fruticosa_1272_usa_illinois_lakecounty_woodyplantsv2_p19_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871809/1272_usa_illinois_lakecounty_woodyplantsv2/dasiphora_fruticosa_1272_usa_illinois_lakecounty_woodyplantsv2_p19_3.png"
    ],
    "page_number": 19
  },
  {
    "guide_id": 1272,
    "species_id": "sp_50",
    "scientific_name": "Cephalanthus occidentalis",
    "common_name": "Buttonbush",
    "family": "Rubiaceae",
    "photo_date": "11-2-18",
    "description": "Crumbly Coneheads. Loves standing water, can form small thickets in shady ponds that birds love. A white pincushion of flowers, which becomes a crumbly globe of seed – both are distinctive. Collect when easily crumbles by hand.",
    "seed_group_names": [
      "Coneheads"
    ],
    "seed_group_details": [
      {
        "name": "Coneheads",
        "images": [
          "Coneheads_1272_usa_illinois_lakecounty_woodyplantsv2_page1_img1.png"
        ],
        "description": "Coneheads are flowers with a cone-shaped center. Imagine these flowers without their colorful parts, and you know exactly what they look like when seeds are ripe."
      }
    ],
    "image_filenames": [
      "cephalanthus_occidentalis_1272_usa_illinois_lakecounty_woodyplantsv2_p19_4.png",
      "cephalanthus_occidentalis_1272_usa_illinois_lakecounty_woodyplantsv2_p19_5.png",
      "cephalanthus_occidentalis_1272_usa_illinois_lakecounty_woodyplantsv2_p19_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871796/1272_usa_illinois_lakecounty_woodyplantsv2/cephalanthus_occidentalis_1272_usa_illinois_lakecounty_woodyplantsv2_p19_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871797/1272_usa_illinois_lakecounty_woodyplantsv2/cephalanthus_occidentalis_1272_usa_illinois_lakecounty_woodyplantsv2_p19_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766871798/1272_usa_illinois_lakecounty_woodyplantsv2/cephalanthus_occidentalis_1272_usa_illinois_lakecounty_woodyplantsv2_p19_6.png"
    ],
    "page_number": 19
  },
  {
    "guide_id": 1273,
    "species_id": "sp_1",
    "scientific_name": "Carex stipata",
    "common_name": "Common Fox Sedge",
    "family": "Cyperaceae",
    "photo_date": "6-12-19",
    "description": "Common sedge of wet habitats, aka awl-fruited sedge, referring to the long beak. Fox sedges tend to resemble bushy fox tails, with densely clustered pointed seeds. This species has rugose (wrinkly) sheaths. Stems are thick, but easily compressed.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_stipata_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p3_1.png",
      "carex_stipata_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p3_2.png",
      "carex_stipata_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p3_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859682/carex_stipata_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p3_1_d2dqwu.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859690/carex_stipata_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p3_2_vzcpo2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859690/carex_stipata_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p3_3_sqdq6p.png"
    ],
    "page_number": 3
  },
  {
    "guide_id": 1273,
    "species_id": "sp_2",
    "scientific_name": "Carex tenera",
    "common_name": "Narrow-leaved Oval Sedge",
    "family": "Cyperaceae",
    "photo_date": "6-19-17",
    "description": "One of the “Oh no - Oval sedges!” Wide leaves, less than 3 mm wide, and look for some separation between the spikelets (pinecones of seed). The spike is often nodding or arched at harvest time. Perigynia, pistillate scales, and sheaths are useful to ID from other oval sedges.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_tenera_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p3_4.png",
      "carex_tenera_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p3_5.png",
      "carex_tenera_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p3_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859697/carex_tenera_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p3_4_nma7l8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859698/carex_tenera_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p3_5_t6cfij.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859698/carex_tenera_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p3_6_ccsfxw.png"
    ],
    "page_number": 3
  },
  {
    "guide_id": 1273,
    "species_id": "sp_3",
    "scientific_name": "Carex stricta",
    "common_name": "Common Tussock Sedge",
    "family": "Cyperaceae",
    "photo_date": "6-29-18",
    "description": "As this name says, this species is common and forms tussocks (mounds, like prairie dropseed) that are easily discovered while tripping your way through a wetland. Seeds are small and tightly packed; initially green with brown scales before ripening to a light brown. Most spikes are staminate at the tip. Lowest leaf sheaths disintegrate to look like the laces of a boot, or a rope net. Easily crumbles by hand.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_stricta_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p3_7.png",
      "carex_stricta_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p3_8.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859691/carex_stricta_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p3_7_jngvb6.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859692/carex_stricta_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p3_8_ja0n5o.png"
    ],
    "page_number": 3
  },
  {
    "guide_id": 1273,
    "species_id": "sp_4",
    "scientific_name": "Carex annectens var. xanthocarpa",
    "common_name": "Small-seeded Fox Sedge",
    "family": "Cyperaceae",
    "photo_date": "6-27-18",
    "description": "Happiest in full sun & damp places but can grow in part shade & mesic soils. Seeds are small & yellow, sheaths are wrinkly. Seeds are slightly smaller & spikes are slightly shorter than the straight species C. annectens. The variety xanthocarpa is more common in the region.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_annectens_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p4_1.png",
      "carex_annectens_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p4_2.png",
      "carex_annectens_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p4_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859625/carex_annectens_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p4_1_coohnp.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859626/carex_annectens_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p4_2_fyhcvr.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859626/carex_annectens_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p4_3_zg8r7b.png"
    ],
    "page_number": 4
  },
  {
    "guide_id": 1273,
    "species_id": "sp_5",
    "scientific_name": "Carex vulpinoidea",
    "common_name": "Brown Fox Sedge",
    "family": "Cyperaceae",
    "photo_date": "8-8-2017",
    "description": "C. vulpinoidea is similar to C. annectens but leaf blades are similar height or taller than fruiting stems; the 2 varieties of C. annectens typically have fruiting stems taller than leaf blades. C. vulpinoidea typically has a more prominent bract at the base of the spikelet, the spikes are often more than 5.5 cm long, and the perigynia have longer beaks relative to the winged body.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_vulpinoidea_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p4_4.png",
      "carex_vulpinoidea_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p4_5.png",
      "carex_vulpinoidea_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p4_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859712/carex_vulpinoidea_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p4_4_nhskh5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859715/carex_vulpinoidea_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p4_5_naibju.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859714/carex_vulpinoidea_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p4_6_dkaglp.png"
    ],
    "page_number": 4
  },
  {
    "guide_id": 1273,
    "species_id": "sp_6",
    "scientific_name": "Carex pellita",
    "common_name": "Prairie Woolly Sedge",
    "family": "Cyperaceae",
    "photo_date": "7-3-19",
    "description": "One of the granular-seeded sedges, notable for its woolly (like peach fuzz) perigynia. Perigynium color is variable – pale green, yellow, or purplish before drying to a muted brown. Consult leaves & perigynia size. Common in wetlands and plays well with other natives.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_pellita_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p4_7.png",
      "carex_pellita_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p4_8.png",
      "carex_pellita_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p4_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859660/carex_pellita_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p4_7_pzrwen.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859660/carex_pellita_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p4_8_fqmqqf.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859662/carex_pellita_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p4_9_urhpdc.png"
    ],
    "page_number": 4
  },
  {
    "guide_id": 1273,
    "species_id": "sp_7",
    "scientific_name": "Carex sartwellii",
    "common_name": "Running Prairie Sedge",
    "family": "Cyperaceae",
    "photo_date": "7-3-19",
    "description": "A rhizomatous species of full sun wetlands. Isolated stalks sprout up from the creeping roots, and there are more sterile stalks than fertile ones. Most sedge species are clumping or grow in dense mats; the single stalks are a key feature to narrow down the ID.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_sartwellii_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p5_1.png",
      "carex_sartwellii_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p5_2.png",
      "carex_sartwellii_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p5_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859673/carex_sartwellii_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p5_1_sics9n.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859673/carex_sartwellii_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p5_2_t0vfgb.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859674/carex_sartwellii_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p5_3_x18k5x.png"
    ],
    "page_number": 5
  },
  {
    "guide_id": 1273,
    "species_id": "sp_8",
    "scientific_name": "Carex buxbaumii",
    "common_name": "Dark-scaled Sedge",
    "family": "Cyperaceae",
    "photo_date": "7-4-19",
    "description": "Plump mint chocolate chip spikelets: pale green seed interspersed with dark chocolate scales. ID can be fairly certain from spikes alone, but can be confirmed by rhizomes, stem bases, and leaf width. Old seeds may turn brown.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_buxbaumii_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p5_4.png",
      "carex_buxbaumii_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p5_5.png",
      "carex_buxbaumii_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p5_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859631/carex_buxbaumii_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p5_4_umaas0.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859630/carex_buxbaumii_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p5_5_y1rr2x.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859631/carex_buxbaumii_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p5_6_e2r7ul.png"
    ],
    "page_number": 5
  },
  {
    "guide_id": 1273,
    "species_id": "sp_9",
    "scientific_name": "Carex bromoides",
    "common_name": "Brome Tussock Sedge",
    "family": "Cyperaceae",
    "photo_date": "7-8-19",
    "description": "State threatened, abundant in flatwoods. Forms tussocks (mounds) like C. stricta, but a shorter stature plant and seeds are clearly different – thin lance-shaped perigynia. Sheaths have curved thickened hyaline (translucent) bands. Hyaline features of native plants are typically translucent off-white, like a fingernail.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_bromoides_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p5_7.png",
      "carex_bromoides_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p5_8.png",
      "carex_bromoides_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p5_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859627/carex_bromoides_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p5_7_uc4jlr.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859628/carex_bromoides_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p5_8_odzssd.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859629/carex_bromoides_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p5_9_wqzrhj.png"
    ],
    "page_number": 5
  },
  {
    "guide_id": 1273,
    "species_id": "sp_10",
    "scientific_name": "Carex lacustris",
    "common_name": "Common Lake Sedge",
    "family": "Cyperaceae",
    "photo_date": "7-12-20",
    "description": "Common in wetlands. Plants are tall (often 1 meter or taller), completely hairless, and form dense colonies. Leaves are wide (1-2 cm wide). Sheath is reddish (when fresh) and has a fibrous ladder pattern. The ligule (where the leaf meets the stem) is taller than wide, like a church steeple. Perigynia have a gentle taper and a small beak with tiny teeth. It is so effective at spreading by rhizomes that seeds are uncommon.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_lacustris_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p6_1.png",
      "carex_lacustris_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p6_2.png",
      "carex_lacustris_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p6_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859652/carex_lacustris_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p6_1_wmx3jm.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859652/carex_lacustris_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p6_2_kwvqnc.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859653/carex_lacustris_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p6_3_zprjx1.png"
    ],
    "page_number": 6
  },
  {
    "guide_id": 1273,
    "species_id": "sp_11",
    "scientific_name": "Carex hyalinolepis",
    "common_name": "Southern Lake Sedge",
    "family": "Cyperaceae",
    "photo_date": "7-5-20",
    "description": "A new record for the county and new species addition to Flora. Likely present in other preserves and incorrectly identified as C. lacustris. These 2 Carex are very similar. This species has evergreen blades in winter and spikes of seeds are longer. Ligule (the inside of the collar) is rounded rather than pointed; leaf sheath is generally not ladder-like. The observed population produced many fruiting stalks.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_hyalinolepis_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p6_4.png",
      "carex_hyalinolepis_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p6_5.png",
      "carex_hyalinolepis_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p6_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859638/carex_hyalinolepis_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p6_4_jklenf.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859638/carex_hyalinolepis_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p6_5_nklmov.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859639/carex_hyalinolepis_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p6_6_ra3nix.png"
    ],
    "page_number": 6
  },
  {
    "guide_id": 1273,
    "species_id": "sp_12",
    "scientific_name": "Carex crus-corvi",
    "common_name": "Crowfoot Fox Sedge",
    "family": "Cyperaceae",
    "photo_date": "7-24-19",
    "description": "A rare Carex with unique seeds that can’t be mistaken: extra-long beaks & an abrupt cap at the base of each perigynium. A dense, bristly spike, like other fox sedges. Loves flatwoods and edges of ephemeral ponds.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_cruscorvi_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p6_7.png",
      "carex_cruscorvi_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p6_8.png",
      "carex_cruscorvi_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p6_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859636/carex_cruscorvi_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p6_7_w4zjsl.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859637/carex_cruscorvi_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p6_8_ulbtdk.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859637/carex_cruscorvi_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p6_9_mekjyn.png"
    ],
    "page_number": 6
  },
  {
    "guide_id": 1273,
    "species_id": "sp_13",
    "scientific_name": "Carex squarrosa",
    "common_name": "Narrow-leaved Cattail Sedge",
    "family": "Cyperaceae",
    "photo_date": "8-1-17",
    "description": "Another unique Carex. Look for spikey eggs, usually one egg per stalk. Stalks are usually upright. Similar Carex species have spikelets that are cucumbers rather than egg-shaped, often nodding. Likes shady edges of standing water. Crumbles when ripe; collect by hand or snip.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_squarrosa_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p7_1.png",
      "carex_squarrosa_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p7_2.png",
      "carex_squarrosa_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p7_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859681/carex_squarrosa_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p7_1_qwnivt.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859681/carex_squarrosa_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p7_2_xppt26.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859681/carex_squarrosa_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p7_3_jmanev.png"
    ],
    "page_number": 7
  },
  {
    "guide_id": 1273,
    "species_id": "sp_14",
    "scientific_name": "Carex cristatella",
    "common_name": "Crested Oval Sedge",
    "family": "Cyperaceae",
    "photo_date": "8-5-17",
    "description": "Another tough-to-ID oval sedge. Tightly packed bristly & round oval spikelets (the pinecone-like clusters of seeds). Found in full sun to medium shade. The roundness of the spikelets and the number of spikelets are fairly indicative, but consult sheath characteristics to be sure.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_cristatella_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p7_4.png",
      "carex_cristatella_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p7_5.png",
      "carex_cristatella_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p7_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859632/carex_cristatella_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p7_4_sn5piy.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859632/carex_cristatella_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p7_5_uput4q.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859633/carex_cristatella_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p7_6_tq0xgk.png"
    ],
    "page_number": 7
  },
  {
    "guide_id": 1273,
    "species_id": "sp_15",
    "scientific_name": "Carex scoparia",
    "common_name": "Broom Oval Sedge",
    "family": "Cyperaceae",
    "photo_date": "8-7-19",
    "description": "Another oval sedge with crowded spikelets, but these have pointed oval spikelets. Another name is pointed broom sedge. Note the skinny leaf blades that are shorter than the main steam. Leaf blade midrib is a ridge on the side away from the stem, and the sheath has a thin translucent band at the summit. Typically full sun, wet to moist conditions. Crumbles easily when ripe, collect by hand or snip stalks.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_scoparia_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p7_7.png",
      "carex_scoparia_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p7_8.png",
      "carex_scoparia_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p7_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859674/carex_scoparia_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p7_7_dbl52k.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859681/carex_scoparia_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p7_8_okamiz.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859680/carex_scoparia_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p7_9_c5k1eq.png"
    ],
    "page_number": 7
  },
  {
    "guide_id": 1273,
    "species_id": "sp_16",
    "scientific_name": "Carex tribuloides",
    "common_name": "Awl-fruited Oval Sedge",
    "family": "Cyperaceae",
    "photo_date": "8-8-17",
    "description": "Aka blunt broom sedge. Resembles C. scoparia, but this species has blunter, less pointed spikelets. Leafy stems, loose sheaths, and the number of perigynia per spikelet will help with ID. Grows in marshes & flatwoods. Crumbles easily when ripe, collect by hand or snip stalks.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_tribuloides_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p8_1.png",
      "carex_tribuloides_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p8_2.png",
      "carex_tribuloides_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p8_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859699/carex_tribuloides_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p8_1_pwth7h.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859700/carex_tribuloides_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p8_2_qp2re4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859700/carex_tribuloides_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p8_3_kt64pk.png"
    ],
    "page_number": 8
  },
  {
    "guide_id": 1273,
    "species_id": "sp_17",
    "scientific_name": "Carex hystericina",
    "common_name": "Porcupine Sedge",
    "family": "Cyperaceae",
    "photo_date": "8-8-17",
    "description": "A prickly cucumber of seeds that may poke into your skin (gloves recommended for collecting). Perigynia are slightly inflated. Pedicels (the ‘petiole’ or stalk to the spikelet) are shorter than other similar prickly cucumber sedges; spikelets are also shorter (fewer perigynia per spikelet). Perigynia are yellow to brown when ripe; spikelet crumbles easily.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_hystericina_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p8_4.png",
      "carex_hystericina_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p8_5.png",
      "carex_hystericina_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p8_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859644/carex_hystericina_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p8_4_myux5p.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859643/carex_hystericina_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p8_5_ew8ufo.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859643/carex_hystericina_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p8_6_wtfhjj.png"
    ],
    "page_number": 8
  },
  {
    "guide_id": 1273,
    "species_id": "sp_18",
    "scientific_name": "Carex intumescens",
    "common_name": "Shining Bur Sedge",
    "family": "Cyperaceae",
    "photo_date": "8-10-18",
    "description": "State threatened. One of the big “super sedges” – the large perigynia are similarly sized to the common C. grayi & C. lupulina. Spikelets have only a few seeds, often looks like 1/3 of the C. grayi “medieval mace.” Perigynia are in a cylindrical or round-cylindrical arrangement, and beaks point out or up, never down.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_intumescens_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p8_7.png",
      "carex_intumescens_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p8_8.png",
      "carex_intumescens_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p8_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859645/carex_intumescens_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p8_7_elf1v0.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859645/carex_intumescens_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p8_8_eaydtc.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859646/carex_intumescens_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p8_9_stfxkj.png"
    ],
    "page_number": 8
  },
  {
    "guide_id": 1273,
    "species_id": "sp_19",
    "scientific_name": "Carex muskingumensis",
    "common_name": "Swamp Oval Sedge",
    "family": "Cyperaceae",
    "photo_date": "8-17-19",
    "description": "A unique-looking oval sedge (hooray!): the perigynia are unusually long, the spikelets are long & pointed, and the plants are leafy & palmlike (aka palm sedge). Leaves arranged like a spiral staircase, clearly in 3 ranks when viewed from above. Loves floodplain forests.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_muskingumensis_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p9_1.png",
      "carex_muskingumensis_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p9_2.png",
      "carex_muskingumensis_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p9_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859653/carex_muskingumensis_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p9_1_fp0yhl.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859659/carex_muskingumensis_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p9_2_atpems.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859659/carex_muskingumensis_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p9_3_kidzqv.png"
    ],
    "page_number": 9
  },
  {
    "guide_id": 1273,
    "species_id": "sp_20",
    "scientific_name": "Carex retrorsa",
    "common_name": "Deflexed Bottlebrush Sedge",
    "family": "Cyperaceae",
    "photo_date": "8-17-20",
    "description": "Somewhat similar to C. hystericina, but taller plants (1 m), and the lowest perigynia reflex, with beaks pointing towards the ground. Spikes of seeds have tiny peduncle stalks; most are essentially sessile but occasionally one has a short stalk. Wet prairies & woodlands.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_retrorsa_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p9_4.png",
      "carex_retrorsa_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p9_5.png",
      "carex_retrorsa_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p9_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859667/carex_retrorsa_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p9_4_htnloc.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859668/carex_retrorsa_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p9_5_dsluby.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859668/carex_retrorsa_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p9_6_nxk3qz.png"
    ],
    "page_number": 9
  },
  {
    "guide_id": 1273,
    "species_id": "sp_21",
    "scientific_name": "Carex viridula",
    "common_name": "Green Yellow Sedge",
    "family": "Cyperaceae",
    "photo_date": "8-21-20",
    "description": "This state threatened species is found in fens and the swales & pannés near Lake Michigan. Petite, often ankle- to shin-high. Similar to C. cryptolepis. Fruits are generally green or beige when ripe, rather than yellow-green. Use the touch test to determine if ripe. Perigynia are smaller, 3 mm or less (vs. 4.5 – 5 mm long for C. cryptolepis).",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_viridula_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p9_7.png",
      "carex_viridula_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p9_8.png",
      "carex_viridula_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p9_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859707/carex_viridula_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p9_7_z5mnmt.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859707/carex_viridula_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p9_8_nkdgce.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859707/carex_viridula_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p9_9_ikdor6.png"
    ],
    "page_number": 9
  },
  {
    "guide_id": 1273,
    "species_id": "sp_22",
    "scientific_name": "Bolboschoenus fluviatilis",
    "common_name": "River Bulrush",
    "family": "Cyperaceae",
    "photo_date": "8-1-18",
    "description": "This big beautiful beast densely fills in wetlands and has a mixed reputation due to its aggressive nature. Do not use in delicate sedge meadows, but well suited for wetlands challenged with cattails & Phragmites. Big spikelets with big seeds that will fall out when crumbled. Collect by hand or snip stalks & process against a sturdy screen.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "bolboschoenus_fluviatilis_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p10_1.png",
      "bolboschoenus_fluviatilis_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p10_2.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859623/bolboschoenus_fluviatilis_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p10_1_vgrawx.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859624/bolboschoenus_fluviatilis_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p10_2_dc8jwg.png"
    ],
    "page_number": 10
  },
  {
    "guide_id": 1273,
    "species_id": "sp_23",
    "scientific_name": "Scirpus microcarpus",
    "common_name": "Reddish Bulrush",
    "family": "Cyperaceae",
    "photo_date": "7-30-19",
    "description": "This state endangered species superficially resembles the common S. atrovirens, but S. microcarpus is typically knee-high, and clusters are more open & pale brown. Sheaths are reddish-purple; the alternating bands of green & purple inspired the other name of barber pole sedge.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "scirpus_microcarpus_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p10_3.png",
      "scirpus_microcarpus_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p10_4.png",
      "scirpus_microcarpus_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p10_5.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859785/scirpus_microcarpus_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p10_3_ump4ay.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859789/scirpus_microcarpus_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p10_4_zwyznj.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859790/scirpus_microcarpus_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p10_5_bqnhjy.png"
    ],
    "page_number": 10
  },
  {
    "guide_id": 1273,
    "species_id": "sp_24",
    "scientific_name": "Scirpus pendulus",
    "common_name": "Red Bulrush",
    "family": "Cyperaceae",
    "photo_date": "8-7-19",
    "description": "As the Latin name indicates, these seeds like to dangle. Often found in ditches, meadows, disturbed wet margins, and former mowed trails. Sheaths are yellow-green to straw-colored. Check out floral scales, bright yellow-green foliage, and round stalk. Crumbles easily when ripe.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "scirpus_pendulus_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p10_6.png",
      "scirpus_pendulus_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p10_7.png",
      "scirpus_pendulus_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p10_8.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859791/scirpus_pendulus_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p10_6_lg8aqm.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859791/scirpus_pendulus_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p10_7_mxxs9s.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859793/scirpus_pendulus_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p10_8_txvylp.png"
    ],
    "page_number": 10
  },
  {
    "guide_id": 1273,
    "species_id": "sp_25",
    "scientific_name": "Scirpus atrovirens",
    "common_name": "Dark Green Rush",
    "family": "Cyperaceae",
    "photo_date": "8-13-18",
    "description": "An ultra-common, hearty wetland native. Clusters are dark-chocolate brown, and crumble when ripe to release tiny beige seeds. Collect by hand and crumble, or snip and crush against a screen.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "scirpus_atrovirens_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p11_1.png",
      "scirpus_atrovirens_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p11_2.png",
      "scirpus_atrovirens_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p11_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859781/scirpus_atrovirens_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p11_1_wygzm0.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859782/scirpus_atrovirens_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p11_2_xczehw.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859782/scirpus_atrovirens_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p11_3_ajj2mq.png"
    ],
    "page_number": 11
  },
  {
    "guide_id": 1273,
    "species_id": "sp_26",
    "scientific_name": "Schoenoplectus pungens",
    "common_name": "Chairmaker’s Rush",
    "family": "Cyperaceae",
    "photo_date": "8-15-17",
    "description": "Chairmaker’s rush has a small pop of spikelets sticking out from the side of the stem near the peak of the stalk. Stems are strongly 3-angled, almost winged in cross-section, with concave sides between the ridged edges. Brown & crumbly when ripe; collect by hand & crumble or snip stalks & process against a screen. This is one of several rush species historically woven to create chair seats.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "schoenoplectus_pungens_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p11_4.png",
      "schoenoplectus_pungens_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p11_5.png",
      "schoenoplectus_pungens_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p11_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859768/schoenoplectus_pungens_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p11_4_v3h0hi.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859768/schoenoplectus_pungens_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p11_5_cb3eiv.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859769/schoenoplectus_pungens_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p11_6_igpwqv.png"
    ],
    "page_number": 11
  },
  {
    "guide_id": 1273,
    "species_id": "sp_27",
    "scientific_name": "Schoenoplectus tabernaemontani",
    "common_name": "Great Bulrush",
    "family": "Cyperaceae",
    "photo_date": "8-15-17",
    "description": "Formerly known as soft-stem bulrush, this species is often found in standing water and in dense stands. Stems are easily compressed with a gentle squeeze. Spikelets typically less than twice as long as broad (less than 10mm long); achenes typically less than 2.1 mm long.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "schoenoplectus_tabernaemontani_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p11_7.png",
      "schoenoplectus_tabernaemontani_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p11_8.png",
      "schoenoplectus_tabernaemontani_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p11_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859776/schoenoplectus_tabernaemontani_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p11_7_whtrxs.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859776/schoenoplectus_tabernaemontani_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p11_8_mimmtt.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859776/schoenoplectus_tabernaemontani_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p11_9_fgxcgl.png"
    ],
    "page_number": 11
  },
  {
    "guide_id": 1273,
    "species_id": "sp_28",
    "scientific_name": "Eleocharis erythropoda",
    "common_name": "Red-rooted Spikerush",
    "family": "Cyperaceae",
    "photo_date": "7-30-19",
    "description": "This species grows in full sun to part shade, moist to wet conditions. Look for a bouquet of florets shooting out from the side of the stem (most Juncus have bouquets pointing up to the sky). 3-parted capsules open to release tiny seeds. Nine varieties listed on USDA, but only the straight species is recognized in this area. Snip stalks with open capsules, seeds are small enough to pass through no-see-um mesh.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "eleocharis_erythropoda_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p12_1.png",
      "eleocharis_erythropoda_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p12_2.png",
      "eleocharis_erythropoda_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p12_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859715/eleocharis_erythropoda_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p12_1_cfllqv.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859717/eleocharis_erythropoda_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p12_2_v9lmw0.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859723/eleocharis_erythropoda_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p12_3_tcnlet.png"
    ],
    "page_number": 12
  },
  {
    "guide_id": 1273,
    "species_id": "sp_29",
    "scientific_name": "Juncus effusus",
    "common_name": "Soft Rush",
    "family": "Juncaceae",
    "photo_date": "7-30-19",
    "description": "This species grows in full sun to part shade, moist to wet conditions. Look for a bouquet of florets shooting out from the side of the stem (most Juncus have bouquets pointing up to the sky). 3-parted capsules open to release tiny seeds. Nine varieties listed on USDA, but only the straight species is recognized in this area. Snip stalks with open capsules, seeds are small enough to pass through no-see-um mesh.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "juncus_effusus_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p12_4.png",
      "juncus_effusus_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p12_5.png",
      "juncus_effusus_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p12_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859747/juncus_effusus_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p12_4_oy9vag.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859747/juncus_effusus_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p12_5_n0nhn6.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859747/juncus_effusus_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p12_6_qdulty.png"
    ],
    "page_number": 12
  },
  {
    "guide_id": 1273,
    "species_id": "sp_30",
    "scientific_name": "Juncus dudleyi",
    "common_name": "Dudley’s Rush",
    "family": "Juncaceae",
    "photo_date": "8-8-18",
    "description": "This common species grows in many wetlands. Florets point up to the sky. 3-parted capsules are shorter than the pointed tepals, and open to release tiny (0.5 mm long) seeds. Leaf blades are shorter than the flowering stalks. Sheaths have a thick, blunt auricle (ear-like collar).",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "juncus_dudleyi_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p12_7.png",
      "juncus_dudleyi_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p12_8.png",
      "juncus_dudleyi_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p12_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859741/juncus_dudleyi_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p12_7_qzicpi.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859740/juncus_dudleyi_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p12_8_a2wbsh.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859740/juncus_dudleyi_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p12_9_w1ku8v.png"
    ],
    "page_number": 12
  },
  {
    "guide_id": 1273,
    "species_id": "sp_31",
    "scientific_name": "Juncus nodosus",
    "common_name": "Joint Rush",
    "family": "Juncaceae",
    "photo_date": "8-16-18",
    "description": "Little pom-poms on short stalks, containing teeny tiny seeds. Similar to several other species: compare the number of flowers per pom-pom (8-20) and the diameter of the pom-pom (6-12 mm). Note the rusty-red capsules are longer than the beige sepals. Once in a while, supersized florets (2-3x longer) will emerge from the pom-pom; these are reportedly galls caused by hymenoptera larva.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "juncus_nodosus_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p13_1.png",
      "juncus_nodosus_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p13_2.png",
      "juncus_nodosus_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p13_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859749/juncus_nodosus_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p13_1_vt8j1y.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859754/juncus_nodosus_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p13_2_ypfm0j.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859760/juncus_nodosus_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p13_3_i51e3h.png"
    ],
    "page_number": 13
  },
  {
    "guide_id": 1273,
    "species_id": "sp_32",
    "scientific_name": "Juncus torreyi",
    "common_name": "Torrey’s Rush",
    "family": "Juncaceae",
    "photo_date": "8-10-18 8-30-19",
    "description": "Little pom-poms on short stalks, containing teeny tiny seeds. Similar to other species: note the densely packed head with 25-100 flowers/head. Rusty-red capsules are typically around the same height as the beige sepals.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "juncus_torreyi_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p13_4.png",
      "juncus_torreyi_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p13_5.png",
      "juncus_torreyi_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p13_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859755/juncus_torreyi_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p13_4_mim2ah.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859757/juncus_torreyi_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p13_5_kpeop6.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859759/juncus_torreyi_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p13_6_oucgh6.png"
    ],
    "page_number": 13
  },
  {
    "guide_id": 1273,
    "species_id": "sp_33",
    "scientific_name": "Juncus canadensis",
    "common_name": "Canadian Rush",
    "family": "Juncaceae",
    "photo_date": "9-20-20",
    "description": "One of the little pom-pom rushes but the seeds have a different shape: elliptical, like a banana slug with white tails at both ends. Pom-poms are 3-10 mm in diameter, each with 5-50 flowers. Seeds are 1.2-1.5 mm long. Round heads may be clustered together or separate. See Flora for varieties. This species & similar sisters have a range of blooming & seeding times, harvest summer through fall.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "juncus_canadensis_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p13_7.png",
      "juncus_canadensis_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p13_8.png",
      "juncus_canadensis_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p13_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859736/juncus_canadensis_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p13_7_aimy0x.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859738/juncus_canadensis_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p13_8_zmqx5t.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859738/juncus_canadensis_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p13_9_pvpzaj.png"
    ],
    "page_number": 13
  },
  {
    "guide_id": 1273,
    "species_id": "sp_34",
    "scientific_name": "hirta",
    "common_name": "Sweet Grass Hierochloë",
    "family": "Poaceae",
    "photo_date": "6-17-19",
    "description": "An uncommon grass with a smell similar to sweet black-eyed Susan and the invasive sweet clover. Aka holy grass, the species is braided and used in sacred Native American ceremonies. Strips easily by hand, seeds are a caramel brown when ripe. Seeds are soft; mechanical tools are often too aggressive for these seeds. Unlike most grasses, this one needs stratification to germinate, or perhaps sow fresh.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "hirta_sp_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p14_1.png",
      "hirta_sp_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p14_2.png",
      "hirta_sp_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p14_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859726/hirta_sp_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p14_1_vtygus.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859731/hirta_sp_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p14_2_jtjvqo.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859732/hirta_sp_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p14_3_ksbmu7.png"
    ],
    "page_number": 14
  },
  {
    "guide_id": 1273,
    "species_id": "sp_35",
    "scientific_name": "Calamagrostis canadensis",
    "common_name": "Blue Joint Grass",
    "family": "Poaceae",
    "photo_date": "8-11-19",
    "description": "One of the native grasses that was likely abundant before reed canary grass invaded. Plants are blue-green in spring; joints are often bluepurple. Flowers in a Xmas tree shape (like Kentucky bluegrass) but collapses to a slender feather at harvest time. Similar looking to reed canary grass, but this is the delicate gazelle to the bull of RCG – slender stalks & leaves, slender feathery head and seeds with little hairy tufts.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "calamagrostis_canadensis_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p14_4.png",
      "calamagrostis_canadensis_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p14_5.png",
      "calamagrostis_canadensis_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p14_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859624/calamagrostis_canadensis_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p14_4_epp8q3.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859624/calamagrostis_canadensis_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p14_5_rnhjgr.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859624/calamagrostis_canadensis_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p14_6_wc4fvj.png"
    ],
    "page_number": 14
  },
  {
    "guide_id": 1273,
    "species_id": "sp_36",
    "scientific_name": "Phalaris arundinacea",
    "common_name": "Reed Canary Grass",
    "family": "Poaceae",
    "photo_date": "",
    "description": "",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "phalaris_arundinacea_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p14_7.png",
      "phalaris_arundinacea_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p14_8.png",
      "phalaris_arundinacea_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p14_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859761/phalaris_arundinacea_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p14_7_zoh0zx.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859763/phalaris_arundinacea_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p14_8_ecavei.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859767/phalaris_arundinacea_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p14_9_zlmacq.png"
    ],
    "page_number": 14
  },
  {
    "guide_id": 1273,
    "species_id": "sp_37",
    "scientific_name": "Glyceria septentrionalis",
    "common_name": "Floating Manna Grass",
    "family": "Poaceae",
    "photo_date": "8-16-18",
    "description": "This species looks quite different from its more common sister, fowl manna grass. Leaves are wider (up to 12 mm across) and seeds are longer (4-5 mm). Tiny rough hairs (“hispidulous”) are present on the seeds, but not visible without a microscope or lens.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "glyceria_septentrionalis_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p15_1.png",
      "glyceria_septentrionalis_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p15_2.png",
      "glyceria_septentrionalis_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p15_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859723/glyceria_septentrionalis_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p15_1_xpfrlt.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859724/glyceria_septentrionalis_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p15_2_jpm8gl.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766859724/glyceria_septentrionalis_1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2_p15_3_olz97y.png"
    ],
    "page_number": 15
  },
  {
    "guide_id": 1274,
    "species_id": "sp_1",
    "scientific_name": "Cardamine douglassii",
    "common_name": "Purple Cress",
    "family": "Brassicaceae",
    "photo_date": "5-31-19",
    "description": "Ballistic. Like several other mustard-relatives, C. douglassii forms seeds in siliques (skinny pods). Look for open (exploded) pods & grab remaining siliques. Similar looking to Bulbous Cress (C. bulbosa), which blooms a little later, has 5+ stem leaves, and a hairless upper stem (not pictured). For both species, collect ≤10% and sow fresh.",
    "seed_group_names": [
      "Ballistic"
    ],
    "seed_group_details": [
      {
        "name": "Ballistic",
        "images": [
          "Ballistic_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_page1_img1.png"
        ],
        "description": "Ballistic capsules catapult their babies away, up to 30 feet! Search YouTube for “exploding seeds” to see these in action. To harvest: learn the ripening sequence & harvest just before explosion; store in a *sealed* paper bag or mesh bag for a day or two."
      }
    ],
    "image_filenames": [
      "cardamine_douglassii_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p3_1.png",
      "cardamine_douglassii_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p3_2.png",
      "cardamine_douglassii_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p3_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872346/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/cardamine_douglassii_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p3_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872346/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/cardamine_douglassii_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p3_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872347/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/cardamine_douglassii_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p3_3.png"
    ],
    "page_number": 3
  },
  {
    "guide_id": 1274,
    "species_id": "sp_2",
    "scientific_name": "Ranunculus recurvatus",
    "common_name": "Hooked Buttercup",
    "family": "Ranunculaceae",
    "photo_date": "6-2-18",
    "description": "Hitchhikers. Shattering seeds. Ranunculus species can shatter in place, or the hooks on the seeds can hitch a ride on a passing critter. Collect when seeds are loose to the touch. Deeply cleft leaves, stem hairs, and hooked achenes are identifying characters of this species.",
    "seed_group_names": [
      "Hitchhikers",
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Hitchhikers",
        "images": [
          "Hitchhikers_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_page1_img1.png"
        ],
        "description": "Hitchhikers are easy to tell when ripe – they hitch a ride on your pants! Color can be an indicator, but not always. Do Not Collect."
      },
      {
        "name": "Shattering",
        "images": [
          "Shattering_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "ranunculus_recurvatus_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p3_4.png",
      "ranunculus_recurvatus_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p3_5.png",
      "ranunculus_recurvatus_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p3_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872365/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/ranunculus_recurvatus_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p3_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872366/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/ranunculus_recurvatus_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p3_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872367/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/ranunculus_recurvatus_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p3_6.png"
    ],
    "page_number": 3
  },
  {
    "guide_id": 1274,
    "species_id": "sp_3",
    "scientific_name": "Caltha palustris",
    "common_name": "Marsh Marigold",
    "family": "Ranunculaceae",
    "photo_date": "6-1-19",
    "description": "Beaks. Star-like capsules split open and look like little boats with green-yellow seeds inside. Must sow seed fresh. Strong weather or a passing animal will knock the seeds out of the capsules.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "caltha_palustris_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p3_7.png",
      "caltha_palustris_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p3_8.png",
      "caltha_palustris_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p3_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872343/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/caltha_palustris_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p3_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872344/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/caltha_palustris_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p3_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872345/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/caltha_palustris_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p3_9.png"
    ],
    "page_number": 3
  },
  {
    "guide_id": 1274,
    "species_id": "sp_4",
    "scientific_name": "Packera aurea",
    "common_name": "Golden Ragwort",
    "family": "Asteraceae",
    "photo_date": "6-5-18",
    "description": "Fluffy. The native ragworts were moved from Senecio to Packera and split into new species. Thankfully, this one is still distinct with rounded basal leaves with cordate (heart-shaped) base, and wingless petioles. Ideally collect when fully poofed. Can also collect the stem once the yellow ray florets (“petals”) have disappeared; store in a paper bag and they should finish ripening.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "packera_aurea_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p4_1.png",
      "packera_aurea_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p4_2.png",
      "packera_aurea_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p4_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872358/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/packera_aurea_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p4_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872360/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/packera_aurea_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p4_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872360/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/packera_aurea_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p4_3.png"
    ],
    "page_number": 4
  },
  {
    "guide_id": 1274,
    "species_id": "sp_5",
    "scientific_name": "Packera glabella",
    "common_name": "Butterweed",
    "family": "Asteraceae",
    "photo_date": "7-8-19",
    "description": "Fluffy. This may be a harbinger of climate change. Flora lists a first collection of this species in the region in 1976. It has been rapidly moving into more preserves, especially flatwoods. Similar to desirable ragwort species, but this one is generally taller (thigh to waist-high vs shin-high), has thicker stalks at least (pencil-thick vs slender wires), and the basal leaves are lobed the same as the stem leaves.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "packera_glabella_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p4_4.png",
      "packera_glabella_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p4_5.png",
      "packera_glabella_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p4_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872361/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/packera_glabella_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p4_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872362/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/packera_glabella_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p4_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872363/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/packera_glabella_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p4_6.png"
    ],
    "page_number": 4
  },
  {
    "guide_id": 1274,
    "species_id": "sp_6",
    "scientific_name": "Micranthes pensylvanica",
    "common_name": "Swamp saxifrage",
    "family": "Saxifragaceae",
    "photo_date": "6-18-18",
    "description": "Beaks. Assuming the deer have not eaten all of the stems, clusters of tiny duck bills turn from green to brown, revealing brown/black dustlike seeds. Capsules turn brown at different times, on the same plant. Collect brown & open duckbills. Basal leaves are hairy rosettes.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "micranthes_pensylvanica_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p4_7.png",
      "micranthes_pensylvanica_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p4_8.png",
      "micranthes_pensylvanica_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p4_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872357/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/micranthes_pensylvanica_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p4_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872357/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/micranthes_pensylvanica_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p4_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872358/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/micranthes_pensylvanica_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p4_9.png"
    ],
    "page_number": 4
  },
  {
    "guide_id": 1274,
    "species_id": "sp_7",
    "scientific_name": "Rubus pubescens",
    "common_name": "Dwarf Raspberry",
    "family": "Rosaceae",
    "photo_date": "7-5-19",
    "description": "Berries. This rare raspberry forms creeping colonies in flatwoods, tamarack bogs, and other wet woodlands. Fruit production is limited, and berries on the same colony ripen at different times. Collect when berries are deep red & easy to pluck. Vegetative cuttings are an option.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "rubus_pubescens_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p5_1.png",
      "rubus_pubescens_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p5_2.png",
      "rubus_pubescens_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p5_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872367/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/rubus_pubescens_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p5_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872368/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/rubus_pubescens_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p5_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872368/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/rubus_pubescens_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p5_3.png"
    ],
    "page_number": 5
  },
  {
    "guide_id": 1274,
    "species_id": "sp_8",
    "scientific_name": "Angelica atropurpurea",
    "common_name": "Great Angelica",
    "family": "Apiaceae",
    "photo_date": "7-9-19",
    "description": "Shattering. Great angelica seeds are ripe when they are beige and easily plucked off of the stem. Sometimes confused with other tall parsleyrelatives, this species has a globe of seeds, not a flat umbel.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "angelica_atropurpurea_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p5_4.png",
      "angelica_atropurpurea_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p5_5.png",
      "angelica_atropurpurea_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p5_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872341/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/angelica_atropurpurea_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p5_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872342/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/angelica_atropurpurea_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p5_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872343/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/angelica_atropurpurea_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p5_6.png"
    ],
    "page_number": 5
  },
  {
    "guide_id": 1274,
    "species_id": "sp_9",
    "scientific_name": "Heracleum maximum",
    "common_name": "Cow Parsnip",
    "family": "Apiaceae",
    "photo_date": "7-23-17",
    "description": "Shattering. This species can be disliked for being abundant, but often stays localized even if suitable habitat is just beyond the next clearing. Ripe beige seeds are easily plucked. Flora lists this species as FACW; formerly UPL in Swink & Wilhelm. Some people report skin rashes; wear gloves & long sleeves if your skin sensitivity to this species is unknown.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "heracleum_maximum_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p5_7.png",
      "heracleum_maximum_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p5_8.png",
      "heracleum_maximum_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p5_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872351/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/heracleum_maximum_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p5_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872352/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/heracleum_maximum_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p5_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872352/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/heracleum_maximum_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p5_9.png"
    ],
    "page_number": 5
  },
  {
    "guide_id": 1274,
    "species_id": "sp_10",
    "scientific_name": "Phlox glaberrima var. interior",
    "common_name": "Marsh Phlox",
    "family": "Polemoniaceae",
    "photo_date": "7-24-19",
    "description": "Ballistic. The petals drop, revealing hard capsules that swell & turn beige, before splitting into 3 pieces & shooting the dark seeds away. Sepals often reflex (peel backwards) like a star shortly before catapulting. When flowers start to fade, cover with mesh hoods to capture seeds.",
    "seed_group_names": [
      "Ballistic"
    ],
    "seed_group_details": [
      {
        "name": "Ballistic",
        "images": [
          "Ballistic_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_page1_img1.png"
        ],
        "description": "Ballistic capsules catapult their babies away, up to 30 feet! Search YouTube for “exploding seeds” to see these in action. To harvest: learn the ripening sequence & harvest just before explosion; store in a *sealed* paper bag or mesh bag for a day or two."
      }
    ],
    "image_filenames": [
      "phlox_glaberrima_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p6_1.png",
      "phlox_glaberrima_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p6_2.png",
      "phlox_glaberrima_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p6_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872363/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/phlox_glaberrima_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p6_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872364/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/phlox_glaberrima_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p6_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872364/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/phlox_glaberrima_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p6_3.png"
    ],
    "page_number": 6
  },
  {
    "guide_id": 1274,
    "species_id": "sp_11",
    "scientific_name": "Thalictrum dasycarpum",
    "common_name": "Purple Meadow Rue",
    "family": "Ranunculaceae",
    "photo_date": "8-10-18",
    "description": "Shattering. Seeds turn from green to dark chocolate when ripe. Pluck brown seeds. There are several tall meadow rue species & varieties. One species has revolute (rolled) leaf margins, the other 2 are ID’d by hairs (or lack thereof) on the underside of the leaf.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "thalictrum_dasycarpum_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p6_4.png",
      "thalictrum_dasycarpum_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p6_5.png",
      "thalictrum_dasycarpum_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p6_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872375/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/thalictrum_dasycarpum_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p6_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872375/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/thalictrum_dasycarpum_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p6_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872376/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/thalictrum_dasycarpum_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p6_6.png"
    ],
    "page_number": 6
  },
  {
    "guide_id": 1274,
    "species_id": "sp_12",
    "scientific_name": "Geum laciniatum",
    "common_name": "Rough Avens",
    "family": "Rosaceae",
    "photo_date": "8-11-20",
    "description": "Hitchhikers. Coneheads. This common white flower is found in a variety of wet to mesic habitats. Leaves come in a variety of shapes, sometimes scalloped 3 lobes, or 5 simple leaflets, or 5 leaflets deeply divided into lacy delicacy. Pluck the seeds to reveal the receptacle, which is hairless for this species. Stems and floral branches are hairy. Often observed on socks, rarely collected intentionally.",
    "seed_group_names": [
      "Hitchhikers",
      "Coneheads"
    ],
    "seed_group_details": [
      {
        "name": "Hitchhikers",
        "images": [
          "Hitchhikers_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_page1_img1.png"
        ],
        "description": "Hitchhikers are easy to tell when ripe – they hitch a ride on your pants! Color can be an indicator, but not always. Do Not Collect."
      },
      {
        "name": "Coneheads",
        "images": [
          "Coneheads_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_page1_img1.png"
        ],
        "description": "Coneheads are flowers with a cone-shaped center. Imagine these flowers without their colorful parts, and you know exactly what they look like when seeds are ripe."
      }
    ],
    "image_filenames": [
      "geum_laciniatum_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p6_7.png",
      "geum_laciniatum_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p6_8.png",
      "geum_laciniatum_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p6_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872349/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/geum_laciniatum_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p6_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872350/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/geum_laciniatum_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p6_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872350/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/geum_laciniatum_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p6_9.png"
    ],
    "page_number": 6
  },
  {
    "guide_id": 1274,
    "species_id": "sp_13",
    "scientific_name": "Acorus americanus",
    "common_name": "American Sweet Flag",
    "family": "Araceae",
    "photo_date": "8-15-17",
    "description": "Crumbly coneheads. The leaves are often mistaken for blue flag iris, but sweet flag leaves have a citronella smell. Brown fingers of seeds form low on the plant. Collect when crumbly. The non-native A. calamus has sterile pollen and does not form fruit.",
    "seed_group_names": [
      "Coneheads"
    ],
    "seed_group_details": [
      {
        "name": "Coneheads",
        "images": [
          "Coneheads_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_page1_img1.png"
        ],
        "description": "Coneheads are flowers with a cone-shaped center. Imagine these flowers without their colorful parts, and you know exactly what they look like when seeds are ripe."
      }
    ],
    "image_filenames": [
      "acorus_americanus_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p7_1.png",
      "acorus_americanus_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p7_2.png",
      "acorus_americanus_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p7_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872331/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/acorus_americanus_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p7_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872331/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/acorus_americanus_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p7_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872332/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/acorus_americanus_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p7_3.png"
    ],
    "page_number": 7
  },
  {
    "guide_id": 1274,
    "species_id": "sp_14",
    "scientific_name": "Alisma subcordatum",
    "common_name": "Common Water Plantain",
    "family": "Alismataceae",
    "photo_date": "8-16-18",
    "description": "Shattering. Alisma seeds sit like little turbans on the tips of the panicle (xmas tree shaped seed head). Leaves are broad like the lawn weed. Flowers are 3 white petals, and has a delicate baby’s breath-type appearance in the wetlands. Collect when brown & crumbly.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "alisma_subcordatum_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p7_4.png",
      "alisma_subcordatum_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p7_5.png",
      "alisma_subcordatum_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p7_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872334/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/alisma_subcordatum_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p7_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872335/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/alisma_subcordatum_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p7_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872336/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/alisma_subcordatum_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p7_6.png"
    ],
    "page_number": 7
  },
  {
    "guide_id": 1274,
    "species_id": "sp_15",
    "scientific_name": "Alisma triviale",
    "common_name": "Large-flowered Water Plantain",
    "family": "Alismataceae",
    "photo_date": "8-15-17",
    "description": "Shattering. This species is like the former, except bigger: bigger flowers, bigger seeds, bigger panicle. Both can be found in the same wetlands and have equal conservation value. Found in wetlands that typically dry down in the summer.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "alisma_triviale_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p7_7.png",
      "alisma_triviale_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p7_8.png",
      "alisma_triviale_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p7_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872336/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/alisma_triviale_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p7_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872337/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/alisma_triviale_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p7_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872337/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/alisma_triviale_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p7_9.png"
    ],
    "page_number": 7
  },
  {
    "guide_id": 1274,
    "species_id": "sp_16",
    "scientific_name": "Sparganium eurycarpum",
    "common_name": "Common Bur Reed",
    "family": "Sparganiaceae",
    "photo_date": "8-15-17",
    "description": "Crumbly coneheads. Look for “medieval mace” seed heads, collect when crumbly and brown. This species is sometimes disrespected as too aggressive. It is well-suited in Phragmites/cattail/Scirpus wetlands, but not recommended for delicate sedge meadows. This common Sparganium species has big seeds; the rarer species have seeds less than 3.5 mm thick.",
    "seed_group_names": [
      "Coneheads"
    ],
    "seed_group_details": [
      {
        "name": "Coneheads",
        "images": [
          "Coneheads_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_page1_img1.png"
        ],
        "description": "Coneheads are flowers with a cone-shaped center. Imagine these flowers without their colorful parts, and you know exactly what they look like when seeds are ripe."
      }
    ],
    "image_filenames": [
      "sparganium_eurycarpum_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p8_1.png",
      "sparganium_eurycarpum_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p8_2.png",
      "sparganium_eurycarpum_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p8_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872371/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/sparganium_eurycarpum_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p8_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872372/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/sparganium_eurycarpum_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p8_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872372/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/sparganium_eurycarpum_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p8_3.png"
    ],
    "page_number": 8
  },
  {
    "guide_id": 1274,
    "species_id": "sp_17",
    "scientific_name": "Iris virginica var. shrevei",
    "common_name": "Blue Flag",
    "family": "Iridaceae",
    "photo_date": "8-16-18",
    "description": "Beaks. Our only native iris, the lovely blue flag transforms to terra cotta colored seeds stacked within a banana-like pod. Collect *open* banana peels. Flower parts & seeds are in groups of 3s & 6s, a trait showing their distant relation to the lily group.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "iris_virginica_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p8_4.png",
      "iris_virginica_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p8_5.png",
      "iris_virginica_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p8_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872353/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/iris_virginica_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p8_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872353/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/iris_virginica_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p8_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872354/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/iris_virginica_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p8_6.png"
    ],
    "page_number": 8
  },
  {
    "guide_id": 1274,
    "species_id": "sp_18",
    "scientific_name": "Ludwigia polycarpa",
    "common_name": "False Loosestrife",
    "family": "Onagraceae",
    "photo_date": "8-16-18",
    "description": "Shakers. The seedbox (Ludwigia) species are often overlooked, hiding in the lower 2 feet of sedge meadows & wet prairies. The “seedbox” will crumble & shake out miniscule seeds when ripe. Over 1 million seeds/ounce. The larger capsules are 4 mm+ for this species.",
    "seed_group_names": [
      "Shakers"
    ],
    "seed_group_details": [
      {
        "name": "Shakers",
        "images": [
          "Shakers_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_page1_img1.png"
        ],
        "description": "Shakers drop seeds very close to the mother plant, when shaken loose by the wind or a passing critter. Usually a Mama’s Boy, unless strong weather occurs."
      }
    ],
    "image_filenames": [
      "ludwigia_polycarpa_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p8_7.png",
      "ludwigia_polycarpa_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p8_8.png",
      "ludwigia_polycarpa_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p8_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872355/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/ludwigia_polycarpa_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p8_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872356/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/ludwigia_polycarpa_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p8_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872356/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/ludwigia_polycarpa_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p8_9.png"
    ],
    "page_number": 8
  },
  {
    "guide_id": 1274,
    "species_id": "sp_19",
    "scientific_name": "Samolus parviflorus",
    "common_name": "Brookweed",
    "family": "Samolaceae",
    "photo_date": "8-17-19",
    "description": "Beaks. This rare species appears on banks, receding shores, seeps, and typically in shade. The tiny capsules open to spill out even tinier seeds. Collect open capsules.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "samolus_parviflorus_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p9_1.png",
      "samolus_parviflorus_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p9_2.png",
      "samolus_parviflorus_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p9_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872369/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/samolus_parviflorus_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p9_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872370/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/samolus_parviflorus_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p9_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872371/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/samolus_parviflorus_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p9_3.png"
    ],
    "page_number": 9
  },
  {
    "guide_id": 1274,
    "species_id": "sp_20",
    "scientific_name": "Anemone canadensis",
    "common_name": "Meadow Anemone",
    "family": "Ranunculaceae",
    "photo_date": "8-24-17",
    "description": "Shattering. This colonial anemone blooms like its thimbleweed sisters, but looks closer to its buttercup relations when in seed. Spreads primarily by rhizomes, forming a thick groundcover. Collect brown seeds, clusters will easily crumble when ripe.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "anemone_canadensis_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p9_4.png",
      "anemone_canadensis_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p9_5.png",
      "anemone_canadensis_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p9_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872339/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/anemone_canadensis_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p9_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872340/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/anemone_canadensis_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p9_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872340/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/anemone_canadensis_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p9_6.png"
    ],
    "page_number": 9
  },
  {
    "guide_id": 1274,
    "species_id": "sp_21",
    "scientific_name": "Spiraea alba",
    "common_name": "Meadowsweet",
    "family": "Rosaceae",
    "photo_date": "8-24-17",
    "description": "Beaks. This wetland shrub forms flowers like the ornamental bridal wreath Spiraea, except the flowers are arranged in a Xmas tree shape. Each flower turns into 5 tiny capsules, which split open to release a sliver of a seed. At harvest, capsules often turn red due to overnight lows. Look for any plump open capsules, snip the entire Xmas tree. Can also be grown by cuttings.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "spiraea_alba_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p9_7.png",
      "spiraea_alba_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p9_8.png",
      "spiraea_alba_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p9_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872373/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/spiraea_alba_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p9_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872374/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/spiraea_alba_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p9_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872374/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/spiraea_alba_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p9_9.png"
    ],
    "page_number": 9
  },
  {
    "guide_id": 1274,
    "species_id": "sp_22",
    "scientific_name": "Agrimonia parviflora",
    "common_name": "Swamp Agrimony",
    "family": "Rosaceae",
    "photo_date": "8-25-17",
    "description": "Hitchhikers. All native Agrimony are unavailable commercially and often overlooked. The tiny sunny yellow flowers morph into green burs. Collect when they stick to your clothes & are easily stripped from the stem. A. parviflora has 5+ pairs of longer leaflets. A (washable) residue builds up on your hands if collecting a large quantity of this particular species.",
    "seed_group_names": [
      "Hitchhikers"
    ],
    "seed_group_details": [
      {
        "name": "Hitchhikers",
        "images": [
          "Hitchhikers_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_page1_img1.png"
        ],
        "description": "Hitchhikers are easy to tell when ripe – they hitch a ride on your pants! Color can be an indicator, but not always. Do Not Collect."
      }
    ],
    "image_filenames": [
      "agrimonia_parviflora_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p10_1.png",
      "agrimonia_parviflora_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p10_2.png",
      "agrimonia_parviflora_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p10_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872332/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/agrimonia_parviflora_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p10_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872333/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/agrimonia_parviflora_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p10_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872333/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/agrimonia_parviflora_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p10_3.png"
    ],
    "page_number": 10
  },
  {
    "guide_id": 1274,
    "species_id": "sp_23",
    "scientific_name": "Epilobium parviflorum",
    "common_name": "Small Hairy Willowherb",
    "family": "Onagraceae",
    "photo_date": "8-25-20",
    "description": "Fluffy. Fluffy seeds are released from a 4-parted capsule. Seeds of willowherbs are attached to long silky hairs. Tiny delicate flowers, typically pink. For willowherbs with serrated leaf margins, the non-native ones have hairy stems. The other non-native willowherb has large (1 cm or bigger), hot pink flowers.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "epilobium_parviflorum_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p10_4.png",
      "epilobium_parviflorum_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p10_5.png",
      "epilobium_parviflorum_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p10_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872347/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/epilobium_parviflorum_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p10_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872348/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/epilobium_parviflorum_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p10_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766872348/1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1/epilobium_parviflorum_1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1_p10_6.png"
    ],
    "page_number": 10
  },
  {
    "guide_id": 1275,
    "species_id": "sp_1",
    "scientific_name": "Taraxacum officinale",
    "common_name": "Common Dandelion",
    "family": "Asteraceae",
    "photo_date": "5-15-20",
    "description": "Fluffy. Ubiquitous lawn weed, this species can escape into disturbed & mowed edges of preserves, but generally is not tough enough to compete in natural ecosystems. Lobed leaves with milky sap. Seeds & fluff 1 - 1.5” long. Do not collect.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "taraxacum_officinale_1275_usa_illinois_lakecounty_summerprairieforbsv2_p3_1.png",
      "taraxacum_officinale_1275_usa_illinois_lakecounty_summerprairieforbsv2_p3_2.png",
      "taraxacum_officinale_1275_usa_illinois_lakecounty_summerprairieforbsv2_p3_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882021/1275_usa_illinois_lakecounty_summerprairieforbsv2/taraxacum_officinale_1275_usa_illinois_lakecounty_summerprairieforbsv2_p3_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882023/1275_usa_illinois_lakecounty_summerprairieforbsv2/taraxacum_officinale_1275_usa_illinois_lakecounty_summerprairieforbsv2_p3_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882024/1275_usa_illinois_lakecounty_summerprairieforbsv2/taraxacum_officinale_1275_usa_illinois_lakecounty_summerprairieforbsv2_p3_3.png"
    ],
    "page_number": 3
  },
  {
    "guide_id": 1275,
    "species_id": "sp_2",
    "scientific_name": "Tragopogon pratensis",
    "common_name": "Common Goat’s Beard",
    "family": "Asteraceae",
    "photo_date": "6-18-20",
    "description": "Fluffy. Like a dandelion with an 80s makeover, this plant has big hair! Seed & fluff are several centimeters long. Fluff is feathery. Yellow flowers open in the morning & close in the afternoon. Curved leaf tips. Found along roadsides & other disturbed places.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "tragopogon_pratensis_1275_usa_illinois_lakecounty_summerprairieforbsv2_p3_4.png",
      "tragopogon_pratensis_1275_usa_illinois_lakecounty_summerprairieforbsv2_p3_5.png",
      "tragopogon_pratensis_1275_usa_illinois_lakecounty_summerprairieforbsv2_p3_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882028/1275_usa_illinois_lakecounty_summerprairieforbsv2/tragopogon_pratensis_1275_usa_illinois_lakecounty_summerprairieforbsv2_p3_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882029/1275_usa_illinois_lakecounty_summerprairieforbsv2/tragopogon_pratensis_1275_usa_illinois_lakecounty_summerprairieforbsv2_p3_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882030/1275_usa_illinois_lakecounty_summerprairieforbsv2/tragopogon_pratensis_1275_usa_illinois_lakecounty_summerprairieforbsv2_p3_6.png"
    ],
    "page_number": 3
  },
  {
    "guide_id": 1275,
    "species_id": "sp_3",
    "scientific_name": "Pedicularis canadensis",
    "common_name": "Wood Betony",
    "family": "Orobanchaceae",
    "photo_date": "6-7-19",
    "description": "Beaks. A native hemiparasite, this species will germinate on its own but requires a host plant to survive past the juvenile stage. The plant blooms from bottom to top; seeds ripen in the same order. Green tongues stick out, and then turn brown & split along the top; seeds are cradled in an open lower lip. Look for some open lower lips, then snip the entire stalk. Collect before storms, seeds easily shake out.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "pedicularis_canadensis_1275_usa_illinois_lakecounty_summerprairieforbsv2_p3_7.png",
      "pedicularis_canadensis_1275_usa_illinois_lakecounty_summerprairieforbsv2_p3_8.png",
      "pedicularis_canadensis_1275_usa_illinois_lakecounty_summerprairieforbsv2_p3_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881996/1275_usa_illinois_lakecounty_summerprairieforbsv2/pedicularis_canadensis_1275_usa_illinois_lakecounty_summerprairieforbsv2_p3_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881997/1275_usa_illinois_lakecounty_summerprairieforbsv2/pedicularis_canadensis_1275_usa_illinois_lakecounty_summerprairieforbsv2_p3_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881998/1275_usa_illinois_lakecounty_summerprairieforbsv2/pedicularis_canadensis_1275_usa_illinois_lakecounty_summerprairieforbsv2_p3_9.png"
    ],
    "page_number": 3
  },
  {
    "guide_id": 1275,
    "species_id": "sp_4",
    "scientific_name": "Oxalis violacea",
    "common_name": "Violet Wood Sorrel",
    "family": "Oxalidaceae",
    "photo_date": "6-7-19",
    "description": "Ballistic. Capsules are formed on drooping stems, then turn up toward the sky and split open when ripe. Collect the capsules that are pointing toward the horizon or the sky. Sow fresh. Ripe capsules are often paler (less green, more white-ish). Sow asap",
    "seed_group_names": [
      "Ballistic"
    ],
    "seed_group_details": [
      {
        "name": "Ballistic",
        "images": [
          "Ballistic_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Ballistic capsules catapult their babies away, up to 30 feet! Search YouTube for “exploding seeds” to see these in action. To harvest: learn the ripening sequence & harvest just before explosion; store in a *sealed* paper bag or mesh bag for a day or two."
      }
    ],
    "image_filenames": [
      "oxalis_violacea_1275_usa_illinois_lakecounty_summerprairieforbsv2_p4_1.png",
      "oxalis_violacea_1275_usa_illinois_lakecounty_summerprairieforbsv2_p4_2.png",
      "oxalis_violacea_1275_usa_illinois_lakecounty_summerprairieforbsv2_p4_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881990/1275_usa_illinois_lakecounty_summerprairieforbsv2/oxalis_violacea_1275_usa_illinois_lakecounty_summerprairieforbsv2_p4_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881992/1275_usa_illinois_lakecounty_summerprairieforbsv2/oxalis_violacea_1275_usa_illinois_lakecounty_summerprairieforbsv2_p4_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881993/1275_usa_illinois_lakecounty_summerprairieforbsv2/oxalis_violacea_1275_usa_illinois_lakecounty_summerprairieforbsv2_p4_3.png"
    ],
    "page_number": 4
  },
  {
    "guide_id": 1275,
    "species_id": "sp_5",
    "scientific_name": "Geum triflorum",
    "common_name": "Prairie Smoke",
    "family": "Rosaceae",
    "photo_date": "6-8-17",
    "description": "Shattering. Wispy plumes are reminiscent of smoke, but also affectionately referred to as \"troll doll hair\" or \"Dr. Seuss plants\". Not fully fluffy, these are poor fliers. Collect when loose - no force necessary. Seeds and plumes change color as they ripen: hot pink plumes fade to gray-pink; seeds clustered at the base of the \"smoke\" change from neon green to yellow-beige. Must use fresh seed. Low viability.",
    "seed_group_names": [
      "Fluffy",
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      },
      {
        "name": "Shattering",
        "images": [
          "Shattering_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "geum_triflorum_1275_usa_illinois_lakecounty_summerprairieforbsv2_p4_4.png",
      "geum_triflorum_1275_usa_illinois_lakecounty_summerprairieforbsv2_p4_5.png",
      "geum_triflorum_1275_usa_illinois_lakecounty_summerprairieforbsv2_p4_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881976/1275_usa_illinois_lakecounty_summerprairieforbsv2/geum_triflorum_1275_usa_illinois_lakecounty_summerprairieforbsv2_p4_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881977/1275_usa_illinois_lakecounty_summerprairieforbsv2/geum_triflorum_1275_usa_illinois_lakecounty_summerprairieforbsv2_p4_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881977/1275_usa_illinois_lakecounty_summerprairieforbsv2/geum_triflorum_1275_usa_illinois_lakecounty_summerprairieforbsv2_p4_6.png"
    ],
    "page_number": 4
  },
  {
    "guide_id": 1275,
    "species_id": "sp_6",
    "scientific_name": "Hypoxis hirsuta",
    "common_name": "Yellow Star Grass",
    "family": "Hypoxidaceae",
    "photo_date": "6-9-18",
    "description": "Beaks. Not actually a grass at all, but distantly related to iris and lilies. The sunny yellow 6-petaled flowers morph into a closed up cluster of green sepals. By the time the seeds are ripe, the surrounding vegetation is several feet taller. Flag populations while they bloom. Collect the entire stem, and the tiny dark seeds will fall out. Sow within a couple of weeks to maximize viability.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "hypoxis_hirsuta_1275_usa_illinois_lakecounty_summerprairieforbsv2_p4_7.png",
      "hypoxis_hirsuta_1275_usa_illinois_lakecounty_summerprairieforbsv2_p4_8.png",
      "hypoxis_hirsuta_1275_usa_illinois_lakecounty_summerprairieforbsv2_p4_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881982/1275_usa_illinois_lakecounty_summerprairieforbsv2/hypoxis_hirsuta_1275_usa_illinois_lakecounty_summerprairieforbsv2_p4_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881983/1275_usa_illinois_lakecounty_summerprairieforbsv2/hypoxis_hirsuta_1275_usa_illinois_lakecounty_summerprairieforbsv2_p4_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881984/1275_usa_illinois_lakecounty_summerprairieforbsv2/hypoxis_hirsuta_1275_usa_illinois_lakecounty_summerprairieforbsv2_p4_9.png"
    ],
    "page_number": 4
  },
  {
    "guide_id": 1275,
    "species_id": "sp_7",
    "scientific_name": "Antennaria howellii subsp. neodioica",
    "common_name": "Short-leaved Cat’s Foot",
    "family": "Asteraceae",
    "photo_date": "6-8-18",
    "description": "Fluffy. The pussytoes species have split from 2 species into 6 with the new subspecies. This one has 1 distinct vein like A. neglecta (a pair of indistinct veins may also be present), but the upper leaf surface loses most of its hairs. The leaf has a point at its tip and tapers to a petiole.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "antennaria_howellii_1275_usa_illinois_lakecounty_summerprairieforbsv2_p5_1.png",
      "antennaria_howellii_1275_usa_illinois_lakecounty_summerprairieforbsv2_p5_2.png",
      "antennaria_howellii_1275_usa_illinois_lakecounty_summerprairieforbsv2_p5_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881933/1275_usa_illinois_lakecounty_summerprairieforbsv2/antennaria_howellii_1275_usa_illinois_lakecounty_summerprairieforbsv2_p5_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881935/1275_usa_illinois_lakecounty_summerprairieforbsv2/antennaria_howellii_1275_usa_illinois_lakecounty_summerprairieforbsv2_p5_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881936/1275_usa_illinois_lakecounty_summerprairieforbsv2/antennaria_howellii_1275_usa_illinois_lakecounty_summerprairieforbsv2_p5_3.png"
    ],
    "page_number": 5
  },
  {
    "guide_id": 1275,
    "species_id": "sp_8",
    "scientific_name": "Antennaria plantaginifolia",
    "common_name": "Pussytoes",
    "family": "Asteraceae",
    "photo_date": "6-13-19",
    "description": "Fluffy. Tiny plants with tiny seeds. Bright white pappus (fluff) is attached to minuscule tan seeds. Antennaria are happiest in areas with low competition & low competition, such as mowed turf & eroding edges. Collect when puffy. This species can be ID'd by the wide leaf (plantain-like), with a midrib flanked by at least two more prominent veins in the basal leaves.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "antennaria_plantaginifolia_1275_usa_illinois_lakecounty_summerprairieforbsv2_p5_4.png",
      "antennaria_plantaginifolia_1275_usa_illinois_lakecounty_summerprairieforbsv2_p5_5.png",
      "antennaria_plantaginifolia_1275_usa_illinois_lakecounty_summerprairieforbsv2_p5_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881937/1275_usa_illinois_lakecounty_summerprairieforbsv2/antennaria_plantaginifolia_1275_usa_illinois_lakecounty_summerprairieforbsv2_p5_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881938/1275_usa_illinois_lakecounty_summerprairieforbsv2/antennaria_plantaginifolia_1275_usa_illinois_lakecounty_summerprairieforbsv2_p5_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881939/1275_usa_illinois_lakecounty_summerprairieforbsv2/antennaria_plantaginifolia_1275_usa_illinois_lakecounty_summerprairieforbsv2_p5_6.png"
    ],
    "page_number": 5
  },
  {
    "guide_id": 1275,
    "species_id": "sp_9",
    "scientific_name": "Veronica arvensis",
    "common_name": "Corn Speedwell",
    "family": "Scrophulariaceae",
    "photo_date": "6-13-20",
    "description": "Beaks. This weed has been documented in the region since 1876. Loves cultivated ground, old fields, and other disturbed places with limited competition. Often upright. Leaves are scalloped, lance-like leafy bracts under the flowers. Hairy throughout. Blue flowers.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "veronica_arvensis_1275_usa_illinois_lakecounty_summerprairieforbsv2_p5_7.png",
      "veronica_arvensis_1275_usa_illinois_lakecounty_summerprairieforbsv2_p5_8.png",
      "veronica_arvensis_1275_usa_illinois_lakecounty_summerprairieforbsv2_p5_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882031/1275_usa_illinois_lakecounty_summerprairieforbsv2/veronica_arvensis_1275_usa_illinois_lakecounty_summerprairieforbsv2_p5_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882032/1275_usa_illinois_lakecounty_summerprairieforbsv2/veronica_arvensis_1275_usa_illinois_lakecounty_summerprairieforbsv2_p5_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882033/1275_usa_illinois_lakecounty_summerprairieforbsv2/veronica_arvensis_1275_usa_illinois_lakecounty_summerprairieforbsv2_p5_9.png"
    ],
    "page_number": 5
  },
  {
    "guide_id": 1275,
    "species_id": "sp_10",
    "scientific_name": "Erigeron philadelphicus",
    "common_name": "Marsh Fleabane",
    "family": "Asteraceae",
    "photo_date": "6-19-20",
    "description": "Fluffy. Despite its name, this species can be found from dry-mesic to wet habitats. Stem leaves stalkless & clasping the stem. Typically more than 100 ligules (the white fringe “petals” of the flowers). Flowering heads are less than 2.5 cm across.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "erigeron_philadelphicus_1275_usa_illinois_lakecounty_summerprairieforbsv2_p6_1.png",
      "erigeron_philadelphicus_1275_usa_illinois_lakecounty_summerprairieforbsv2_p6_2.png",
      "erigeron_philadelphicus_1275_usa_illinois_lakecounty_summerprairieforbsv2_p6_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881966/1275_usa_illinois_lakecounty_summerprairieforbsv2/erigeron_philadelphicus_1275_usa_illinois_lakecounty_summerprairieforbsv2_p6_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881968/1275_usa_illinois_lakecounty_summerprairieforbsv2/erigeron_philadelphicus_1275_usa_illinois_lakecounty_summerprairieforbsv2_p6_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881968/1275_usa_illinois_lakecounty_summerprairieforbsv2/erigeron_philadelphicus_1275_usa_illinois_lakecounty_summerprairieforbsv2_p6_3.png"
    ],
    "page_number": 6
  },
  {
    "guide_id": 1275,
    "species_id": "sp_11",
    "scientific_name": "Erigeron strigosus",
    "common_name": "Daisy Fleabane",
    "family": "Asteraceae",
    "photo_date": "7-7-19",
    "description": "Fluffy. Collect when fluffy, or the white ray florets have curled up and started to drop. This species acts as an annual or biennial, so recommended to collect only 10% of the population. Daisy fleabane has only a handful of skinny, toothless leaves on the upper stem, and appressed stem hairs, as opposed to the common annual fleabane (many leaves, wider & with teeth; longer, spreading hairs on the stem).",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "erigeron_strigosus_1275_usa_illinois_lakecounty_summerprairieforbsv2_p6_4.png",
      "erigeron_strigosus_1275_usa_illinois_lakecounty_summerprairieforbsv2_p6_5.png",
      "erigeron_strigosus_1275_usa_illinois_lakecounty_summerprairieforbsv2_p6_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881969/1275_usa_illinois_lakecounty_summerprairieforbsv2/erigeron_strigosus_1275_usa_illinois_lakecounty_summerprairieforbsv2_p6_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881970/1275_usa_illinois_lakecounty_summerprairieforbsv2/erigeron_strigosus_1275_usa_illinois_lakecounty_summerprairieforbsv2_p6_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881970/1275_usa_illinois_lakecounty_summerprairieforbsv2/erigeron_strigosus_1275_usa_illinois_lakecounty_summerprairieforbsv2_p6_6.png"
    ],
    "page_number": 6
  },
  {
    "guide_id": 1275,
    "species_id": "sp_12",
    "scientific_name": "Erigeron annuus",
    "common_name": "Annual Fleabane",
    "family": "Asteraceae",
    "photo_date": "8-2-18",
    "description": "Fluffy. This ultra-common native annual is most often found in disturbed soils. This species has leaves of various shapes tapering towards the stem (not clasping). Hairs are spreading (perpendicular to the stem). Not typically collected.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "erigeron_annuus_1275_usa_illinois_lakecounty_summerprairieforbsv2_p6_7.png",
      "erigeron_annuus_1275_usa_illinois_lakecounty_summerprairieforbsv2_p6_8.png",
      "erigeron_annuus_1275_usa_illinois_lakecounty_summerprairieforbsv2_p6_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881963/1275_usa_illinois_lakecounty_summerprairieforbsv2/erigeron_annuus_1275_usa_illinois_lakecounty_summerprairieforbsv2_p6_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881965/1275_usa_illinois_lakecounty_summerprairieforbsv2/erigeron_annuus_1275_usa_illinois_lakecounty_summerprairieforbsv2_p6_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881966/1275_usa_illinois_lakecounty_summerprairieforbsv2/erigeron_annuus_1275_usa_illinois_lakecounty_summerprairieforbsv2_p6_9.png"
    ],
    "page_number": 6
  },
  {
    "guide_id": 1275,
    "species_id": "sp_13",
    "scientific_name": "Packera paupercula",
    "common_name": "Balsam Ragwort",
    "family": "Asteraceae",
    "photo_date": "6-14-19",
    "description": "Fluffy. Ideally collect when completely fluffy, but you can snip stems after the bright yellow ray florets have faded. Packera can generally be identified by examining the basal leaves & stem leaves; a couple of species also require looking at the flowering heads.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "packera_paupercula_1275_usa_illinois_lakecounty_summerprairieforbsv2_p7_1.png",
      "packera_paupercula_1275_usa_illinois_lakecounty_summerprairieforbsv2_p7_2.png",
      "packera_paupercula_1275_usa_illinois_lakecounty_summerprairieforbsv2_p7_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881994/1275_usa_illinois_lakecounty_summerprairieforbsv2/packera_paupercula_1275_usa_illinois_lakecounty_summerprairieforbsv2_p7_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881995/1275_usa_illinois_lakecounty_summerprairieforbsv2/packera_paupercula_1275_usa_illinois_lakecounty_summerprairieforbsv2_p7_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881996/1275_usa_illinois_lakecounty_summerprairieforbsv2/packera_paupercula_1275_usa_illinois_lakecounty_summerprairieforbsv2_p7_3.png"
    ],
    "page_number": 7
  },
  {
    "guide_id": 1275,
    "species_id": "sp_14",
    "scientific_name": "Viola pedatifida",
    "common_name": "Prairie Violet",
    "family": "Violaceae",
    "photo_date": "6-19-17",
    "description": "Ballistic. Elaiosomes. Pods start out nodding, then raise their heads up to the sky, split open into 3rds, and shoot their seeds away. Collect when heads are aimed between the horizon & the sky. Most violet species have multiple rounds of seeds: initially from flowers (chasmogamous), but later they form flowers that never open (look like buds) and self-pollinate (cleistogamous) to produce additional seeds.",
    "seed_group_names": [
      "Elaiosomes",
      "Ballistic"
    ],
    "seed_group_details": [
      {
        "name": "Elaiosomes",
        "images": [
          "Elaiosomes_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Elaiosomes are “ant candy” attached to the seeds. Ants are strong and motivated, able to quickly carry the candy back to their home and tossing the heavy “candy wrapper” (seeds) into their compost piles."
      },
      {
        "name": "Ballistic",
        "images": [
          "Ballistic_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Ballistic capsules catapult their babies away, up to 30 feet! Search YouTube for “exploding seeds” to see these in action. To harvest: learn the ripening sequence & harvest just before explosion; store in a *sealed* paper bag or mesh bag for a day or two."
      }
    ],
    "image_filenames": [
      "viola_pedatifida_1275_usa_illinois_lakecounty_summerprairieforbsv2_p7_4.png",
      "viola_pedatifida_1275_usa_illinois_lakecounty_summerprairieforbsv2_p7_5.png",
      "viola_pedatifida_1275_usa_illinois_lakecounty_summerprairieforbsv2_p7_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882036/1275_usa_illinois_lakecounty_summerprairieforbsv2/viola_pedatifida_1275_usa_illinois_lakecounty_summerprairieforbsv2_p7_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882036/1275_usa_illinois_lakecounty_summerprairieforbsv2/viola_pedatifida_1275_usa_illinois_lakecounty_summerprairieforbsv2_p7_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882037/1275_usa_illinois_lakecounty_summerprairieforbsv2/viola_pedatifida_1275_usa_illinois_lakecounty_summerprairieforbsv2_p7_6.png"
    ],
    "page_number": 7
  },
  {
    "guide_id": 1275,
    "species_id": "sp_15",
    "scientific_name": "Lithospermum canescens",
    "common_name": "Hoary Puccoon",
    "family": "Boraginaceae",
    "photo_date": "6-24-18",
    "description": "Shattering. These small \"stoneseeds\" sit in the leaf axil (where the leaf meets the stem) in clusters of up to 4 seeds. Collect when seeds are loose on the stem. Germination is low with this species. Sow fresh with outdoor stratification for best success.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "lithospermum_canescens_1275_usa_illinois_lakecounty_summerprairieforbsv2_p7_7.png",
      "lithospermum_canescens_1275_usa_illinois_lakecounty_summerprairieforbsv2_p7_8.png",
      "lithospermum_canescens_1275_usa_illinois_lakecounty_summerprairieforbsv2_p7_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881988/1275_usa_illinois_lakecounty_summerprairieforbsv2/lithospermum_canescens_1275_usa_illinois_lakecounty_summerprairieforbsv2_p7_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881989/1275_usa_illinois_lakecounty_summerprairieforbsv2/lithospermum_canescens_1275_usa_illinois_lakecounty_summerprairieforbsv2_p7_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881989/1275_usa_illinois_lakecounty_summerprairieforbsv2/lithospermum_canescens_1275_usa_illinois_lakecounty_summerprairieforbsv2_p7_9.png"
    ],
    "page_number": 7
  },
  {
    "guide_id": 1275,
    "species_id": "sp_16",
    "scientific_name": "Polygala senega",
    "common_name": "Seneca Snakeroot",
    "family": "Polygalaceae",
    "photo_date": "6-24-18",
    "description": "Elaiosomes. Beaks. The green flattened capsules on this tiny conservative plant split open to release tiny black seeds. Seed must be sown fresh; it will not tolerate dry storage.",
    "seed_group_names": [
      "Elaiosomes",
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Elaiosomes",
        "images": [
          "Elaiosomes_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Elaiosomes are “ant candy” attached to the seeds. Ants are strong and motivated, able to quickly carry the candy back to their home and tossing the heavy “candy wrapper” (seeds) into their compost piles."
      },
      {
        "name": "Beaks",
        "images": [
          "Beaks_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "polygala_senega_1275_usa_illinois_lakecounty_summerprairieforbsv2_p8_1.png",
      "polygala_senega_1275_usa_illinois_lakecounty_summerprairieforbsv2_p8_2.png",
      "polygala_senega_1275_usa_illinois_lakecounty_summerprairieforbsv2_p8_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882006/1275_usa_illinois_lakecounty_summerprairieforbsv2/polygala_senega_1275_usa_illinois_lakecounty_summerprairieforbsv2_p8_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882007/1275_usa_illinois_lakecounty_summerprairieforbsv2/polygala_senega_1275_usa_illinois_lakecounty_summerprairieforbsv2_p8_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882008/1275_usa_illinois_lakecounty_summerprairieforbsv2/polygala_senega_1275_usa_illinois_lakecounty_summerprairieforbsv2_p8_3.png"
    ],
    "page_number": 8
  },
  {
    "guide_id": 1275,
    "species_id": "sp_17",
    "scientific_name": "Hieracium piloselloides",
    "common_name": "King Devil",
    "family": "Asteraceae",
    "photo_date": "6-26-19",
    "description": "Fluffy. The non-native hawkweeds have mostly leafless stems. This species has straight hairs only on the midrib and edges of the basal leaves (no hairs on the flat leaf surface). Multiple flower heads, leaves are tapered. This species is not as awful as the name might imply.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "hieracium_piloselloides_1275_usa_illinois_lakecounty_summerprairieforbsv2_p8_4.png",
      "hieracium_piloselloides_1275_usa_illinois_lakecounty_summerprairieforbsv2_p8_5.png",
      "hieracium_piloselloides_1275_usa_illinois_lakecounty_summerprairieforbsv2_p8_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881980/1275_usa_illinois_lakecounty_summerprairieforbsv2/hieracium_piloselloides_1275_usa_illinois_lakecounty_summerprairieforbsv2_p8_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881981/1275_usa_illinois_lakecounty_summerprairieforbsv2/hieracium_piloselloides_1275_usa_illinois_lakecounty_summerprairieforbsv2_p8_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881981/1275_usa_illinois_lakecounty_summerprairieforbsv2/hieracium_piloselloides_1275_usa_illinois_lakecounty_summerprairieforbsv2_p8_6.png"
    ],
    "page_number": 8
  },
  {
    "guide_id": 1275,
    "species_id": "sp_18",
    "scientific_name": "Heuchera richardsonii",
    "common_name": "Prairie Alum Root",
    "family": "Saxifragaceae",
    "photo_date": "6-27-18",
    "description": "Beaks. Mama’s Boy, ripening over a few weeks. Look for little brown beaks, which open to spill out tiny black seeds (700,000 seeds/oz!) Snip the stalks when the beaks are brown and open. Be sure to hold the stem upright until you can safely spill it into your bag. Don't sneeze.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "heuchera_richardsonii_1275_usa_illinois_lakecounty_summerprairieforbsv2_p8_7.png",
      "heuchera_richardsonii_1275_usa_illinois_lakecounty_summerprairieforbsv2_p8_8.png",
      "heuchera_richardsonii_1275_usa_illinois_lakecounty_summerprairieforbsv2_p8_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881978/1275_usa_illinois_lakecounty_summerprairieforbsv2/heuchera_richardsonii_1275_usa_illinois_lakecounty_summerprairieforbsv2_p8_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881978/1275_usa_illinois_lakecounty_summerprairieforbsv2/heuchera_richardsonii_1275_usa_illinois_lakecounty_summerprairieforbsv2_p8_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881979/1275_usa_illinois_lakecounty_summerprairieforbsv2/heuchera_richardsonii_1275_usa_illinois_lakecounty_summerprairieforbsv2_p8_9.png"
    ],
    "page_number": 8
  },
  {
    "guide_id": 1275,
    "species_id": "sp_19",
    "scientific_name": "Fragaria virginiana",
    "common_name": "Wild Strawberry",
    "family": "Rosaceae",
    "photo_date": "7-5-19",
    "description": "Berries. This species creeps through a surprising variety of habitats. Dangling red berries are easily plucked when ripe. Identify this species by looking at the 3 leaflets: the tooth at the point should be shorter or equal height to the other teeth. Stems hairs are pressed flat.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "fragaria_virginiana_1275_usa_illinois_lakecounty_summerprairieforbsv2_p9_1.png",
      "fragaria_virginiana_1275_usa_illinois_lakecounty_summerprairieforbsv2_p9_2.png",
      "fragaria_virginiana_1275_usa_illinois_lakecounty_summerprairieforbsv2_p9_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881971/1275_usa_illinois_lakecounty_summerprairieforbsv2/fragaria_virginiana_1275_usa_illinois_lakecounty_summerprairieforbsv2_p9_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881972/1275_usa_illinois_lakecounty_summerprairieforbsv2/fragaria_virginiana_1275_usa_illinois_lakecounty_summerprairieforbsv2_p9_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881973/1275_usa_illinois_lakecounty_summerprairieforbsv2/fragaria_virginiana_1275_usa_illinois_lakecounty_summerprairieforbsv2_p9_3.png"
    ],
    "page_number": 9
  },
  {
    "guide_id": 1275,
    "species_id": "sp_20",
    "scientific_name": "Duchesnea indica",
    "common_name": "Indian Strawberry",
    "family": "Rosaceae",
    "photo_date": "9-2-20",
    "description": "Berries. Similar to Fragaria, but with a disappointingly tasteless fruit. Berries point up to the sky and seeds stick out on the berry surface (Fragaria fruits nod towards the ground, seeds embedded). Leaflets are a little smaller and the tooth at the apex sticks out. Leaflets branch off from the running stems like a daisy chain (Fragaria leaf stems connect at the base). Grows in disturbed habitats.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "duchesnea_indica_1275_usa_illinois_lakecounty_summerprairieforbsv2_p9_4.png",
      "duchesnea_indica_1275_usa_illinois_lakecounty_summerprairieforbsv2_p9_5.png",
      "duchesnea_indica_1275_usa_illinois_lakecounty_summerprairieforbsv2_p9_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881961/1275_usa_illinois_lakecounty_summerprairieforbsv2/duchesnea_indica_1275_usa_illinois_lakecounty_summerprairieforbsv2_p9_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881962/1275_usa_illinois_lakecounty_summerprairieforbsv2/duchesnea_indica_1275_usa_illinois_lakecounty_summerprairieforbsv2_p9_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881963/1275_usa_illinois_lakecounty_summerprairieforbsv2/duchesnea_indica_1275_usa_illinois_lakecounty_summerprairieforbsv2_p9_6.png"
    ],
    "page_number": 9
  },
  {
    "guide_id": 1275,
    "species_id": "sp_21",
    "scientific_name": "Comandra umbellata",
    "common_name": "False Toadflax",
    "family": "Santalaceae",
    "photo_date": "7-7-19",
    "description": "Shattering. One of our native hemiparasites, meaning this species will germinate on its own but requires a host plant to survive past the juvenile stage. Germination is low and information is limited. Rob Sulski reports best luck with green seeds sown fresh.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "comandra_umbellata_1275_usa_illinois_lakecounty_summerprairieforbsv2_p9_7.png",
      "comandra_umbellata_1275_usa_illinois_lakecounty_summerprairieforbsv2_p9_8.png",
      "comandra_umbellata_1275_usa_illinois_lakecounty_summerprairieforbsv2_p9_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881957/1275_usa_illinois_lakecounty_summerprairieforbsv2/comandra_umbellata_1275_usa_illinois_lakecounty_summerprairieforbsv2_p9_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881957/1275_usa_illinois_lakecounty_summerprairieforbsv2/comandra_umbellata_1275_usa_illinois_lakecounty_summerprairieforbsv2_p9_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881958/1275_usa_illinois_lakecounty_summerprairieforbsv2/comandra_umbellata_1275_usa_illinois_lakecounty_summerprairieforbsv2_p9_9.png"
    ],
    "page_number": 9
  },
  {
    "guide_id": 1275,
    "species_id": "sp_22",
    "scientific_name": "Phlox pilosa var. fulgida",
    "common_name": "Prairie Phlox",
    "family": "Polemoniaceae",
    "photo_date": "7-7-19",
    "description": "Ballistic. The bright pink petals drop, revealing hard capsules. Capsules swell & turn green-beige, before splitting into 3 pieces & shooting the dark seeds away. Sepals often reflex (peel backwards) like a star shortly before catapulting. As flowers start to fade, cover with mesh hoods to capture seeds.",
    "seed_group_names": [
      "Ballistic"
    ],
    "seed_group_details": [
      {
        "name": "Ballistic",
        "images": [
          "Ballistic_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Ballistic capsules catapult their babies away, up to 30 feet! Search YouTube for “exploding seeds” to see these in action. To harvest: learn the ripening sequence & harvest just before explosion; store in a *sealed* paper bag or mesh bag for a day or two."
      }
    ],
    "image_filenames": [
      "phlox_pilosa_1275_usa_illinois_lakecounty_summerprairieforbsv2_p10_1.png",
      "phlox_pilosa_1275_usa_illinois_lakecounty_summerprairieforbsv2_p10_2.png",
      "phlox_pilosa_1275_usa_illinois_lakecounty_summerprairieforbsv2_p10_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882003/1275_usa_illinois_lakecounty_summerprairieforbsv2/phlox_pilosa_1275_usa_illinois_lakecounty_summerprairieforbsv2_p10_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882004/1275_usa_illinois_lakecounty_summerprairieforbsv2/phlox_pilosa_1275_usa_illinois_lakecounty_summerprairieforbsv2_p10_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882005/1275_usa_illinois_lakecounty_summerprairieforbsv2/phlox_pilosa_1275_usa_illinois_lakecounty_summerprairieforbsv2_p10_3.png"
    ],
    "page_number": 10
  },
  {
    "guide_id": 1275,
    "species_id": "sp_23",
    "scientific_name": "Tradescantia ohiensis",
    "common_name": "Common Spiderwort",
    "family": "Commelinaceae",
    "photo_date": "7-10-17",
    "description": "Beaks. Mama’s Boy. Each flower reportedly blooms for a single morning, closing in the sunny afternoon. Luckily each stalk has dozens of flowers, extending the season of this royal purple beauty. Seeds also ripen sequentially; Mama’s Boy due to weeks seed formation. Look for sepals changing from green to brown; target heads with at least 50% brown. Snip stalks. Sap can be itchy, but soap & water stops the itch.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "tradescantia_ohiensis_1275_usa_illinois_lakecounty_summerprairieforbsv2_p10_4.png",
      "tradescantia_ohiensis_1275_usa_illinois_lakecounty_summerprairieforbsv2_p10_5.png",
      "tradescantia_ohiensis_1275_usa_illinois_lakecounty_summerprairieforbsv2_p10_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882024/1275_usa_illinois_lakecounty_summerprairieforbsv2/tradescantia_ohiensis_1275_usa_illinois_lakecounty_summerprairieforbsv2_p10_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882026/1275_usa_illinois_lakecounty_summerprairieforbsv2/tradescantia_ohiensis_1275_usa_illinois_lakecounty_summerprairieforbsv2_p10_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882027/1275_usa_illinois_lakecounty_summerprairieforbsv2/tradescantia_ohiensis_1275_usa_illinois_lakecounty_summerprairieforbsv2_p10_6.png"
    ],
    "page_number": 10
  },
  {
    "guide_id": 1275,
    "species_id": "sp_24",
    "scientific_name": "Rumex crispus",
    "common_name": "Curly Dock",
    "family": "Polygonaceae",
    "photo_date": "7-17-19",
    "description": "Shattering. Common weed in agricultural fields and disturbed soils. Leaves have wavy margins. Each seed is tucked inside a 3-part structure (the “valves”), with “grains” on the outside. Leaves are less than 7cm wide, valves less than 6mm long. There are native Rumex too.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "rumex_crispus_1275_usa_illinois_lakecounty_summerprairieforbsv2_p10_7.png",
      "rumex_crispus_1275_usa_illinois_lakecounty_summerprairieforbsv2_p10_8.png",
      "rumex_crispus_1275_usa_illinois_lakecounty_summerprairieforbsv2_p10_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882011/1275_usa_illinois_lakecounty_summerprairieforbsv2/rumex_crispus_1275_usa_illinois_lakecounty_summerprairieforbsv2_p10_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882013/1275_usa_illinois_lakecounty_summerprairieforbsv2/rumex_crispus_1275_usa_illinois_lakecounty_summerprairieforbsv2_p10_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882014/1275_usa_illinois_lakecounty_summerprairieforbsv2/rumex_crispus_1275_usa_illinois_lakecounty_summerprairieforbsv2_p10_9.png"
    ],
    "page_number": 10
  },
  {
    "guide_id": 1275,
    "species_id": "sp_25",
    "scientific_name": "Leucanthemum vulgare",
    "common_name": "Garden Ox-eye Daisy",
    "family": "Asteraceae",
    "photo_date": "7-17-20",
    "description": "Crumbly coneheads. These European white daisies often show up in generic “wildflower mixes” that include a lot of pretty, non-native flowers. Similar to the European Shasta daisy, this species has smaller heads (green cup of bracts under the flower are 2 cm or smaller in diameter, individual bracts are 3 mm wide or skinnier). Stem leaves have toothed-lobes. Do not collect or spread.",
    "seed_group_names": [
      "Coneheads"
    ],
    "seed_group_details": [
      {
        "name": "Coneheads",
        "images": [
          "Coneheads_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Coneheads are flowers with a cone-shaped center. Imagine these flowers without their colorful parts, and you know exactly what they look like when seeds are ripe."
      }
    ],
    "image_filenames": [
      "leucanthemum_vulgare_1275_usa_illinois_lakecounty_summerprairieforbsv2_p11_1.png",
      "leucanthemum_vulgare_1275_usa_illinois_lakecounty_summerprairieforbsv2_p11_2.png",
      "leucanthemum_vulgare_1275_usa_illinois_lakecounty_summerprairieforbsv2_p11_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881985/1275_usa_illinois_lakecounty_summerprairieforbsv2/leucanthemum_vulgare_1275_usa_illinois_lakecounty_summerprairieforbsv2_p11_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881986/1275_usa_illinois_lakecounty_summerprairieforbsv2/leucanthemum_vulgare_1275_usa_illinois_lakecounty_summerprairieforbsv2_p11_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881987/1275_usa_illinois_lakecounty_summerprairieforbsv2/leucanthemum_vulgare_1275_usa_illinois_lakecounty_summerprairieforbsv2_p11_3.png"
    ],
    "page_number": 11
  },
  {
    "guide_id": 1275,
    "species_id": "sp_26",
    "scientific_name": "Psoralidium tenuiflorum",
    "common_name": "Scurfy Pea",
    "family": "Fabaceae",
    "photo_date": "7-23-17",
    "description": "Shattering. Pods of this conservative pea turn brown and drop off instead of splitting open like most legumes. Pick when they are brown and easily pull off with a gentle tug.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "psoralidium_tenuiflorum_1275_usa_illinois_lakecounty_summerprairieforbsv2_p11_4.png",
      "psoralidium_tenuiflorum_1275_usa_illinois_lakecounty_summerprairieforbsv2_p11_5.png",
      "psoralidium_tenuiflorum_1275_usa_illinois_lakecounty_summerprairieforbsv2_p11_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882009/1275_usa_illinois_lakecounty_summerprairieforbsv2/psoralidium_tenuiflorum_1275_usa_illinois_lakecounty_summerprairieforbsv2_p11_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882010/1275_usa_illinois_lakecounty_summerprairieforbsv2/psoralidium_tenuiflorum_1275_usa_illinois_lakecounty_summerprairieforbsv2_p11_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882010/1275_usa_illinois_lakecounty_summerprairieforbsv2/psoralidium_tenuiflorum_1275_usa_illinois_lakecounty_summerprairieforbsv2_p11_6.png"
    ],
    "page_number": 11
  },
  {
    "guide_id": 1275,
    "species_id": "sp_27",
    "scientific_name": "Cirsium arvense",
    "common_name": "Field Thistle",
    "family": "Asteraceae",
    "photo_date": "7-24-18",
    "description": "Fluffy. A noxious weed from Europe (not Canada) that drinks Roundup and laughs in your face. Spreads by rhizomes & seeds. Readily identified by the sheer quantity of stems. Most other thistles are taller (head high) than this thigh- to waist-high plant. DO NOT COLLECT.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "cirsium_arvense_1275_usa_illinois_lakecounty_summerprairieforbsv2_p11_7.png",
      "cirsium_arvense_1275_usa_illinois_lakecounty_summerprairieforbsv2_p11_8.png",
      "cirsium_arvense_1275_usa_illinois_lakecounty_summerprairieforbsv2_p11_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881954/1275_usa_illinois_lakecounty_summerprairieforbsv2/cirsium_arvense_1275_usa_illinois_lakecounty_summerprairieforbsv2_p11_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881955/1275_usa_illinois_lakecounty_summerprairieforbsv2/cirsium_arvense_1275_usa_illinois_lakecounty_summerprairieforbsv2_p11_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881956/1275_usa_illinois_lakecounty_summerprairieforbsv2/cirsium_arvense_1275_usa_illinois_lakecounty_summerprairieforbsv2_p11_9.png"
    ],
    "page_number": 11
  },
  {
    "guide_id": 1275,
    "species_id": "sp_28",
    "scientific_name": "Securigera varia",
    "common_name": "Crown Vetch",
    "family": "Fabaceae",
    "photo_date": "7-30-18",
    "description": "Shattering. This weed is still marketed for erosion control & for bees, even though there are many natives with better manners that can offer those services. Pink & white flowers in a round “crown.” Paired opposite leaflets like other legumes. Sprawls & creeps. Tough to eradicate.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "securigera_varia_1275_usa_illinois_lakecounty_summerprairieforbsv2_p12_1.png",
      "securigera_varia_1275_usa_illinois_lakecounty_summerprairieforbsv2_p12_2.png",
      "securigera_varia_1275_usa_illinois_lakecounty_summerprairieforbsv2_p12_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882014/1275_usa_illinois_lakecounty_summerprairieforbsv2/securigera_varia_1275_usa_illinois_lakecounty_summerprairieforbsv2_p12_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882015/1275_usa_illinois_lakecounty_summerprairieforbsv2/securigera_varia_1275_usa_illinois_lakecounty_summerprairieforbsv2_p12_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882015/1275_usa_illinois_lakecounty_summerprairieforbsv2/securigera_varia_1275_usa_illinois_lakecounty_summerprairieforbsv2_p12_3.png"
    ],
    "page_number": 12
  },
  {
    "guide_id": 1275,
    "species_id": "sp_29",
    "scientific_name": "Sisyrinchium angustifolium",
    "common_name": "Stout Blue-eyed Grass",
    "family": "Iridaceae",
    "photo_date": "7-26-19",
    "description": "Beaks. Seed capsules with parts in 3s & 6s are typical of lilies, irises, and other monocot relatives. This is another “grass” that is actually a flower, with vibrant blue-purple 6-pointed flowers and 3-parted capsules with tiny black seeds. Look for open capsules and collect the entire stalk; closed capsules on the same stem are not far behind. Closed capsules are slightly larger than the more common S. albidum.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "sisyrinchium_angustifolium_1275_usa_illinois_lakecounty_summerprairieforbsv2_p12_4.png",
      "sisyrinchium_angustifolium_1275_usa_illinois_lakecounty_summerprairieforbsv2_p12_5.png",
      "sisyrinchium_angustifolium_1275_usa_illinois_lakecounty_summerprairieforbsv2_p12_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882019/1275_usa_illinois_lakecounty_summerprairieforbsv2/sisyrinchium_angustifolium_1275_usa_illinois_lakecounty_summerprairieforbsv2_p12_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882020/1275_usa_illinois_lakecounty_summerprairieforbsv2/sisyrinchium_angustifolium_1275_usa_illinois_lakecounty_summerprairieforbsv2_p12_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882020/1275_usa_illinois_lakecounty_summerprairieforbsv2/sisyrinchium_angustifolium_1275_usa_illinois_lakecounty_summerprairieforbsv2_p12_6.png"
    ],
    "page_number": 12
  },
  {
    "guide_id": 1275,
    "species_id": "sp_30",
    "scientific_name": "Sisyrinchium albidum",
    "common_name": "Common Blue-eyed Grass",
    "family": "Iridaceae",
    "photo_date": "7-31-18",
    "description": "Beaks. These have pale blue or white 6-pointed flowers and 3-parted capsules with tiny black seeds. Look for open capsules, and collect the entire stalk; closed capsules on the same stem are not far behind.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "sisyrinchium_albidum_1275_usa_illinois_lakecounty_summerprairieforbsv2_p12_7.png",
      "sisyrinchium_albidum_1275_usa_illinois_lakecounty_summerprairieforbsv2_p12_8.png",
      "sisyrinchium_albidum_1275_usa_illinois_lakecounty_summerprairieforbsv2_p12_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882016/1275_usa_illinois_lakecounty_summerprairieforbsv2/sisyrinchium_albidum_1275_usa_illinois_lakecounty_summerprairieforbsv2_p12_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882018/1275_usa_illinois_lakecounty_summerprairieforbsv2/sisyrinchium_albidum_1275_usa_illinois_lakecounty_summerprairieforbsv2_p12_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882018/1275_usa_illinois_lakecounty_summerprairieforbsv2/sisyrinchium_albidum_1275_usa_illinois_lakecounty_summerprairieforbsv2_p12_9.png"
    ],
    "page_number": 12
  },
  {
    "guide_id": 1275,
    "species_id": "sp_31",
    "scientific_name": "Anemone cylindrica",
    "common_name": "Thimbleweed",
    "family": "Ranunculaceae",
    "photo_date": "8-1-17",
    "description": "Crumbly coneheads. The thimble-shaped cone fluffs up into a cottony mass when ripe. Look for loose cotton, strips easily by hand when ripe. A. virginiana has leaves that are less deeply lobed, thimbles are less slender (more like gumdrops), and typically found in partial to full shade.",
    "seed_group_names": [
      "Coneheads"
    ],
    "seed_group_details": [
      {
        "name": "Coneheads",
        "images": [
          "Coneheads_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Coneheads are flowers with a cone-shaped center. Imagine these flowers without their colorful parts, and you know exactly what they look like when seeds are ripe."
      }
    ],
    "image_filenames": [
      "anemone_cylindrica_1275_usa_illinois_lakecounty_summerprairieforbsv2_p13_1.png",
      "anemone_cylindrica_1275_usa_illinois_lakecounty_summerprairieforbsv2_p13_2.png",
      "anemone_cylindrica_1275_usa_illinois_lakecounty_summerprairieforbsv2_p13_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881931/1275_usa_illinois_lakecounty_summerprairieforbsv2/anemone_cylindrica_1275_usa_illinois_lakecounty_summerprairieforbsv2_p13_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881932/1275_usa_illinois_lakecounty_summerprairieforbsv2/anemone_cylindrica_1275_usa_illinois_lakecounty_summerprairieforbsv2_p13_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881933/1275_usa_illinois_lakecounty_summerprairieforbsv2/anemone_cylindrica_1275_usa_illinois_lakecounty_summerprairieforbsv2_p13_3.png"
    ],
    "page_number": 13
  },
  {
    "guide_id": 1275,
    "species_id": "sp_32",
    "scientific_name": "Zizia aptera",
    "common_name": "Heart-leaved Meadow Parsnip",
    "family": "Apiaceae",
    "photo_date": "8-1-17",
    "description": "r",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "zizia_aptera_1275_usa_illinois_lakecounty_summerprairieforbsv2_p13_4.png",
      "zizia_aptera_1275_usa_illinois_lakecounty_summerprairieforbsv2_p13_5.png",
      "zizia_aptera_1275_usa_illinois_lakecounty_summerprairieforbsv2_p13_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882039/1275_usa_illinois_lakecounty_summerprairieforbsv2/zizia_aptera_1275_usa_illinois_lakecounty_summerprairieforbsv2_p13_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882040/1275_usa_illinois_lakecounty_summerprairieforbsv2/zizia_aptera_1275_usa_illinois_lakecounty_summerprairieforbsv2_p13_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882041/1275_usa_illinois_lakecounty_summerprairieforbsv2/zizia_aptera_1275_usa_illinois_lakecounty_summerprairieforbsv2_p13_6.png"
    ],
    "page_number": 13
  },
  {
    "guide_id": 1275,
    "species_id": "sp_33",
    "scientific_name": "Geum aleppicum",
    "common_name": "Yellow Avens",
    "family": "Rosaceae",
    "photo_date": "8-2-18",
    "description": "Hitchhikers. Snip head when the brown seeds stick to your clothes. One of a few yellow-flowered avens, this species has larger petals (more than 5 mm long), with sepals of the same length or shorter. 5 or more leaflets per stem leaf. Found in sedge meadows, fens, ditches, old fields.",
    "seed_group_names": [
      "Hitchhikers"
    ],
    "seed_group_details": [
      {
        "name": "Hitchhikers",
        "images": [
          "Hitchhikers_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Hitchhikers are easy to tell when ripe – they hitch a ride on your pants! Color can be an indicator, but not always. Do Not Collect."
      }
    ],
    "image_filenames": [
      "geum_aleppicum_1275_usa_illinois_lakecounty_summerprairieforbsv2_p13_7.png",
      "geum_aleppicum_1275_usa_illinois_lakecounty_summerprairieforbsv2_p13_8.png",
      "geum_aleppicum_1275_usa_illinois_lakecounty_summerprairieforbsv2_p13_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881974/1275_usa_illinois_lakecounty_summerprairieforbsv2/geum_aleppicum_1275_usa_illinois_lakecounty_summerprairieforbsv2_p13_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881974/1275_usa_illinois_lakecounty_summerprairieforbsv2/geum_aleppicum_1275_usa_illinois_lakecounty_summerprairieforbsv2_p13_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881975/1275_usa_illinois_lakecounty_summerprairieforbsv2/geum_aleppicum_1275_usa_illinois_lakecounty_summerprairieforbsv2_p13_9.png"
    ],
    "page_number": 13
  },
  {
    "guide_id": 1275,
    "species_id": "sp_34",
    "scientific_name": "Blephilia ciliata",
    "common_name": "Ohio Horse Mint",
    "family": "Labiatae",
    "photo_date": "8-5-18",
    "description": "Shakers. Mama’s Boy. Similar to Monarda, a mint relative. The flowers fall off to reveal tubes (calyx) that contain the ripening seed. Tip the head into your hand and if tiny black seeds fall out, then snip the entire stalk. Tubes usually turn from green to brown as the seed ripens.",
    "seed_group_names": [
      "Shakers"
    ],
    "seed_group_details": [
      {
        "name": "Shakers",
        "images": [
          "Shakers_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Shakers drop seeds very close to the mother plant, when shaken loose by the wind or a passing critter. Usually a Mama’s Boy, unless strong weather occurs."
      }
    ],
    "image_filenames": [
      "blephilia_ciliata_1275_usa_illinois_lakecounty_summerprairieforbsv2_p14_1.png",
      "blephilia_ciliata_1275_usa_illinois_lakecounty_summerprairieforbsv2_p14_2.png",
      "blephilia_ciliata_1275_usa_illinois_lakecounty_summerprairieforbsv2_p14_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881950/1275_usa_illinois_lakecounty_summerprairieforbsv2/blephilia_ciliata_1275_usa_illinois_lakecounty_summerprairieforbsv2_p14_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881951/1275_usa_illinois_lakecounty_summerprairieforbsv2/blephilia_ciliata_1275_usa_illinois_lakecounty_summerprairieforbsv2_p14_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881951/1275_usa_illinois_lakecounty_summerprairieforbsv2/blephilia_ciliata_1275_usa_illinois_lakecounty_summerprairieforbsv2_p14_3.png"
    ],
    "page_number": 14
  },
  {
    "guide_id": 1275,
    "species_id": "sp_35",
    "scientific_name": "Baptisia lactea",
    "common_name": "White Wild Indigo",
    "family": "Fabaceae",
    "photo_date": "8-6-18",
    "description": "Beaks. Mama’s Boy. Black pods split open to release seeds, ranging in color from chestnut to caramel to mustard. Weevils are a localized problem - sites have tons of weevils, or none. Collect pods & immediately freeze; weevils will hibernate. Weevils reanimate after thawing out, keep in freezer until processing time. Crush the pods (rolling pins, stomping). Use screens or a gentle fan to separate the seeds.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "baptisia_lactea_1275_usa_illinois_lakecounty_summerprairieforbsv2_p14_4.png",
      "baptisia_lactea_1275_usa_illinois_lakecounty_summerprairieforbsv2_p14_5.png",
      "baptisia_lactea_1275_usa_illinois_lakecounty_summerprairieforbsv2_p14_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881945/1275_usa_illinois_lakecounty_summerprairieforbsv2/baptisia_lactea_1275_usa_illinois_lakecounty_summerprairieforbsv2_p14_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881946/1275_usa_illinois_lakecounty_summerprairieforbsv2/baptisia_lactea_1275_usa_illinois_lakecounty_summerprairieforbsv2_p14_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881947/1275_usa_illinois_lakecounty_summerprairieforbsv2/baptisia_lactea_1275_usa_illinois_lakecounty_summerprairieforbsv2_p14_6.png"
    ],
    "page_number": 14
  },
  {
    "guide_id": 1275,
    "species_id": "sp_36",
    "scientific_name": "Baptisia leucophaea",
    "common_name": "Cream Wild Indigo",
    "family": "Facaceae",
    "photo_date": "8-10-18",
    "description": "Beaks. Mama’s Boy. B. leucophaea is a shorter plant and has peach fuzz all over the leaves, pods, and calyx. Pods also have a long tapered point like an elf’s shoe; B. lactea pods are ovals with abrupt tiny points. Collect black pods, crack open a few to check for weevils.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "baptisia_leucophaea_1275_usa_illinois_lakecounty_summerprairieforbsv2_p14_7.png",
      "baptisia_leucophaea_1275_usa_illinois_lakecounty_summerprairieforbsv2_p14_8.png",
      "baptisia_leucophaea_1275_usa_illinois_lakecounty_summerprairieforbsv2_p14_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881947/1275_usa_illinois_lakecounty_summerprairieforbsv2/baptisia_leucophaea_1275_usa_illinois_lakecounty_summerprairieforbsv2_p14_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881949/1275_usa_illinois_lakecounty_summerprairieforbsv2/baptisia_leucophaea_1275_usa_illinois_lakecounty_summerprairieforbsv2_p14_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881949/1275_usa_illinois_lakecounty_summerprairieforbsv2/baptisia_leucophaea_1275_usa_illinois_lakecounty_summerprairieforbsv2_p14_9.png"
    ],
    "page_number": 14
  },
  {
    "guide_id": 1275,
    "species_id": "sp_37",
    "scientific_name": "Arnoglossum plantagineum",
    "common_name": "Prairie Indian Plantain",
    "family": "Asteraceae",
    "photo_date": "8-14-20",
    "description": "Fluffy. This species of Indian plantain is easily distinguished by the leaf shape: unlobed plantain-shaped leaves, as the name suggests. Leaves have a thick succulent texture and distinct parallel veins. White flowers turn to oil-black seeds with bright white fluff. Plants about 1 m tall. Uncommon, found in fens and other wet to mesic prairies; rarely in gravel hill prairies.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "arnoglossum_plantagineum_1275_usa_illinois_lakecounty_summerprairieforbsv2_p15_1.png",
      "arnoglossum_plantagineum_1275_usa_illinois_lakecounty_summerprairieforbsv2_p15_2.png",
      "arnoglossum_plantagineum_1275_usa_illinois_lakecounty_summerprairieforbsv2_p15_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881940/1275_usa_illinois_lakecounty_summerprairieforbsv2/arnoglossum_plantagineum_1275_usa_illinois_lakecounty_summerprairieforbsv2_p15_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881940/1275_usa_illinois_lakecounty_summerprairieforbsv2/arnoglossum_plantagineum_1275_usa_illinois_lakecounty_summerprairieforbsv2_p15_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881942/1275_usa_illinois_lakecounty_summerprairieforbsv2/arnoglossum_plantagineum_1275_usa_illinois_lakecounty_summerprairieforbsv2_p15_3.png"
    ],
    "page_number": 15
  },
  {
    "guide_id": 1275,
    "species_id": "sp_38",
    "scientific_name": "Calystegia sepium",
    "common_name": "Hedge Bindweed",
    "family": "Convulvulaceae",
    "photo_date": "8-16-20",
    "description": "Beaks. Grows in many habitats. Morning glory-type flowers, like a ball gown skirt. Note the greenery at the base of the flower: Calystegia (means “covered calyx”) have 2 large bracts overlapping the smaller calyx; the calyx of European Convolvulus is clearly visible with 5 lobes. Leaves are elongated triangular arrowheads, and the gap between the 2 lobes is a thin triangle space, rather than a quadrate gap.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "calystegia_sepium_1275_usa_illinois_lakecounty_summerprairieforbsv2_p15_4.png",
      "calystegia_sepium_1275_usa_illinois_lakecounty_summerprairieforbsv2_p15_5.png",
      "calystegia_sepium_1275_usa_illinois_lakecounty_summerprairieforbsv2_p15_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881952/1275_usa_illinois_lakecounty_summerprairieforbsv2/calystegia_sepium_1275_usa_illinois_lakecounty_summerprairieforbsv2_p15_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881953/1275_usa_illinois_lakecounty_summerprairieforbsv2/calystegia_sepium_1275_usa_illinois_lakecounty_summerprairieforbsv2_p15_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881953/1275_usa_illinois_lakecounty_summerprairieforbsv2/calystegia_sepium_1275_usa_illinois_lakecounty_summerprairieforbsv2_p15_6.png"
    ],
    "page_number": 15
  },
  {
    "guide_id": 1275,
    "species_id": "sp_39",
    "scientific_name": "Asclepias tuberosa",
    "common_name": "Butterfly Weed",
    "family": "Asclepiadaceae",
    "photo_date": "8-24-17",
    "description": "Milkweed. Collect when the vertical seam starts to split open. Can check with a *gentle* squeeze, the seeds must be brown inside. Milkweeds are tough to process. Best to clean them fresh (before fluff dries & expands). Otherwise use a shop vac with a light horsepower or the Monarch Watch’s Seed Separator - free design online for a DIY milkweed separator.",
    "seed_group_names": [
      "Milkweed"
    ],
    "seed_group_details": [
      {
        "name": "Milkweed",
        "images": [
          "Milkweed_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Milkweed seeds are ripe when pods are split open & seeds are brown."
      }
    ],
    "image_filenames": [
      "asclepias_tuberosa_1275_usa_illinois_lakecounty_summerprairieforbsv2_p15_7.png",
      "asclepias_tuberosa_1275_usa_illinois_lakecounty_summerprairieforbsv2_p15_8.png",
      "asclepias_tuberosa_1275_usa_illinois_lakecounty_summerprairieforbsv2_p15_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881943/1275_usa_illinois_lakecounty_summerprairieforbsv2/asclepias_tuberosa_1275_usa_illinois_lakecounty_summerprairieforbsv2_p15_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881944/1275_usa_illinois_lakecounty_summerprairieforbsv2/asclepias_tuberosa_1275_usa_illinois_lakecounty_summerprairieforbsv2_p15_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881944/1275_usa_illinois_lakecounty_summerprairieforbsv2/asclepias_tuberosa_1275_usa_illinois_lakecounty_summerprairieforbsv2_p15_9.png"
    ],
    "page_number": 15
  },
  {
    "guide_id": 1275,
    "species_id": "sp_40",
    "scientific_name": "Penstemon calycosus",
    "common_name": "Smooth Beard Tongue",
    "family": "Scrophulariaceae",
    "photo_date": "8-21-18",
    "description": "Beaks. Mama’s Boys. Tear-drop shaped capsules take a long time to turn from green to burgundy to brown and finally opening their beaks. Snip stems when beaks are open, or at least capsules are brown. Capsules are hard & stinky.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "penstemon_calycosus_1275_usa_illinois_lakecounty_summerprairieforbsv2_p16_1.png",
      "penstemon_calycosus_1275_usa_illinois_lakecounty_summerprairieforbsv2_p16_2.png",
      "penstemon_calycosus_1275_usa_illinois_lakecounty_summerprairieforbsv2_p16_3.png",
      "penstemon_calycosus_1275_usa_illinois_lakecounty_summerprairieforbsv2_p16_4.png",
      "penstemon_calycosus_1275_usa_illinois_lakecounty_summerprairieforbsv2_p16_5.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881999/1275_usa_illinois_lakecounty_summerprairieforbsv2/penstemon_calycosus_1275_usa_illinois_lakecounty_summerprairieforbsv2_p16_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881999/1275_usa_illinois_lakecounty_summerprairieforbsv2/penstemon_calycosus_1275_usa_illinois_lakecounty_summerprairieforbsv2_p16_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882000/1275_usa_illinois_lakecounty_summerprairieforbsv2/penstemon_calycosus_1275_usa_illinois_lakecounty_summerprairieforbsv2_p16_3.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882001/1275_usa_illinois_lakecounty_summerprairieforbsv2/penstemon_calycosus_1275_usa_illinois_lakecounty_summerprairieforbsv2_p16_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882002/1275_usa_illinois_lakecounty_summerprairieforbsv2/penstemon_calycosus_1275_usa_illinois_lakecounty_summerprairieforbsv2_p16_5.png"
    ],
    "page_number": 16
  },
  {
    "guide_id": 1275,
    "species_id": "sp_41",
    "scientific_name": "Drymocallis arguta",
    "common_name": "Prairie Cinquefoil",
    "family": "Rosaceae",
    "photo_date": "8-24-17",
    "description": "Beaks. This conservative species of dry and mesic prairies flowers like wild strawberry (five white petals around a yellow center) but 1 - 3 feet tall. Tons of tiny seeds form inside each little head. Tip the head into your hand and if seeds fall out, then snip the entire stalk.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "drymocallis_arguta_1275_usa_illinois_lakecounty_summerprairieforbsv2_p16_6.png",
      "drymocallis_arguta_1275_usa_illinois_lakecounty_summerprairieforbsv2_p16_7.png",
      "drymocallis_arguta_1275_usa_illinois_lakecounty_summerprairieforbsv2_p16_8.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881959/1275_usa_illinois_lakecounty_summerprairieforbsv2/drymocallis_arguta_1275_usa_illinois_lakecounty_summerprairieforbsv2_p16_6.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881960/1275_usa_illinois_lakecounty_summerprairieforbsv2/drymocallis_arguta_1275_usa_illinois_lakecounty_summerprairieforbsv2_p16_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766881961/1275_usa_illinois_lakecounty_summerprairieforbsv2/drymocallis_arguta_1275_usa_illinois_lakecounty_summerprairieforbsv2_p16_8.png"
    ],
    "page_number": 16
  },
  {
    "guide_id": 1275,
    "species_id": "sp_42",
    "scientific_name": "Veronicastrum virginicum",
    "common_name": "Culver’s Root",
    "family": "Scrophulariaceae",
    "photo_date": "8-25-17",
    "description": "Beaks! The brown “beads” on the stalk are often assumed to be the seed, but each is actually a tiny beak with tiny seeds. About 800,000 seeds/oz. Snip stalks when brown, carefully do not tip the stalk until it is over your bag. Tiny seeds can pass through no-see-um mesh.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1275_usa_illinois_lakecounty_summerprairieforbsv2_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "veronicastrum_virginicum_1275_usa_illinois_lakecounty_summerprairieforbsv2_p17_1.png",
      "veronicastrum_virginicum_1275_usa_illinois_lakecounty_summerprairieforbsv2_p17_2.png",
      "veronicastrum_virginicum_1275_usa_illinois_lakecounty_summerprairieforbsv2_p17_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882034/1275_usa_illinois_lakecounty_summerprairieforbsv2/veronicastrum_virginicum_1275_usa_illinois_lakecounty_summerprairieforbsv2_p17_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882035/1275_usa_illinois_lakecounty_summerprairieforbsv2/veronicastrum_virginicum_1275_usa_illinois_lakecounty_summerprairieforbsv2_p17_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766882035/1275_usa_illinois_lakecounty_summerprairieforbsv2/veronicastrum_virginicum_1275_usa_illinois_lakecounty_summerprairieforbsv2_p17_3.png"
    ],
    "page_number": 17
  },
  {
    "guide_id": 1276,
    "species_id": "sp_1",
    "scientific_name": "Carex pensylvanica",
    "common_name": "Common Oak Sedge",
    "family": "Cyperaceae",
    "photo_date": "6-2-18",
    "description": "Penn sedge is reportedly poor from seed. The truth is that they MUST be sown fresh and you need to cover a lot of ground to collect a decent quantity of these small seeds. Look for round beads, check with the touch test for ripeness. Spreads easily through vegetative reproduction.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_pensylvanica_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p3_1.png",
      "carex_pensylvanica_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p3_2.png",
      "carex_pensylvanica_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p3_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884099/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_pensylvanica_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p3_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884100/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_pensylvanica_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p3_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884101/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_pensylvanica_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p3_3.png"
    ],
    "page_number": 3
  },
  {
    "guide_id": 1276,
    "species_id": "sp_2",
    "scientific_name": "Carex hirtifolia",
    "common_name": "Hairy Wood Sedge",
    "family": "Cyperaceae",
    "photo_date": "6-10-19",
    "description": "Only a few woodland sedges are hairy short bunches. Hairy wood sedge has hairy stems, leaves, and perigynia. Like C. blanda, leaves have the accordion fold and similar stature. Perigynia are pointed (unlike the similar C. hirsutella with pinecone-like seed heads). Sow fresh.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_hirtifolia_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p3_4.png",
      "carex_hirtifolia_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p3_5.png",
      "carex_hirtifolia_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p3_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884088/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_hirtifolia_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p3_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884089/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_hirtifolia_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p3_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884091/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_hirtifolia_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p3_6.png"
    ],
    "page_number": 3
  },
  {
    "guide_id": 1276,
    "species_id": "sp_3",
    "scientific_name": "Carex blanda",
    "common_name": "Common Wood Sedge",
    "family": "Cyperaceae",
    "photo_date": "6-14-19",
    "description": "Well-named, this is an incredibly common sedges of the woods, and can grow in a variety of moisture levels. Perigynia are packed tightly on the stems. Check out the veins on the perigynia under magnification and note the bent “beak” (point at the end) to confirm ID. Sow fresh.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_blanda_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p3_7.png",
      "carex_blanda_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p3_8.png",
      "carex_blanda_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p3_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884052/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_blanda_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p3_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884053/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_blanda_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p3_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884054/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_blanda_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p3_9.png"
    ],
    "page_number": 3
  },
  {
    "guide_id": 1276,
    "species_id": "sp_4",
    "scientific_name": "Carex jamesii",
    "common_name": "Grass Sedge",
    "family": "Cyperaceae",
    "photo_date": "6-14-19",
    "description": "A dense clump of leaves with short fruiting stems (shorter than the leaves) hiding inside. Perigynia are round and abruptly pinches (does not taper) to form the long beak. Leaves are up to 3.7 mm wide. Sow fresh.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_jamesii_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p4_1.png",
      "carex_jamesii_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p4_2.png",
      "carex_jamesii_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p4_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884092/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_jamesii_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p4_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884093/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_jamesii_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p4_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884094/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_jamesii_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p4_3.png"
    ],
    "page_number": 4
  },
  {
    "guide_id": 1276,
    "species_id": "sp_5",
    "scientific_name": "Carex woodii",
    "common_name": "Wood’s Stiff Sedge",
    "family": "Cyperaceae",
    "photo_date": "6-14-19",
    "description": "A woodland sedge growing in clumps or loose rhizomatous colonies. Sheaths are red-purple, especially at the base. Limited flowering stalks. Perigynia are small like Penn sedge (C. pensylvanica) but the beaks are practically nonexistent on C. woodii. Sow fresh.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_woodii_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p4_4.png",
      "carex_woodii_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p4_5.png",
      "carex_woodii_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p4_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884116/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_woodii_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p4_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884117/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_woodii_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p4_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884118/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_woodii_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p4_6.png"
    ],
    "page_number": 4
  },
  {
    "guide_id": 1276,
    "species_id": "sp_6",
    "scientific_name": "Carex grisea",
    "common_name": "Wood Gray Sedge",
    "family": "Cyperaceae",
    "photo_date": "6-19-20",
    "description": "Common in habitats near streams and fens, but can also be found in woodlands from wet to dry-mesic. Grows in clumps. Small spikelets, rounded perigynia with tiny beaks, scales have long awns extending out under each perigynium.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_grisea_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p4_7.png",
      "carex_grisea_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p4_8.png",
      "carex_grisea_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p4_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884082/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_grisea_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p4_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884082/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_grisea_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p4_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884083/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_grisea_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p4_9.png"
    ],
    "page_number": 4
  },
  {
    "guide_id": 1276,
    "species_id": "sp_7",
    "scientific_name": "Carex gracillima",
    "common_name": "Purple-sheathed Graceful Sedge",
    "family": "Cyperaceae",
    "photo_date": "6-20-18",
    "description": "One of a few species with graceful, dangly spikelets of seeds. As the name says, the sheath is purple, especially at the base. Perigynia are practically beakless. Grows in a surprising variety of shady habitats: rich mesic woodlands & savannas, flatwoods, bogs.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_gracillima_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p5_1.png",
      "carex_gracillima_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p5_2.png",
      "carex_gracillima_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p5_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884066/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_gracillima_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p5_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884067/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_gracillima_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p5_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884069/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_gracillima_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p5_3.png"
    ],
    "page_number": 5
  },
  {
    "guide_id": 1276,
    "species_id": "sp_8",
    "scientific_name": "Carex sprengelii",
    "common_name": "Long-beaked Sedge",
    "family": "Cyperaceae",
    "photo_date": "6-20-18",
    "description": "Another graceful, dangling sedge, but the spikelets have a prickly appearance, due to the long beaks & the long scales. Easy to strip by hand. Grows in rich mesic woodlands.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_sprengelii_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p5_4.png",
      "carex_sprengelii_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p5_5.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884111/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_sprengelii_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p5_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884113/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_sprengelii_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p5_5.png"
    ],
    "page_number": 5
  },
  {
    "guide_id": 1276,
    "species_id": "sp_9",
    "scientific_name": "Carex brevior",
    "common_name": "Plains Oval Sedge",
    "family": "Cyperaceae",
    "photo_date": "6-24-17",
    "description": "Mama’s Boy. Collect when light brown & crumbles easily by hand. Also called short-beaked sedge (the tapered point of the perigynia) which is noticeably shorter than most species. One of the difficult oval sedges – consult a good Carex book for the nuances.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_brevior_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p5_6.png",
      "carex_brevior_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p5_7.png",
      "carex_brevior_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p5_8.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884055/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_brevior_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p5_6.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884057/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_brevior_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p5_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884058/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_brevior_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p5_8.png"
    ],
    "page_number": 5
  },
  {
    "guide_id": 1276,
    "species_id": "sp_10",
    "scientific_name": "Carex bicknellii",
    "common_name": "Copper-shouldered Oval Sedge",
    "family": "Cyperaceae",
    "photo_date": "6-27-18",
    "description": "Mama’s Boy. Collect when light brown & crumbles easily by hand. Seed looks like a fried egg - crumble the seed heads, and the achene shows through the thin perigynia like an egg yolk. Another “Oh no, Oval sedge!” but this has larger seeds and one of the few prairie sedges.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_bicknellii_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p6_1.png",
      "carex_bicknellii_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p6_2.png",
      "carex_bicknellii_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p6_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884047/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_bicknellii_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p6_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884049/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_bicknellii_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p6_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884050/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_bicknellii_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p6_3.png"
    ],
    "page_number": 6
  },
  {
    "guide_id": 1276,
    "species_id": "sp_11",
    "scientific_name": "Carex davisii",
    "common_name": "Awned Graceful Sedge",
    "family": "Cyperaceae",
    "photo_date": "6-27-18",
    "description": "This woodland sedge has chunky perigynia, which are bigger than most species this time of year. Sheaths are hairy, stems & leaves are sparsely hairy. Perigynia turn a variety of red, brown, beige colors when ripe, and plumper than many species, like a football.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_davisii_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p6_4.png",
      "carex_davisii_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p6_5.png",
      "carex_davisii_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p6_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884062/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_davisii_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p6_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884064/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_davisii_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p6_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884065/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_davisii_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p6_6.png"
    ],
    "page_number": 6
  },
  {
    "guide_id": 1276,
    "species_id": "sp_12",
    "scientific_name": "Carex gravida",
    "common_name": "Long-awned Bracted Sedge",
    "family": "Cyperaceae",
    "photo_date": "6-27-18",
    "description": "Mama’s Boy. This common species is also known as heavy sedge, with a thick, heavy stalk. The bract sticks out just under the spike. The spikelets (the little “pinecone” clusters of seeds) are tightly packed, with a slight separation of the lowest spikelets.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_gravida_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p6_7.png",
      "carex_gravida_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p6_8.png",
      "carex_gravida_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p6_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884079/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_gravida_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p6_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884080/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_gravida_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p6_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884081/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_gravida_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p6_9.png"
    ],
    "page_number": 6
  },
  {
    "guide_id": 1276,
    "species_id": "sp_13",
    "scientific_name": "Carex cephalophora",
    "common_name": "Short-headed Bracted Sedge",
    "family": "Cyperaceae",
    "photo_date": "7-5-19",
    "description": "Small clusters of terminal seeds, with little bracts sticking out under the spikelets, perpendicular to the stem. Collect when crumbles by hand. Grows in dry-mesic & mesic woodlands.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_cephalophora_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p7_1.png",
      "carex_cephalophora_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p7_2.png",
      "carex_cephalophora_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p7_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884059/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_cephalophora_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p7_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884060/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_cephalophora_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p7_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884061/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_cephalophora_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p7_3.png"
    ],
    "page_number": 7
  },
  {
    "guide_id": 1276,
    "species_id": "sp_14",
    "scientific_name": "Carex radiata",
    "common_name": "Straight-styled Wood Sedge",
    "family": "Cyperaceae",
    "photo_date": "7-4-2018",
    "description": "One of the “star sedges.” C. radiata & C. rosea look very similar! Radiata is more often in wetter shady spots; rosea is more likely in the upland. Radiata is generally in a looser, less dense/robust clump. Sow fresh for best results.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_radiata_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p7_4.png",
      "carex_radiata_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p7_5.png",
      "carex_radiata_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p7_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884102/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_radiata_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p7_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884103/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_radiata_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p7_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884104/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_radiata_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p7_6.png"
    ],
    "page_number": 7
  },
  {
    "guide_id": 1276,
    "species_id": "sp_15",
    "scientific_name": "Carex rosea",
    "common_name": "Curly-styled Wood Sedge",
    "family": "Cyperaceae",
    "photo_date": "7-6-2018",
    "description": "Radiata has *mostly* straight styles, rosea is all curly (check Apr/May). Leaves of radiata are *mostly* less than 2mm wide, leaves of rosea are *mostly* 2-3mm wide. Both species are great to have, and their habitats overlap. Seeds strip off easily by hand when ripe.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_rosea_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p7_7.png",
      "carex_rosea_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p7_8.png",
      "carex_rosea_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p7_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884105/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_rosea_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p7_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884106/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_rosea_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p7_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884107/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_rosea_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p7_9.png"
    ],
    "page_number": 7
  },
  {
    "guide_id": 1276,
    "species_id": "sp_16",
    "scientific_name": "Carex granularis",
    "common_name": "Pale Sedge",
    "family": "Cyperaceae",
    "photo_date": "7-10-19",
    "description": "Mama’s Boy. One of several species with seeds like little granules, this one is common in moist meadows, fens, and ditches. Grows in clumps. Consult a Carex book, specifically the sections for Granulares, Griseae, and Laxiflorae. Collect when it easily crumbles by hand.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_granularis_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p8_1.png",
      "carex_granularis_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p8_2.png",
      "carex_granularis_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p8_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884071/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_granularis_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p8_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884075/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_granularis_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p8_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884078/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_granularis_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p8_3.png"
    ],
    "page_number": 8
  },
  {
    "guide_id": 1276,
    "species_id": "sp_17",
    "scientific_name": "Carex hirsutella",
    "common_name": "Fuzzy Wuzzy Sedge",
    "family": "Cyperaceae",
    "photo_date": "7-18-17",
    "description": "One of a few hairy woodland sedges, this one forms loose clumps with wiry fruiting stems. Perigynia are hairless and clustered like rounded pinecones. Collect when easy to strip by hand, typically green.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_hirsutella_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p8_4.png",
      "carex_hirsutella_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p8_5.png",
      "carex_hirsutella_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p8_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884084/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_hirsutella_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p8_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884085/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_hirsutella_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p8_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884087/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_hirsutella_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p8_6.png"
    ],
    "page_number": 8
  },
  {
    "guide_id": 1276,
    "species_id": "sp_18",
    "scientific_name": "Carex sparganioides",
    "common_name": "Loose-headed Bracted Sedge",
    "family": "Cyperaceae",
    "photo_date": "8-5-17",
    "description": "Mama’s Boy. Well-named for the loosely spaced spikelets of seeds. The seed stalks are taller than most woodland sedges, although they are often knocked flat to the ground by the time the seed is ripe.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_sparganioides_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p8_7.png",
      "carex_sparganioides_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p8_8.png",
      "carex_sparganioides_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p8_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884108/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_sparganioides_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p8_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884110/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_sparganioides_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p8_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884110/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_sparganioides_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p8_9.png"
    ],
    "page_number": 8
  },
  {
    "guide_id": 1276,
    "species_id": "sp_19",
    "scientific_name": "Carex normalis",
    "common_name": "Spreading Oval Sedge",
    "family": "Cyeraceae",
    "photo_date": "8-8-2018",
    "description": "Mama’s Boy. Another pesky oval sedge. This one typically has a kink in the stem above the lowest spikelet, pointing off towards the horizon. Shade preferred, but can grow in sun with wetter soils.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_normalis_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p9_1.png",
      "carex_normalis_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p9_2.png",
      "carex_normalis_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p9_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884095/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_normalis_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p9_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884097/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_normalis_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p9_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884098/1276_usa_illinois_lakecounty_summergrassesandkin_v2/carex_normalis_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p9_3.png"
    ],
    "page_number": 9
  },
  {
    "guide_id": 1276,
    "species_id": "sp_20",
    "scientific_name": "Luzula multiflora",
    "common_name": "Common Woodrush",
    "family": "Juncaceae",
    "photo_date": "6-14-18",
    "description": "Beaks. Common woodrush is not common at all. Brown capsules open up to reveal tiny Oreo-colored seeds inside. Collect when capsules are brown and open. Sow fresh. Grows in savannas, open woodlands, and prefers mesic to dry-mesic soils.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "luzula_multiflora_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p9_4.png",
      "luzula_multiflora_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p9_5.png",
      "luzula_multiflora_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p9_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884173/1276_usa_illinois_lakecounty_summergrassesandkin_v2/luzula_multiflora_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p9_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884176/1276_usa_illinois_lakecounty_summergrassesandkin_v2/luzula_multiflora_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p9_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884177/1276_usa_illinois_lakecounty_summergrassesandkin_v2/luzula_multiflora_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p9_6.png"
    ],
    "page_number": 9
  },
  {
    "guide_id": 1276,
    "species_id": "sp_21",
    "scientific_name": "Juncus tenuis",
    "common_name": "Path Rush",
    "family": "Juncaceae",
    "photo_date": "8-3-18",
    "description": "An ultra-common rush, this wiry & resilient species often pops up in trampled paths (hence the name). Seed capsules turn beige & split open in 3 parts, shaking out teeny tiny seeds – note the seed photo shows them about as wide as the line on a millimeter ruler.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "juncus_tenuis_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p9_7.png",
      "juncus_tenuis_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p9_8.png",
      "juncus_tenuis_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p9_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884168/1276_usa_illinois_lakecounty_summergrassesandkin_v2/juncus_tenuis_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p9_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884170/1276_usa_illinois_lakecounty_summergrassesandkin_v2/juncus_tenuis_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p9_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884172/1276_usa_illinois_lakecounty_summergrassesandkin_v2/juncus_tenuis_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p9_9.png"
    ],
    "page_number": 9
  },
  {
    "guide_id": 1276,
    "species_id": "sp_22",
    "scientific_name": "Sphenopholis intermedia",
    "common_name": "Slender Wedge Grass",
    "family": "Poaceae",
    "photo_date": "6-19-17",
    "description": "This native annual has feathery seed heads that turn creamy off-white when ripe. Seeds become very loose and can be stripped by hand or clipped. Does well in disturbance, fades away as more conservation natives take hold.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "sphenopholis_intermedia_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p10_1.png",
      "sphenopholis_intermedia_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p10_2.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884201/1276_usa_illinois_lakecounty_summergrassesandkin_v2/sphenopholis_intermedia_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p10_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884202/1276_usa_illinois_lakecounty_summergrassesandkin_v2/sphenopholis_intermedia_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p10_2.png"
    ],
    "page_number": 10
  },
  {
    "guide_id": 1276,
    "species_id": "sp_23",
    "scientific_name": "Hesperostipa spartea",
    "common_name": "Porcupine Grass",
    "family": "Poaceae",
    "photo_date": "6-24-18",
    "description": "Well-named with sharp pointy seeds, ouch! Seeds drill themselves into the soil, as the long awns (seed tails) twist with changing moisture. Look for dark awns contrasted against the pale glumes; seed will come off with a gentle tug. *Best stored with constant humidity, and for as short as possible. Forgotten bundles turn into a tangled nightmare.* If awns are removed, bury the seeds 3/4\". Use a nail to make a hole.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "hesperostipa_spartea_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p10_3.png",
      "hesperostipa_spartea_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p10_4.png",
      "hesperostipa_spartea_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p10_5.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884159/1276_usa_illinois_lakecounty_summergrassesandkin_v2/hesperostipa_spartea_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p10_3.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884160/1276_usa_illinois_lakecounty_summergrassesandkin_v2/hesperostipa_spartea_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p10_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884161/1276_usa_illinois_lakecounty_summergrassesandkin_v2/hesperostipa_spartea_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p10_5.png"
    ],
    "page_number": 10
  },
  {
    "guide_id": 1276,
    "species_id": "sp_24",
    "scientific_name": "Dichanthelium implicatum",
    "common_name": "Common Panic Grass",
    "family": "Poaceae",
    "photo_date": "7-10-19",
    "description": "This panic grass has much smaller seeds than Leiberg’s & Scribner’s. Common in disturbed & open places. Seeds are ripe when they are beige-ish and are best sown fresh. Panic grasses have seeds arranged in a panicle (xmas tree shape, and each branch has several branches)",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "dichanthelium_implicatum_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p10_6.png",
      "dichanthelium_implicatum_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p10_7.png",
      "dichanthelium_implicatum_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p10_8.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884128/1276_usa_illinois_lakecounty_summergrassesandkin_v2/dichanthelium_implicatum_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p10_6.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884129/1276_usa_illinois_lakecounty_summergrassesandkin_v2/dichanthelium_implicatum_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p10_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884130/1276_usa_illinois_lakecounty_summergrassesandkin_v2/dichanthelium_implicatum_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p10_8.png"
    ],
    "page_number": 10
  },
  {
    "guide_id": 1276,
    "species_id": "sp_25",
    "scientific_name": "Dichanthelium latifolium",
    "common_name": "Broad-leaved Panic Grass",
    "family": "Poaceae",
    "photo_date": "6-23-18",
    "description": "Dichantheliums, are tough to collect. The seeds will ripen sporadically on the same plant. Look for tiny purple florets at the apex of the seed; these are blooming and should not be collected. Seeds are hidden in glumes, like a hairy clamshell and are beige-ish when ripe. Note: all species that have been renamed Dichanthelium (literally “twice-flowering”) will form more seeds later (August).",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "dichanthelium_latifolium_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p11_1.png",
      "dichanthelium_latifolium_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p11_2.png",
      "dichanthelium_latifolium_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p11_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884130/1276_usa_illinois_lakecounty_summergrassesandkin_v2/dichanthelium_latifolium_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p11_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884132/1276_usa_illinois_lakecounty_summergrassesandkin_v2/dichanthelium_latifolium_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p11_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884136/1276_usa_illinois_lakecounty_summergrassesandkin_v2/dichanthelium_latifolium_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p11_3.png"
    ],
    "page_number": 11
  },
  {
    "guide_id": 1276,
    "species_id": "sp_26",
    "scientific_name": "Dichanthelium leibergii",
    "common_name": "Prairie Panic Grass",
    "family": "Poaceae",
    "photo_date": "6-27-18",
    "description": "Dichanthelium species are tough to collect & ID. This species has hairy spikelets, with some hairs more than 0.5 mm long. Strip the seeds with feather-light pressure, only a few seeds will be ripe each day. It takes patience & persistence to collect a quantity.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "dichanthelium_leibergii_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p11_4.png",
      "dichanthelium_leibergii_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p11_5.png",
      "dichanthelium_leibergii_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p11_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884137/1276_usa_illinois_lakecounty_summergrassesandkin_v2/dichanthelium_leibergii_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p11_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884138/1276_usa_illinois_lakecounty_summergrassesandkin_v2/dichanthelium_leibergii_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p11_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884140/1276_usa_illinois_lakecounty_summergrassesandkin_v2/dichanthelium_leibergii_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p11_6.png"
    ],
    "page_number": 11
  },
  {
    "guide_id": 1276,
    "species_id": "sp_27",
    "scientific_name": "Dichanthelium scribnerianum",
    "common_name": "Scribner’s Panic Grass",
    "family": "Poaceae",
    "photo_date": "7-3-19",
    "description": "Very similar to D. leibergii, but D. scribnerianum has smaller spikelets, 3.1 - 3.3 mm long (3.7 - 4 mm for D. leibergii), and spikelet has miniscule hairs, if at all (D. leibergii spikelet hairs can be 0.75 mm long). Ligule is a single row of hairs (no ligule on D. leibergii).",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "dichanthelium_scribnerianum_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p11_7.png",
      "dichanthelium_scribnerianum_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p11_8.png",
      "dichanthelium_scribnerianum_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p11_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884140/1276_usa_illinois_lakecounty_summergrassesandkin_v2/dichanthelium_scribnerianum_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p11_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884141/1276_usa_illinois_lakecounty_summergrassesandkin_v2/dichanthelium_scribnerianum_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p11_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884142/1276_usa_illinois_lakecounty_summergrassesandkin_v2/dichanthelium_scribnerianum_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p11_9.png"
    ],
    "page_number": 11
  },
  {
    "guide_id": 1276,
    "species_id": "sp_28",
    "scientific_name": "Danthonia spicata",
    "common_name": "Poverty Oat Grass",
    "family": "Poaceae",
    "photo_date": "7-1-18",
    "description": "Mama’s Boy. Collect when beige & crumbles easily by hand. Named for its preference for impoverished soils. Look for tufts of curled basal leaves.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "danthonia_spicata_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p12_1.png",
      "danthonia_spicata_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p12_2.png",
      "danthonia_spicata_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p12_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884121/1276_usa_illinois_lakecounty_summergrassesandkin_v2/danthonia_spicata_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p12_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884124/1276_usa_illinois_lakecounty_summergrassesandkin_v2/danthonia_spicata_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p12_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884125/1276_usa_illinois_lakecounty_summergrassesandkin_v2/danthonia_spicata_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p12_3.png"
    ],
    "page_number": 12
  },
  {
    "guide_id": 1276,
    "species_id": "sp_29",
    "scientific_name": "Dactylis glomerata",
    "common_name": "Orchard Grass",
    "family": "Poaceae",
    "photo_date": "7-4-18",
    "description": "Introduced for grazing, this grass is most often in disturbed soils but can be found in better quality habitats. Looks similar to reed canary grass, but not as obnoxious. Spikelets are rounded and generally upright. Do not collect.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "dactylis_glomerata_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p12_4.png",
      "dactylis_glomerata_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p12_5.png",
      "dactylis_glomerata_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p12_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884119/1276_usa_illinois_lakecounty_summergrassesandkin_v2/dactylis_glomerata_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p12_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884119/1276_usa_illinois_lakecounty_summergrassesandkin_v2/dactylis_glomerata_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p12_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884120/1276_usa_illinois_lakecounty_summergrassesandkin_v2/dactylis_glomerata_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p12_6.png"
    ],
    "page_number": 12
  },
  {
    "guide_id": 1276,
    "species_id": "sp_30",
    "scientific_name": "Festuca subverticillata",
    "common_name": "Nodding Fescue",
    "family": "Poaceae",
    "photo_date": "7-10-19",
    "description": "This native fescue is found in mesic woodlands. Usually in low abundance, it may be a short-lived perennial. The lowest seed stalk tends to ‘nod’ toward the ground, and the entire panicle nods towards the ground when ripe. Collect when beige and strips easily by hand.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "festuca_subverticillata_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p12_7.png",
      "festuca_subverticillata_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p12_8.png",
      "festuca_subverticillata_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p12_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884149/1276_usa_illinois_lakecounty_summergrassesandkin_v2/festuca_subverticillata_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p12_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884151/1276_usa_illinois_lakecounty_summergrassesandkin_v2/festuca_subverticillata_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p12_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884152/1276_usa_illinois_lakecounty_summergrassesandkin_v2/festuca_subverticillata_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p12_9.png"
    ],
    "page_number": 12
  },
  {
    "guide_id": 1276,
    "species_id": "sp_31",
    "scientific_name": "Glyceria striata",
    "common_name": "Green Fowl Manna Grass",
    "family": "Poaceae",
    "photo_date": "7-16-2020",
    "description": "Mama’s Boy. This common grass is found most often in wetlands, both in full sun and in shade, but can also be found in dry-mesic woodlands and muddy path edges. Flora moves this species from [FACW] to [FAC] for our region. Grass blades have a palm-look to them. Easy to collect: strip beige seeds when loose. Seeds feel granular. Var. stricta has leaves 5mm wide or less, often folded; lemmas purplish.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "glyceria_striata_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p13_1.png",
      "glyceria_striata_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p13_2.png",
      "glyceria_striata_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p13_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884154/1276_usa_illinois_lakecounty_summergrassesandkin_v2/glyceria_striata_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p13_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884155/1276_usa_illinois_lakecounty_summergrassesandkin_v2/glyceria_striata_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p13_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884156/1276_usa_illinois_lakecounty_summergrassesandkin_v2/glyceria_striata_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p13_3.png"
    ],
    "page_number": 13
  },
  {
    "guide_id": 1276,
    "species_id": "sp_32",
    "scientific_name": "Bromus inermis",
    "common_name": "Hungarian Brome",
    "family": "Poaceae",
    "photo_date": "7-24-18",
    "description": "A cool-season pasture grass that readily spreads by rhizomes to form a dense, clumping sod. Usually hairless (also called smooth brome) and has a W-shaped crimp about halfway up the blade. Crowds out natives & needs to be killed or reduced before native seeding can occur.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "bromus_inermis_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p13_4.png",
      "bromus_inermis_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p13_5.png",
      "bromus_inermis_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p13_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884042/1276_usa_illinois_lakecounty_summergrassesandkin_v2/bromus_inermis_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p13_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884044/1276_usa_illinois_lakecounty_summergrassesandkin_v2/bromus_inermis_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p13_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884046/1276_usa_illinois_lakecounty_summergrassesandkin_v2/bromus_inermis_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p13_6.png"
    ],
    "page_number": 13
  },
  {
    "guide_id": 1276,
    "species_id": "sp_33",
    "scientific_name": "Phleum pratense",
    "common_name": "Timothy",
    "family": "Poaceae",
    "photo_date": "8-4-18",
    "description": "Planted as a pasture grass, this species is found in disturbed soils and old Ag fields. The dense spike generally makes it easy to ID.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "phleum_pratense_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p13_7.png",
      "phleum_pratense_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p13_8.png",
      "phleum_pratense_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p13_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884183/1276_usa_illinois_lakecounty_summergrassesandkin_v2/phleum_pratense_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p13_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884184/1276_usa_illinois_lakecounty_summergrassesandkin_v2/phleum_pratense_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p13_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884188/1276_usa_illinois_lakecounty_summergrassesandkin_v2/phleum_pratense_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p13_9.png"
    ],
    "page_number": 13
  },
  {
    "guide_id": 1276,
    "species_id": "sp_34",
    "scientific_name": "Roegneria subsecunda",
    "common_name": "Bearded Wheat Grass",
    "family": "Poaceae",
    "photo_date": "7-24-19",
    "description": "Mama’s Boy. Collect when seeds are light brown. Glumes (the bottom two scales of a spikelet) may still be green. Bearded wheat grass has longer awns at the peak of the seeds.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "roegneria_subsecunda_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p14_1.png",
      "roegneria_subsecunda_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p14_2.png",
      "roegneria_subsecunda_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p14_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884191/1276_usa_illinois_lakecounty_summergrassesandkin_v2/roegneria_subsecunda_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p14_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884192/1276_usa_illinois_lakecounty_summergrassesandkin_v2/roegneria_subsecunda_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p14_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884194/1276_usa_illinois_lakecounty_summergrassesandkin_v2/roegneria_subsecunda_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p14_3.png"
    ],
    "page_number": 14
  },
  {
    "guide_id": 1276,
    "species_id": "sp_35",
    "scientific_name": "Roegneria trachycaula",
    "common_name": "Slender Wheat Grass",
    "family": "Poaceae",
    "photo_date": "7-24-17",
    "description": "Mama’s Boy. Collect when seeds are light brown. Glumes (clamshell as the base of the spikelet) may still be green. Awns (points at the end of the seed) are short to absent.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "roegneria_trachycaula_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p14_4.png",
      "roegneria_trachycaula_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p14_5.png",
      "roegneria_trachycaula_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p14_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884196/1276_usa_illinois_lakecounty_summergrassesandkin_v2/roegneria_trachycaula_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p14_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884197/1276_usa_illinois_lakecounty_summergrassesandkin_v2/roegneria_trachycaula_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p14_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884199/1276_usa_illinois_lakecounty_summergrassesandkin_v2/roegneria_trachycaula_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p14_6.png"
    ],
    "page_number": 14
  },
  {
    "guide_id": 1276,
    "species_id": "sp_36",
    "scientific_name": "Elymus villosus",
    "common_name": "Silky Wild Rye",
    "family": "Poaceae",
    "photo_date": "8-9-18",
    "description": "Mama’s Boy. Compared to other Elymus species, this native rye has silky, hairy leaves & sheaths, shorter spikelets of seeds, and typically ripens sooner. E. virginicus is upright (like wheat), E. canadensis arcs like a long frizzy ponytail. E. riparius has hairless sheaths.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "elymus_villosus_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p15_1.png",
      "elymus_villosus_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p15_2.png",
      "elymus_villosus_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p15_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884144/1276_usa_illinois_lakecounty_summergrassesandkin_v2/elymus_villosus_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p15_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884145/1276_usa_illinois_lakecounty_summergrassesandkin_v2/elymus_villosus_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p15_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884147/1276_usa_illinois_lakecounty_summergrassesandkin_v2/elymus_villosus_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p15_3.png"
    ],
    "page_number": 15
  },
  {
    "guide_id": 1276,
    "species_id": "sp_37",
    "scientific_name": "Hystrix patula",
    "common_name": "Bottlebrush Grass",
    "family": "Poaceae",
    "photo_date": "8-16-17",
    "description": "Mama’s Boy. A staple in woodland restoration and ideal for group workdays due to the clearly unique “bottle brush” forming an X from above. Strip by hand but wear gloves; the knobs where the seeds attach can be rough if collecting a large quantity.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "hystrix_patula_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p15_4.png",
      "hystrix_patula_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p15_5.png",
      "hystrix_patula_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p15_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884163/1276_usa_illinois_lakecounty_summergrassesandkin_v2/hystrix_patula_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p15_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884165/1276_usa_illinois_lakecounty_summergrassesandkin_v2/hystrix_patula_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p15_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884166/1276_usa_illinois_lakecounty_summergrassesandkin_v2/hystrix_patula_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p15_6.png"
    ],
    "page_number": 15
  },
  {
    "guide_id": 1276,
    "species_id": "sp_38",
    "scientific_name": "Muhlenbergia tenuiflora",
    "common_name": "Slender Satin Grass",
    "family": "Poaceae",
    "photo_date": "8-30-17",
    "description": "This rare grass lives on morainic bluffs & ravines. It is well named; everything about this plant is slender and delicate. Collect when beige.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "muhlenbergia_tenuiflora_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p15_7.png",
      "muhlenbergia_tenuiflora_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p15_8.png",
      "muhlenbergia_tenuiflora_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p15_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884179/1276_usa_illinois_lakecounty_summergrassesandkin_v2/muhlenbergia_tenuiflora_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p15_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884181/1276_usa_illinois_lakecounty_summergrassesandkin_v2/muhlenbergia_tenuiflora_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p15_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766884182/1276_usa_illinois_lakecounty_summergrassesandkin_v2/muhlenbergia_tenuiflora_1276_usa_illinois_lakecounty_summergrassesandkin_v2_p15_9.png"
    ],
    "page_number": 15
  },
  {
    "guide_id": 1277,
    "species_id": "sp_1",
    "scientific_name": "Dicentra cucullaria",
    "common_name": "Dutchman’s Breeches",
    "family": "Fumariaceae",
    "photo_date": "5-18-18",
    "description": "Elaiosomes. Beaks. A very cool flower, like white puffy pants hanging upside down on a clothesline. Green capsules swell to ~1/8” wide & split when ripe, seeds are oily black. Look for an open capsule and test the remaining ones with a *gentle* squeeze. Sow seed right away.",
    "seed_group_names": [
      "Elaiosomes",
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Elaiosomes",
        "images": [
          "Elaiosomes_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_page1_img1.png"
        ],
        "description": "Elaiosomes are “ant candy” attached to the seeds. Ants are strong and motivated, able to quickly carry the candy back to their home and tossing the heavy “candy wrapper” (seeds) into their compost piles."
      },
      {
        "name": "Beaks",
        "images": [
          "Beaks_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "dicentra_cucullaria_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p3_1.png",
      "dicentra_cucullaria_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p3_2.png",
      "dicentra_cucullaria_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p3_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855253/dicentra_cucullaria_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p3_1_utwyba.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855253/dicentra_cucullaria_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p3_2_galops.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855256/dicentra_cucullaria_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p3_3_unkelb.png"
    ],
    "page_number": 3
  },
  {
    "guide_id": 1277,
    "species_id": "sp_2",
    "scientific_name": "Hepatica acutiloba",
    "common_name": "Sharp-lobed Hepatica",
    "family": "Ranunculaceae",
    "photo_date": "5-18-18",
    "description": "Shattering. The sepals cup around the hairy seeds, hidden under the leaves and pointing downhill. Seeds are ripe when they fall off with a *gentle* touch; no force is necessary. Must sow fresh and viability is often low. Hepatica are some of the earliest flowers of the year.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "hepatica_acutiloba_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p3_4.png",
      "hepatica_acutiloba_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p3_5.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855287/hepatica_acutiloba_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p3_4_idve6n.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855288/hepatica_acutiloba_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p3_5_kydyqb.png"
    ],
    "page_number": 3
  },
  {
    "guide_id": 1277,
    "species_id": "sp_3",
    "scientific_name": "Hepatica americana",
    "common_name": "Round-lobed Hepatica",
    "family": "Ranunculaceae",
    "photo_date": "5-22-18",
    "description": "Shattering. Same treatment as H. acutiloba. White or lavender flowers pop up on fuzzy stalks, over a cluster of last year’s leaves. Happiest on drier slopes, the low moisture and slow erosion reduces competition from other plants. Rare, collect 10%",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "hepatica_americana_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p3_6.png",
      "hepatica_americana_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p3_7.png",
      "hepatica_americana_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p3_8.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855292/hepatica_americana_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p3_6_gd9isk.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855294/hepatica_americana_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p3_7_ohrvpe.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855295/hepatica_americana_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p3_8_fhyiiv.png"
    ],
    "page_number": 3
  },
  {
    "guide_id": 1277,
    "species_id": "sp_4",
    "scientific_name": "Claytonia virginica",
    "common_name": "Spring Beauty",
    "family": "Portulacaceae",
    "photo_date": "5-22-18",
    "description": "Beaks. Elaiosomes. Looks like a bunch of tiny duckbills along the stem. Stem may be upright or flat on the ground. Inside the duckbills are capsules that will split open to drop out the seed. Collect when at least one of the capsules is open; the rest will open in the bag.",
    "seed_group_names": [
      "Elaiosomes",
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Elaiosomes",
        "images": [
          "Elaiosomes_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_page1_img1.png"
        ],
        "description": "Elaiosomes are “ant candy” attached to the seeds. Ants are strong and motivated, able to quickly carry the candy back to their home and tossing the heavy “candy wrapper” (seeds) into their compost piles."
      },
      {
        "name": "Beaks",
        "images": [
          "Beaks_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "claytonia_virginica_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p4_1.png",
      "claytonia_virginica_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p4_2.png",
      "claytonia_virginica_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p4_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855239/claytonia_virginica_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p4_1_hyhbry.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855239/claytonia_virginica_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p4_2_txwdsm.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855241/claytonia_virginica_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p4_3_m3ptqr.png"
    ],
    "page_number": 4
  },
  {
    "guide_id": 1277,
    "species_id": "sp_5",
    "scientific_name": "Scilla siberica",
    "common_name": "Siberian Squill",
    "family": "Hyacinthaceae",
    "photo_date": "5-29-20",
    "description": "Elaiosomes. This common blue flower pops up in lawns and escapes into woodlands. Flowers are 6 petals, occasionally white. Leaves are grass-like. Do not collect. Plant Hepatica, Mertensia, or Camassia instead.",
    "seed_group_names": [
      "Elaiosomes"
    ],
    "seed_group_details": [
      {
        "name": "Elaiosomes",
        "images": [
          "Elaiosomes_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_page1_img1.png"
        ],
        "description": "Elaiosomes are “ant candy” attached to the seeds. Ants are strong and motivated, able to quickly carry the candy back to their home and tossing the heavy “candy wrapper” (seeds) into their compost piles."
      }
    ],
    "image_filenames": [
      "scilla_siberica_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p4_4.png",
      "scilla_siberica_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p4_5.png",
      "scilla_siberica_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p4_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855348/scilla_siberica_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p4_4_iqj4y9.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855349/scilla_siberica_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p4_5_rsnjyc.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855351/scilla_siberica_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p4_6_jnvhf9.png"
    ],
    "page_number": 4
  },
  {
    "guide_id": 1277,
    "species_id": "sp_6",
    "scientific_name": "Anemone quinquefolia",
    "common_name": "Wood Anemone",
    "family": "Ranunculaceae",
    "photo_date": "5-30-19",
    "description": "Shattering. This white flower grows in rhizomatous colonies. Usually 5 petals, and. 3 – 5 leaflets. Individual plants take years to flower; typical to see more leafy plants than flowering ones. Collect when green seeds are loose, by a *gentle* touch test. Sow fresh.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "anemone_quinquefolia_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p4_7.png",
      "anemone_quinquefolia_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p4_8.png",
      "anemone_quinquefolia_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p4_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855003/anemone_quinquefolia_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p4_7_itvhtd.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855003/anemone_quinquefolia_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p4_8_doxcdv.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855004/anemone_quinquefolia_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p4_9_dzxllt.png"
    ],
    "page_number": 4
  },
  {
    "guide_id": 1277,
    "species_id": "sp_7",
    "scientific_name": "Floerkea proserpinacoides",
    "common_name": "False Mermaid",
    "family": "Limnanthaceae",
    "photo_date": "5-30-19",
    "description": "Shattering. This ephemeral plant forms delicate mats along the ground, especially in wet to mesic woodlands. Subtle blooms are easy to overlook, and the entire plant disappears by summer. Test seed ripeness with a *gentle* touch test. Collect 10%.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "floerkea_proserpinacoides_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p5_1.png",
      "floerkea_proserpinacoides_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p5_2.png",
      "floerkea_proserpinacoides_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p5_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855274/floerkea_proserpinacoides_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p5_1_bsswwh.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855274/floerkea_proserpinacoides_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p5_2_f0bjwv.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855275/floerkea_proserpinacoides_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p5_3_d6cqya.png"
    ],
    "page_number": 5
  },
  {
    "guide_id": 1277,
    "species_id": "sp_8",
    "scientific_name": "Erythronium albidum",
    "common_name": "White Trout Lily",
    "family": "Liliaceae",
    "photo_date": "6-1-18",
    "description": "Elaiosomes. Beaks. Capsules & stems usually detach and lie loose on the ground. Collect detached stems or open capsules. Seeds are honey or caramel colored when ripe. E. americanum (yellow trout lily) is less common in Lake Co.",
    "seed_group_names": [
      "Elaiosomes",
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Elaiosomes",
        "images": [
          "Elaiosomes_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_page1_img1.png"
        ],
        "description": "Elaiosomes are “ant candy” attached to the seeds. Ants are strong and motivated, able to quickly carry the candy back to their home and tossing the heavy “candy wrapper” (seeds) into their compost piles."
      },
      {
        "name": "Beaks",
        "images": [
          "Beaks_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "erythronium_albidum_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p5_4.png",
      "erythronium_albidum_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p5_5.png",
      "erythronium_albidum_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p5_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855268/erythronium_albidum_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p5_4_txqzmn.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855268/erythronium_albidum_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p5_5_hepx5c.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855269/erythronium_albidum_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p5_6_ptee03.png"
    ],
    "page_number": 5
  },
  {
    "guide_id": 1277,
    "species_id": "sp_9",
    "scientific_name": "Sanguinaria canadensis",
    "common_name": "Bloodroot",
    "family": "Papaveraceae",
    "photo_date": "6-8-18",
    "description": "Elaiosomes. The elaiosome is obvious in bloodroot, like a white gummy worm. Wear gloves to prevent the pod’s yellow sap staining your fingers. Collect open capsules. Can give swollen pods (~ ½” wide) a *gentle* squeeze to see if it pops open to reveal the wine-colored seeds.",
    "seed_group_names": [
      "Elaiosomes"
    ],
    "seed_group_details": [
      {
        "name": "Elaiosomes",
        "images": [
          "Elaiosomes_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_page1_img1.png"
        ],
        "description": "Elaiosomes are “ant candy” attached to the seeds. Ants are strong and motivated, able to quickly carry the candy back to their home and tossing the heavy “candy wrapper” (seeds) into their compost piles."
      }
    ],
    "image_filenames": [
      "sanguinaria_canadensis_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p5_7.png",
      "sanguinaria_canadensis_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p5_8.png",
      "sanguinaria_canadensis_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p5_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855342/sanguinaria_canadensis_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p5_7_ed3bge.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855343/sanguinaria_canadensis_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p5_8_ch8j0l.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855344/sanguinaria_canadensis_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p5_9_rjsl6v.png"
    ],
    "page_number": 5
  },
  {
    "guide_id": 1277,
    "species_id": "sp_10",
    "scientific_name": "Enemion biternatum",
    "common_name": "False Rue Anemone",
    "family": "Ranunculaceae",
    "photo_date": "6-3-18",
    "description": "Shattering. Beaks. Star-like clusters have an elongated point like an elf shoe. Collect when the beak opens (follicle – like a beak, but splits on one side) or the capsule is loose to the touch. Sow seed fresh. False Rue Anemone & Rue Anemone are often confusing when in flower, but the seeds are clearly different (see below).",
    "seed_group_names": [
      "Shattering",
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      },
      {
        "name": "Beaks",
        "images": [
          "Beaks_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "enemion_biternatum_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p6_1.png",
      "enemion_biternatum_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p6_2.png",
      "enemion_biternatum_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p6_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855261/enemion_biternatum_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p6_1_i0qqch.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855262/enemion_biternatum_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p6_2_eq7hy2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855263/enemion_biternatum_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p6_3_s5pygg.png"
    ],
    "page_number": 6
  },
  {
    "guide_id": 1277,
    "species_id": "sp_11",
    "scientific_name": "Anemonella thalictroides",
    "common_name": "Rue Anemone",
    "family": "Ranunculaceae",
    "photo_date": "6-15-18",
    "description": "Shattering. Thalictroides is Latin for “thalictrum-like” and this is clear in the similarity of the seeds and leaves. The leaf arrangement & plant size is clearly different: a small whorl of leaves for this ankle-high species, and bushier for the shin- to knee-high Thalictrum.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "anemonella_thalictroides_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p6_4.png",
      "anemonella_thalictroides_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p6_5.png",
      "anemonella_thalictroides_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p6_6.png",
      "anemonella_thalictroides_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p6_7.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855005/anemonella_thalictroides_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p6_4_rhmjpy.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855006/anemonella_thalictroides_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p6_5_o72xxl.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855007/anemonella_thalictroides_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p6_6_trixna.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855008/anemonella_thalictroides_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p6_7_sbxy4o.png"
    ],
    "page_number": 6
  },
  {
    "guide_id": 1277,
    "species_id": "sp_12",
    "scientific_name": "Thalictrum dioicum",
    "common_name": "Early Meadow Rue",
    "family": "Ranunculaceae",
    "photo_date": "6-24-2018",
    "description": "Shattering. Seeds are football-shaped with parallel striations. Collect when they fall off easily with a light touch – no force is necessary. Flowers are subtle and wind pollinated. Sow fresh seeds asap for best germination.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "thalictrum_dioicum_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p6_8.png",
      "thalictrum_dioicum_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p6_9.png",
      "thalictrum_dioicum_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p6_10.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855367/thalictrum_dioicum_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p6_8_vam5z8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855368/thalictrum_dioicum_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p6_9_ockz78.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855367/thalictrum_dioicum_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p6_10_qfunpu.png"
    ],
    "page_number": 6
  },
  {
    "guide_id": 1277,
    "species_id": "sp_13",
    "scientific_name": "Ranunculus abortivus",
    "common_name": "Small-flowered Buttercup",
    "family": "Ranunculaceae",
    "photo_date": "6-3-18",
    "description": "Shattering. This common buttercup is found in woodlands, wet to dry. Flowers are tiny, about ¼” across, with petals smaller than the green center disc. Lower basal leaves are kidney-shaped (most buttercups have lobed leaves). Collect when seeds are easily loosened.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "ranunculus_abortivus_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p7_1.png",
      "ranunculus_abortivus_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p7_2.png",
      "ranunculus_abortivus_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p7_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855327/ranunculus_abortivus_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p7_1_v3fooy.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855328/ranunculus_abortivus_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p7_2_m7htpc.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855331/ranunculus_abortivus_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p7_3_cdlest.png"
    ],
    "page_number": 7
  },
  {
    "guide_id": 1277,
    "species_id": "sp_14",
    "scientific_name": "Ranunculus septentrionalis",
    "common_name": "Swamp Buttercup",
    "family": "Ranunculaceae",
    "photo_date": "6-15-18",
    "description": "Shattering. The most common large-flowered buttercup found in wet to mesic woodlands. Leaves are compound, with deep lobes. Stems are hairless or sometimes fine, pressed hairs. Collect when seeds are loose.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "ranunculus_septentrionalis_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p7_4.png",
      "ranunculus_septentrionalis_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p7_5.png",
      "ranunculus_septentrionalis_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p7_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855334/ranunculus_septentrionalis_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p7_4_sjhcij.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855336/ranunculus_septentrionalis_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p7_5_zyxcnv.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855339/ranunculus_septentrionalis_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p7_6_sgroup.png"
    ],
    "page_number": 7
  },
  {
    "guide_id": 1277,
    "species_id": "sp_15",
    "scientific_name": "Geranium maculatum",
    "common_name": "Wild Geranium",
    "family": "Geraniaceae",
    "photo_date": "6-13-17",
    "description": "Ballistic. Geranium aka cranesbill looks somewhat like a bird’s long beak with 5 bumps at the bottom. These are 5 “ladles” that turn brown, then spring up to catapult the seeds away, finishing in a chandelier shape. Collect brown bills. Chandeliers no longer contain seed.",
    "seed_group_names": [
      "Ballistic"
    ],
    "seed_group_details": [
      {
        "name": "Ballistic",
        "images": [
          "Ballistic_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_page1_img1.png"
        ],
        "description": "Ballistic capsules catapult their babies away, up to 30 feet! Search YouTube for “exploding seeds” to see these in action. To harvest: learn the ripening sequence & harvest just before explosion; store in a *sealed* paper bag or mesh bag for a day or two."
      }
    ],
    "image_filenames": [
      "geranium_maculatum_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p7_7.png",
      "geranium_maculatum_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p7_8.png",
      "geranium_maculatum_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p7_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855280/geranium_maculatum_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p7_7_iijy9r.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855284/geranium_maculatum_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p7_8_sxqent.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855285/geranium_maculatum_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p7_9_bh4jfd.png"
    ],
    "page_number": 7
  },
  {
    "guide_id": 1277,
    "species_id": "sp_16",
    "scientific_name": "Dentaria laciniata",
    "common_name": "Toothwort",
    "family": "Brassicaceae",
    "photo_date": "6-15-18",
    "description": "Ballistic. Seed pods have a long and skinny shape (silique) found in many mustards (including the invasive garlic mustard). As it dries, one side peels back & curls up to send the green seeds flying. Look for an open silique, collect the rest. Pinch at base of pod to contain seeds.",
    "seed_group_names": [
      "Ballistic"
    ],
    "seed_group_details": [
      {
        "name": "Ballistic",
        "images": [
          "Ballistic_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_page1_img1.png"
        ],
        "description": "Ballistic capsules catapult their babies away, up to 30 feet! Search YouTube for “exploding seeds” to see these in action. To harvest: learn the ripening sequence & harvest just before explosion; store in a *sealed* paper bag or mesh bag for a day or two."
      }
    ],
    "image_filenames": [
      "dentaria_laciniata_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p8_1.png",
      "dentaria_laciniata_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p8_2.png",
      "dentaria_laciniata_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p8_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855247/dentaria_laciniata_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p8_1_tlscq9.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855248/dentaria_laciniata_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p8_2_o9w0jp.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855249/dentaria_laciniata_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p8_3_isgc23.png"
    ],
    "page_number": 8
  },
  {
    "guide_id": 1277,
    "species_id": "sp_17",
    "scientific_name": "Polemonium reptans",
    "common_name": "Jacob’s Ladder",
    "family": "Polemoniaceae",
    "photo_date": "6-15-18",
    "description": "Beaks. Inside the “Chinese lantern” of the calyx is a capsule that slowly turns from green to beige-yellow, and then opens to drop the seeds. Shortly before opening, capsule often becomes a little translucent and the brown-burgundy color of the seeds becomes visible. Peel back the papery lantern to check. Collect when the capsule is yellow-beige or translucent. Leaves are opposite pairs, like ladder rungs.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "polemonium_reptans_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p8_4.png",
      "polemonium_reptans_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p8_5.png",
      "polemonium_reptans_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p8_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855321/polemonium_reptans_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p8_4_w7u6vx.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855328/polemonium_reptans_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p8_5_v0l7yp.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855325/polemonium_reptans_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p8_6_dcw56h.png"
    ],
    "page_number": 8
  },
  {
    "guide_id": 1277,
    "species_id": "sp_18",
    "scientific_name": "Camassia scilloides",
    "common_name": "Wild Hyacinth",
    "family": "Hyacinthaceae",
    "photo_date": "6-23-18",
    "description": "Beaks. These lovely bulbs form a capsule that turns from green to beige-brown, and splits into 3 parts to reveal black seeds. Collect when the beaks open. Like many lily relatives, these are slow from seed. Flowers are charming 6-pointed stars, in pale blue-violet.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "camassia_scilloides_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p8_7.png",
      "camassia_scilloides_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p8_8.png",
      "camassia_scilloides_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p8_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855233/camassia_scilloides_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p8_7_wxyjkm.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855235/camassia_scilloides_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p8_8_ypop7o.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855236/camassia_scilloides_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p8_9_g61hfw.png"
    ],
    "page_number": 8
  },
  {
    "guide_id": 1277,
    "species_id": "sp_19",
    "scientific_name": "Viola labradorica",
    "common_name": "Dog Violet",
    "family": "Violaceae",
    "photo_date": "6-19-17",
    "description": "Ballistic. Elaiosomes. Pods start out nodding, then raise their heads up to the sky, split open into 3rds, and finally shoot their seeds away. Collect when heads are aimed between the horizon & the sky. Most violet species have multiple rounds of seeds: initially from open flowers (chasmogamous), but later they form flowers that never open and self-pollinate (cleistogamous) to produce additional seeds. Sow fresh.",
    "seed_group_names": [
      "Elaiosomes",
      "Ballistic"
    ],
    "seed_group_details": [
      {
        "name": "Elaiosomes",
        "images": [
          "Elaiosomes_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_page1_img1.png"
        ],
        "description": "Elaiosomes are “ant candy” attached to the seeds. Ants are strong and motivated, able to quickly carry the candy back to their home and tossing the heavy “candy wrapper” (seeds) into their compost piles."
      },
      {
        "name": "Ballistic",
        "images": [
          "Ballistic_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_page1_img1.png"
        ],
        "description": "Ballistic capsules catapult their babies away, up to 30 feet! Search YouTube for “exploding seeds” to see these in action. To harvest: learn the ripening sequence & harvest just before explosion; store in a *sealed* paper bag or mesh bag for a day or two."
      }
    ],
    "image_filenames": [
      "viola_labradorica_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p9_1.png",
      "viola_labradorica_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p9_2.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855394/viola_labradorica_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p9_1_odagaa.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855395/viola_labradorica_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p9_2_yubqgc.png"
    ],
    "page_number": 9
  },
  {
    "guide_id": 1277,
    "species_id": "sp_20",
    "scientific_name": "Viola pubescens var. scabriuscula",
    "common_name": "Smooth Yellow Violet",
    "family": "Violaceae",
    "photo_date": "6-23-18",
    "description": "Ballistic. For sessile (stemless) pods, check with a *gentle* squeeze or look for split capsules. Capsules will ripen at slightly different times, on the same plant. Common in mesic to dry-mesic woodlands, although usually scattered in small populations.",
    "seed_group_names": [
      "Ballistic"
    ],
    "seed_group_details": [
      {
        "name": "Ballistic",
        "images": [
          "Ballistic_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_page1_img1.png"
        ],
        "description": "Ballistic capsules catapult their babies away, up to 30 feet! Search YouTube for “exploding seeds” to see these in action. To harvest: learn the ripening sequence & harvest just before explosion; store in a *sealed* paper bag or mesh bag for a day or two."
      }
    ],
    "image_filenames": [
      "viola_pubescens_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p9_3.png",
      "viola_pubescens_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p9_4.png",
      "viola_pubescens_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p9_5.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855400/viola_pubescens_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p9_3_emdi6q.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855401/viola_pubescens_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p9_4_qllwfu.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855402/viola_pubescens_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p9_5_qbublk.png"
    ],
    "page_number": 9
  },
  {
    "guide_id": 1277,
    "species_id": "sp_21",
    "scientific_name": "Aquilegia canadensis",
    "common_name": "Wild Columbine",
    "family": "Ranunculaceae",
    "photo_date": "6-24-17",
    "description": "Beaks. The follicles (seed capsules) look somewhat like the flower, but upside down. Collect when beaks open to reveal the oil-black seeds. Follicles will turn colors too, but the open beak is more important. Flowers are a bold red and yellow. Short-lived perennial.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "aquilegia_canadensis_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p9_6.png",
      "aquilegia_canadensis_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p9_7.png",
      "aquilegia_canadensis_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p9_8.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855010/aquilegia_canadensis_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p9_6_bjnvkl.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855012/aquilegia_canadensis_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p9_7_ojens1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855013/aquilegia_canadensis_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p9_8_hsbjbi.png"
    ],
    "page_number": 9
  },
  {
    "guide_id": 1277,
    "species_id": "sp_22",
    "scientific_name": "Asarum canadense var. reflexum",
    "common_name": "Reflexed Wild Ginger",
    "family": "Aristolochiaceae",
    "photo_date": "6-24-18",
    "description": "Elaiosomes. The spade-shaped leaves make a lovely native groundcover. Burgundy flowers are hidden under the leaves, right on top of the soil. Capsules degrade into a mealy mess; collect when soft & mushy. Plants also divide & transplant easily.",
    "seed_group_names": [
      "Elaiosomes"
    ],
    "seed_group_details": [
      {
        "name": "Elaiosomes",
        "images": [
          "Elaiosomes_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_page1_img1.png"
        ],
        "description": "Elaiosomes are “ant candy” attached to the seeds. Ants are strong and motivated, able to quickly carry the candy back to their home and tossing the heavy “candy wrapper” (seeds) into their compost piles."
      }
    ],
    "image_filenames": [
      "asarum_canadense_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p10_1.png",
      "asarum_canadense_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p10_2.png",
      "asarum_canadense_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p10_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855014/asarum_canadense_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p10_1_pqsugv.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855016/asarum_canadense_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p10_2_ajzufc.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855017/asarum_canadense_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p10_3_tcaeek.png"
    ],
    "page_number": 10
  },
  {
    "guide_id": 1277,
    "species_id": "sp_23",
    "scientific_name": "Jeffersonia diphylla",
    "common_name": "Twinleaf",
    "family": "Berberidaceae",
    "photo_date": "6-24-18",
    "description": "Elaiosomes. Beaks. Pods are green & upright, then turn green-yellow and tilt toward the ground right before opening to spill the seeds out. Look for tilted pods; collect open capsules, or any that pop under *gentle* pressure. Entire population may ripen & drop in only a few days.",
    "seed_group_names": [
      "Elaiosomes",
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Elaiosomes",
        "images": [
          "Elaiosomes_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_page1_img1.png"
        ],
        "description": "Elaiosomes are “ant candy” attached to the seeds. Ants are strong and motivated, able to quickly carry the candy back to their home and tossing the heavy “candy wrapper” (seeds) into their compost piles."
      },
      {
        "name": "Beaks",
        "images": [
          "Beaks_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "jeffersonia_diphylla_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p10_4.png",
      "jeffersonia_diphylla_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p10_5.png",
      "jeffersonia_diphylla_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p10_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855300/jeffersonia_diphylla_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p10_4_qrahw9.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855301/jeffersonia_diphylla_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p10_5_ene0y8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855303/jeffersonia_diphylla_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p10_6_ujfvdn.png"
    ],
    "page_number": 10
  },
  {
    "guide_id": 1277,
    "species_id": "sp_24",
    "scientific_name": "Phlox divaricata",
    "common_name": "Woodland Phlox",
    "family": "Polemoniaceae",
    "photo_date": "6-24-17",
    "description": "Ballistic. The blue-purple petals drop, revealing hard capsules tucked in the center of the 5 sepals. Capsules swell & turn green-beige, before splitting into 3 pieces & shooting the dark seeds away. Sepals often reflex (peel backwards) like a star shortly before catapulting. After flowers start to fade, cover with mesh hoods to capture seeds",
    "seed_group_names": [
      "Ballistic"
    ],
    "seed_group_details": [
      {
        "name": "Ballistic",
        "images": [
          "Ballistic_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_page1_img1.png"
        ],
        "description": "Ballistic capsules catapult their babies away, up to 30 feet! Search YouTube for “exploding seeds” to see these in action. To harvest: learn the ripening sequence & harvest just before explosion; store in a *sealed* paper bag or mesh bag for a day or two."
      }
    ],
    "image_filenames": [
      "phlox_divaricata_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p10_7.png",
      "phlox_divaricata_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p10_8.png",
      "phlox_divaricata_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p10_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855314/phlox_divaricata_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p10_7_km2pic.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855316/phlox_divaricata_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p10_8_dcdkgb.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855319/phlox_divaricata_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p10_9_ic3bpq.png"
    ],
    "page_number": 10
  },
  {
    "guide_id": 1277,
    "species_id": "sp_25",
    "scientific_name": "Silene virginica",
    "common_name": "Fire Pink",
    "family": "Caryophyllaceae",
    "photo_date": "6-24-17",
    "description": "Beaks. This rare plant has fiery red petals, notched at the tips. The peak of the sticky beak will split open and the brown seeds will easily spill into your hand. Short-lived perennial.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "silene_virginica_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p11_1.png",
      "silene_virginica_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p11_2.png",
      "silene_virginica_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p11_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855358/silene_virginica_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p11_1_jhmfl9.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855361/silene_virginica_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p11_2_iahfxw.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855362/silene_virginica_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p11_3_vuswhz.png"
    ],
    "page_number": 11
  },
  {
    "guide_id": 1277,
    "species_id": "sp_26",
    "scientific_name": "Moehringia lateriflora",
    "common_name": "Wood Sandwort",
    "family": "Caryophyllaceae",
    "photo_date": "6-28-19",
    "description": "Elaiosomes. Beaks. This white wildflower adds little pops of flowers, around ankle high. Found in wet to dry-mesic woodlands and wet to mesic sand prairies. Collect open capsules, sow seed promptly.",
    "seed_group_names": [
      "Elaiosomes",
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Elaiosomes",
        "images": [
          "Elaiosomes_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_page1_img1.png"
        ],
        "description": "Elaiosomes are “ant candy” attached to the seeds. Ants are strong and motivated, able to quickly carry the candy back to their home and tossing the heavy “candy wrapper” (seeds) into their compost piles."
      },
      {
        "name": "Beaks",
        "images": [
          "Beaks_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "moehringia_lateriflora_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p11_4.png",
      "moehringia_lateriflora_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p11_5.png",
      "moehringia_lateriflora_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p11_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855307/moehringia_lateriflora_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p11_4_zxdtxk.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855308/moehringia_lateriflora_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p11_5_alsjug.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855313/moehringia_lateriflora_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p11_6_ugjfis.png"
    ],
    "page_number": 11
  },
  {
    "guide_id": 1277,
    "species_id": "sp_27",
    "scientific_name": "Uvularia grandiflora",
    "common_name": "Bellwort",
    "family": "Colchicaceae",
    "photo_date": "6-29-18",
    "description": "Elaiosomes. Beaks. Cheery yellow flowers. Leaves are perfoliate (leaves surround the stem). Capsule splits into 3 parts (typical of lily relatives). Caramel colored seeds. Insects often chew into the capsules. Collect once the capsules have opened. Happiest on gravelly slopes.",
    "seed_group_names": [
      "Elaiosomes",
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Elaiosomes",
        "images": [
          "Elaiosomes_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_page1_img1.png"
        ],
        "description": "Elaiosomes are “ant candy” attached to the seeds. Ants are strong and motivated, able to quickly carry the candy back to their home and tossing the heavy “candy wrapper” (seeds) into their compost piles."
      },
      {
        "name": "Beaks",
        "images": [
          "Beaks_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "uvularia_grandiflora_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p11_7.png",
      "uvularia_grandiflora_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p11_8.png",
      "uvularia_grandiflora_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p11_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855388/uvularia_grandiflora_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p11_7_phchga.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855388/uvularia_grandiflora_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p11_8_hzuyky.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855390/uvularia_grandiflora_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p11_9_k9qey5.png"
    ],
    "page_number": 11
  },
  {
    "guide_id": 1277,
    "species_id": "sp_28",
    "scientific_name": "Trillium grandiflorum",
    "common_name": "Large-flowered Trillium",
    "family": "Trilliaceae",
    "photo_date": "7-16-18",
    "description": "Elaiosomes. Three bright white petals that fade to pink with age. Three leaves of solid green. Trillium capsules are ripe when their color fades to yellow-green/off-white & they easily pop off the stem. Sow fresh, takes 2 years to germinate.",
    "seed_group_names": [
      "Elaiosomes"
    ],
    "seed_group_details": [
      {
        "name": "Elaiosomes",
        "images": [
          "Elaiosomes_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_page1_img1.png"
        ],
        "description": "Elaiosomes are “ant candy” attached to the seeds. Ants are strong and motivated, able to quickly carry the candy back to their home and tossing the heavy “candy wrapper” (seeds) into their compost piles."
      }
    ],
    "image_filenames": [
      "trillium_grandiflorum_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p12_1.png",
      "trillium_grandiflorum_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p12_2.png",
      "trillium_grandiflorum_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p12_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855373/trillium_grandiflorum_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p12_1_psmlax.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855374/trillium_grandiflorum_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p12_2_tb7hl2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855376/trillium_grandiflorum_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p12_3_xsuzz8.png"
    ],
    "page_number": 12
  },
  {
    "guide_id": 1277,
    "species_id": "sp_29",
    "scientific_name": "Trillium recurvatum",
    "common_name": "Prairie Trillium",
    "family": "Trilliaceae",
    "photo_date": "7-23-18",
    "description": "Elaiosomes. Flowers are maroon-red petals around black anthers. Leaves are mottled shades of green. Common in woodlands & savannas; finding these in prairies typically indicates a historic woodland. Trillium capsules start to degrade when ripe, but not as mushy as wild ginger.",
    "seed_group_names": [
      "Elaiosomes"
    ],
    "seed_group_details": [
      {
        "name": "Elaiosomes",
        "images": [
          "Elaiosomes_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_page1_img1.png"
        ],
        "description": "Elaiosomes are “ant candy” attached to the seeds. Ants are strong and motivated, able to quickly carry the candy back to their home and tossing the heavy “candy wrapper” (seeds) into their compost piles."
      }
    ],
    "image_filenames": [
      "trillium_recurvatum_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p12_4.png",
      "trillium_recurvatum_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p12_5.png",
      "trillium_recurvatum_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p12_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855379/trillium_recurvatum_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p12_4_fj8l5g.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855382/trillium_recurvatum_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p12_5_gdchlf.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766855383/trillium_recurvatum_1277_usa_illinois_lakecounty_springwoodlandforbsv2_0_p12_6_wqgh38.png"
    ],
    "page_number": 12
  },
  {
    "guide_id": 1278,
    "species_id": "sp_2",
    "scientific_name": "Triosteum aurantiacum var. illinoense",
    "common_name": "Illinois Horse Gentian",
    "family": "Caprifoliaceae",
    "photo_date": "10-11-18",
    "description": "Berries. Very similar to T. aurantiacum. This variety has “longer” stem hairs (greater than 1.5mm) and the hairs do not have glands. Poor from seed. All of our Triosteum species are found in savannas and open woodlands.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "triosteum_aurantiacum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p3_4.png",
      "triosteum_aurantiacum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p3_5.png",
      "triosteum_aurantiacum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p3_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891967/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/triosteum_aurantiacum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p3_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891968/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/triosteum_aurantiacum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p3_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891969/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/triosteum_aurantiacum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p3_6.png"
    ],
    "page_number": 3
  },
  {
    "guide_id": 1278,
    "species_id": "sp_3",
    "scientific_name": "Triosteum perfoliatum",
    "common_name": "Late Horse Gentian",
    "family": "Caprifoliaceae",
    "photo_date": "8-22-18",
    "description": "Berries. This species is easily ID’d by the perfoliate leaves (stem perforates the leaves). T. aurantiacum can have some skinny leaf tissue surrounding the stem, but T. perfoliatum typically has more than 1” around the stem. Fruit is bright orange to orange-red. Poor from seed.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "triosteum_perfoliatum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p3_7.png",
      "triosteum_perfoliatum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p3_8.png",
      "triosteum_perfoliatum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p3_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891970/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/triosteum_perfoliatum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p3_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891970/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/triosteum_perfoliatum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p3_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891971/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/triosteum_perfoliatum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p3_9.png"
    ],
    "page_number": 3
  },
  {
    "guide_id": 1278,
    "species_id": "sp_4",
    "scientific_name": "Lactuca biennis",
    "common_name": "Blue Lettuce",
    "family": "Asteraceae",
    "photo_date": "9-2-17",
    "description": "Fluffy. Lactuca species have thin milky sap, like dandelions. The flowers of this species are blue, yellow, or white. Pappus (seed fluff) is “sordid” meaning a dirty off-white. Leaves are lobed, and the midvein can be smooth or hairy, but not prickly. Open woodlands & savannas.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "lactuca_biennis_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p4_1.png",
      "lactuca_biennis_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p4_2.png",
      "lactuca_biennis_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p4_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891918/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/lactuca_biennis_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p4_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891918/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/lactuca_biennis_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p4_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891919/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/lactuca_biennis_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p4_3.png"
    ],
    "page_number": 4
  },
  {
    "guide_id": 1278,
    "species_id": "sp_5",
    "scientific_name": "Lactuca floridana",
    "common_name": "Wood Lettuce",
    "family": "Asteraceae",
    "photo_date": "9-15-18",
    "description": "Fluffy. The pappus (seed hairs) are sessile (attached directly to the seed, without a stalk). Fluff is white. Purple-tipped green scaly bracts directly behind each flower are usually shorter than 15 mm. Woodlands, savannas, and remnant wetlands.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "lactuca_floridana_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p4_4.png",
      "lactuca_floridana_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p4_5.png",
      "lactuca_floridana_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p4_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891922/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/lactuca_floridana_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p4_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891923/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/lactuca_floridana_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p4_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891923/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/lactuca_floridana_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p4_6.png"
    ],
    "page_number": 4
  },
  {
    "guide_id": 1278,
    "species_id": "sp_6",
    "scientific_name": "Lactuca canadensis",
    "common_name": "Wild Lettuce",
    "family": "Asteraceae",
    "photo_date": "9-24-19",
    "description": "Fluffy. Pappus is white, but separated from the seed by a stalk. Green scaly bracts behind each flower are usually shorter than 15 mm. Stems are green, plant is often more than 1m tall. Seeds are elliptical-shaped, usually with 1 clear nerve (line), but definitely less than 4 nerves. A weedy species that will grow just about anywhere.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "lactuca_canadensis_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p4_7.png",
      "lactuca_canadensis_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p4_8.png",
      "lactuca_canadensis_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p4_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891919/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/lactuca_canadensis_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p4_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891920/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/lactuca_canadensis_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p4_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891921/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/lactuca_canadensis_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p4_9.png"
    ],
    "page_number": 4
  },
  {
    "guide_id": 1278,
    "species_id": "sp_7",
    "scientific_name": "Sanicula odorata",
    "common_name": "Clustered Black Snakeroot",
    "family": "Apiaceae",
    "photo_date": "9-7-18",
    "description": "Hitchhikers. Mama’s Boy. Sanicula species require detailed examination to ID. This one has a style that recurves out beyond the hooked bristles. Calyx lobes of staminate flowers (the greenery behind the male flowers) are a blunt triangle shape (deltate). Leaves are typically grouped 3-5. The Latin name references a strong smell, but it seems the only odor is a faint fragrance from the flowers.",
    "seed_group_names": [
      "Hitchhikers"
    ],
    "seed_group_details": [
      {
        "name": "Hitchhikers",
        "images": [
          "Hitchhikers_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Hitchhikers are easy to tell when ripe – they hitch a ride on your pants! Color can be an indicator, but not always. Do Not Collect."
      }
    ],
    "image_filenames": [
      "sanicula_odorata_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p5_1.png",
      "sanicula_odorata_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p5_2.png",
      "sanicula_odorata_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p5_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891950/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/sanicula_odorata_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p5_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891951/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/sanicula_odorata_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p5_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891952/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/sanicula_odorata_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p5_3.png"
    ],
    "page_number": 5
  },
  {
    "guide_id": 1278,
    "species_id": "sp_8",
    "scientific_name": "Sanicula marilandica",
    "common_name": "Black Snakeroot",
    "family": "Apiaceae",
    "photo_date": "9-3-20",
    "description": "Hitchhikers. Like S. odorata, this snakeroot has styles that curve beyond the bristles. Calyx lobes of this species are skinnier, acutely pointed and typically a little more than 1 mm long; staminate flowers clearly stand out beyond the bristly fruits, like fireworks.",
    "seed_group_names": [
      "Hitchhikers"
    ],
    "seed_group_details": [
      {
        "name": "Hitchhikers",
        "images": [
          "Hitchhikers_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Hitchhikers are easy to tell when ripe – they hitch a ride on your pants! Color can be an indicator, but not always. Do Not Collect."
      }
    ],
    "image_filenames": [
      "sanicula_marilandica_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p5_4.png",
      "sanicula_marilandica_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p5_5.png",
      "sanicula_marilandica_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p5_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891948/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/sanicula_marilandica_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p5_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891949/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/sanicula_marilandica_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p5_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891949/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/sanicula_marilandica_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p5_6.png"
    ],
    "page_number": 5
  },
  {
    "guide_id": 1278,
    "species_id": "sp_9",
    "scientific_name": "Sanicula canadensis",
    "common_name": "Canadian Black Snakeroot",
    "family": "Apiaceae",
    "photo_date": "9-15-18",
    "description": "Hitchhikers. Mama’s Boy. This species has a short style hiding in the hooked bristles. Staminate calyx lobes are spikey. Leaves are in 3s, or deeply cleft to look like 5. Several genera have “snakeroots” that supposedly cured snake bites, but we recommend seeing a doctor instead.",
    "seed_group_names": [
      "Hitchhikers"
    ],
    "seed_group_details": [
      {
        "name": "Hitchhikers",
        "images": [
          "Hitchhikers_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Hitchhikers are easy to tell when ripe – they hitch a ride on your pants! Color can be an indicator, but not always. Do Not Collect."
      }
    ],
    "image_filenames": [
      "sanicula_canadensis_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p5_7.png",
      "sanicula_canadensis_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p5_8.png",
      "sanicula_canadensis_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p5_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891946/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/sanicula_canadensis_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p5_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891946/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/sanicula_canadensis_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p5_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891947/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/sanicula_canadensis_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p5_9.png"
    ],
    "page_number": 5
  },
  {
    "guide_id": 1278,
    "species_id": "sp_10",
    "scientific_name": "Ageratina altissima",
    "common_name": "White Snakeroot",
    "family": "Asteraceae",
    "photo_date": "9-20-17",
    "description": "Fluffy. A completely unrelated snakeroot. Grows abundantly in disturbed woodlands but gives way to conservative species over time. Collect when poofy. This species is notorious for killing Abe Lincoln’s mother; don’t let your milking cows eat this plant.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "ageratina_altissima_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p6_1.png",
      "ageratina_altissima_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p6_2.png",
      "ageratina_altissima_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p6_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891852/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/ageratina_altissima_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p6_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891853/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/ageratina_altissima_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p6_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891854/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/ageratina_altissima_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p6_3.png"
    ],
    "page_number": 6
  },
  {
    "guide_id": 1278,
    "species_id": "sp_11",
    "scientific_name": "Hackelia virginiana",
    "common_name": "Stickseed",
    "family": "Boraginaceae",
    "photo_date": "9-4-18",
    "description": "Hitchhikers. Native, but that’s about the only good thing you can say about this species. Ubiquitous and bothersome, the hardest hitchhiker to remove from socks and worse after laundering. Leaves are large & almond-shaped with a rough matte texture. Disturbed & rich woodlands.",
    "seed_group_names": [
      "Hitchhikers"
    ],
    "seed_group_details": [
      {
        "name": "Hitchhikers",
        "images": [
          "Hitchhikers_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Hitchhikers are easy to tell when ripe – they hitch a ride on your pants! Color can be an indicator, but not always. Do Not Collect."
      }
    ],
    "image_filenames": [
      "hackelia_virginiana_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p6_4.png",
      "hackelia_virginiana_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p6_5.png",
      "hackelia_virginiana_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p6_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891897/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/hackelia_virginiana_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p6_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891898/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/hackelia_virginiana_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p6_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891899/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/hackelia_virginiana_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p6_6.png"
    ],
    "page_number": 6
  },
  {
    "guide_id": 1278,
    "species_id": "sp_12",
    "scientific_name": "Torilis japonica",
    "common_name": "Japanese Hedge Parsley",
    "family": "Apiaceae",
    "photo_date": "9-5-20",
    "description": "Hitchhikers. This weed is now popping up in most woodlands in the county. Leaves are deeply divided and lacy. Tiny white flowers in umbels, similar to Queen Anne’s lace and many other carrot relatives. Seeds are clusters of bristly burs, easily spreading into new places. Annual, sometimes biennial. Easy to pull.",
    "seed_group_names": [
      "Hitchhikers"
    ],
    "seed_group_details": [
      {
        "name": "Hitchhikers",
        "images": [
          "Hitchhikers_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Hitchhikers are easy to tell when ripe – they hitch a ride on your pants! Color can be an indicator, but not always. Do Not Collect."
      }
    ],
    "image_filenames": [
      "torilis_japonica_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p6_7.png",
      "torilis_japonica_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p6_8.png",
      "torilis_japonica_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p6_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891964/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/torilis_japonica_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p6_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891965/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/torilis_japonica_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p6_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891965/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/torilis_japonica_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p6_9.png"
    ],
    "page_number": 6
  },
  {
    "guide_id": 1278,
    "species_id": "sp_13",
    "scientific_name": "Asclepias exaltata",
    "common_name": "Poke Milkweed",
    "family": "Asclepiadaceae",
    "photo_date": "9-5-20",
    "description": "Milkweed. This uncommon milkweed has two-tone flowers: white hoods in the center & reflexed green lobes. Our most shade-tolerant milkweed, in open woodlands & savannas, mesic and well-draining soils. Large leaves, similar to A. purpurascens, lighter underneath. Hairless or nearly so. Pods are slender, similar to A. tuberosa, but elongated (and major habitat difference). Tiny hairs on the pod.",
    "seed_group_names": [
      "Milkweed"
    ],
    "seed_group_details": [
      {
        "name": "Milkweed",
        "images": [
          "Milkweed_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Milkweed seeds are ripe when pods are split open & seeds are brown."
      }
    ],
    "image_filenames": [
      "asclepias_exaltata_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p7_1.png",
      "asclepias_exaltata_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p7_2.png",
      "asclepias_exaltata_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p7_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891871/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/asclepias_exaltata_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p7_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891872/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/asclepias_exaltata_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p7_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891873/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/asclepias_exaltata_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p7_3.png"
    ],
    "page_number": 7
  },
  {
    "guide_id": 1278,
    "species_id": "sp_14",
    "scientific_name": "Asclepias purpurascens",
    "common_name": "Purple Milkweed",
    "family": "Asclepiadaceae",
    "photo_date": "10-1-20",
    "description": "Milkweed. Another uncommon milkweed, blooming in a bold magenta-purple, or paler mauve-purple. Pods are plump, although not quite as rotund as the common A. syriaca, and with tiny hairs. Large leaves are green on both sides, tiny hairs underneath. Savannas and prairies.",
    "seed_group_names": [
      "Milkweed"
    ],
    "seed_group_details": [
      {
        "name": "Milkweed",
        "images": [
          "Milkweed_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Milkweed seeds are ripe when pods are split open & seeds are brown."
      }
    ],
    "image_filenames": [
      "asclepias_purpurascens_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p7_4.png",
      "asclepias_purpurascens_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p7_5.png",
      "asclepias_purpurascens_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p7_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891873/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/asclepias_purpurascens_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p7_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891874/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/asclepias_purpurascens_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p7_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891876/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/asclepias_purpurascens_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p7_6.png"
    ],
    "page_number": 7
  },
  {
    "guide_id": 1278,
    "species_id": "sp_15",
    "scientific_name": "Arisaema triphyllum",
    "common_name": "Jack-in-the-Pulpit",
    "family": "Araceae",
    "photo_date": "9-7-18",
    "description": "Berries. Mama’s Boy. Best known for the 3 leaflets & namesake flower, but leaves are often gone by harvest. The aggregate fruits resemble a tomato-red raspberry on steroids. Seeds are tough to ID from its sister, A. dracontium. Jack is more common, growing in mesic and moist woods. Green dragon grows in moist to wet woods. The juice can reportedly cause skin & stomach irritation; wear gloves to process.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "arisaema_triphyllum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p7_7.png",
      "arisaema_triphyllum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p7_8.png",
      "arisaema_triphyllum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p7_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891869/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/arisaema_triphyllum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p7_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891869/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/arisaema_triphyllum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p7_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891870/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/arisaema_triphyllum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p7_9.png"
    ],
    "page_number": 7
  },
  {
    "guide_id": 1278,
    "species_id": "sp_16",
    "scientific_name": "Hylodesmum glutinosum",
    "common_name": "Pointed Ticktrefoil",
    "family": "Fabaceae",
    "photo_date": "9-7-18",
    "description": "Hitchhikers. Mama’s Boy. This species strongly prefers rocky well-draining soils in Lake Co, but can be found in mesic and wet-mesic soils. Leaves are broader than its sisters. Individual seeds (“articles”) on the legume seed chain (“loments”) are lopsided half-moons. Collect when plump “ticks” stick to your clothes; good germination whether the seeds are green, brown, or in-between. Easy to remove from pants.",
    "seed_group_names": [
      "Hitchhikers"
    ],
    "seed_group_details": [
      {
        "name": "Hitchhikers",
        "images": [
          "Hitchhikers_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Hitchhikers are easy to tell when ripe – they hitch a ride on your pants! Color can be an indicator, but not always. Do Not Collect."
      }
    ],
    "image_filenames": [
      "hylodesmum_glutinosum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p8_1.png",
      "hylodesmum_glutinosum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p8_2.png",
      "hylodesmum_glutinosum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p8_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891910/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/hylodesmum_glutinosum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p8_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891911/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/hylodesmum_glutinosum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p8_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891911/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/hylodesmum_glutinosum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p8_3.png"
    ],
    "page_number": 8
  },
  {
    "guide_id": 1278,
    "species_id": "sp_17",
    "scientific_name": "Desmodium paniculatum",
    "common_name": "Panicled Ticktrefoil",
    "family": "Fabaceae",
    "photo_date": "10-3-17, 9-7-19",
    "description": "Hitchhikers. Mama’s Boy. This woodland ticktrefoil has elongated leaves, the longest 3x longer than wide, and less than 2.5 cm wide. Thin, sparse hairs on the veins & leaf face (“laminae”). Individual “ticks” are triangular, up to 9 mm long, and more than half as wide as long.",
    "seed_group_names": [
      "Hitchhikers"
    ],
    "seed_group_details": [
      {
        "name": "Hitchhikers",
        "images": [
          "Hitchhikers_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Hitchhikers are easy to tell when ripe – they hitch a ride on your pants! Color can be an indicator, but not always. Do Not Collect."
      }
    ],
    "image_filenames": [
      "desmodium_paniculatum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p8_4.png",
      "desmodium_paniculatum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p8_5.png",
      "desmodium_paniculatum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p8_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891888/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/desmodium_paniculatum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p8_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891888/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/desmodium_paniculatum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p8_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891889/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/desmodium_paniculatum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p8_6.png"
    ],
    "page_number": 8
  },
  {
    "guide_id": 1278,
    "species_id": "sp_18",
    "scientific_name": "Desmodium perplexum",
    "common_name": "Take-another-look Ticktrefoil",
    "family": "Fabaceae",
    "photo_date": "9-25-19",
    "description": "Hitchhikers. Mama’s Boy. Grows alongside D. paniculatum, inspiring the name perplexum. Individual “ticks” are similar to the previous: also triangular, up to 9 mm long, and more than half as wide as long. Widest leaves are wider than 2 cm and/or less than 3x long as wide. Stems have straight, spreading hairs; often some shorter, bent hairs mixed in too. Collect when “ticks” start hitchhiking on your pants.",
    "seed_group_names": [
      "Hitchhikers"
    ],
    "seed_group_details": [
      {
        "name": "Hitchhikers",
        "images": [
          "Hitchhikers_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Hitchhikers are easy to tell when ripe – they hitch a ride on your pants! Color can be an indicator, but not always. Do Not Collect."
      }
    ],
    "image_filenames": [
      "desmodium_perplexum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p8_7.png",
      "desmodium_perplexum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p8_8.png",
      "desmodium_perplexum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p8_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891890/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/desmodium_perplexum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p8_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891891/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/desmodium_perplexum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p8_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891893/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/desmodium_perplexum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p8_9.png"
    ],
    "page_number": 8
  },
  {
    "guide_id": 1278,
    "species_id": "sp_19",
    "scientific_name": "Campanulastrum americanum",
    "common_name": "Tall Bellflower",
    "family": "Campanulaceae",
    "photo_date": "9-10-17",
    "description": "Shakers. Mama’s Boy. This is one of our few native annuals, with lovely periwinkle-purple flowers. Green capsules form, turn beige, and then pores open to shake out the tiny seeds. Collect when open pores are visible. As with all annuals, collect only 10%.",
    "seed_group_names": [
      "Shakers"
    ],
    "seed_group_details": [
      {
        "name": "Shakers",
        "images": [
          "Shakers_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Shakers drop seeds very close to the mother plant, when shaken loose by the wind or a passing critter. Usually a Mama’s Boy, unless strong weather occurs."
      }
    ],
    "image_filenames": [
      "campanulastrum_americanum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p9_1.png",
      "campanulastrum_americanum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p9_2.png",
      "campanulastrum_americanum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p9_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891879/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/campanulastrum_americanum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p9_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891880/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/campanulastrum_americanum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p9_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891881/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/campanulastrum_americanum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p9_3.png"
    ],
    "page_number": 9
  },
  {
    "guide_id": 1278,
    "species_id": "sp_20",
    "scientific_name": "Apocynum androsaemifolium",
    "common_name": "Spreading Dogbane",
    "family": "Apocynaceae",
    "photo_date": "9-14-20",
    "description": "Fluffy. These fluffy seeds form inside skinny follicles, similar to milkweeds. This dogbane grows in savannas and open woodlands, with spreading branches and leaves spreading out horizontally or drooping. Flowers are pink, often with candy striping. Leaves are on petioles more than 3 mm long. Consult Flora for hybrids and varieties, Apocynum can be tricky to ID. Collect open follicles (seed pods).",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "apocynum_androsaemifolium_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p9_4.png",
      "apocynum_androsaemifolium_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p9_5.png",
      "apocynum_androsaemifolium_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p9_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891866/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/apocynum_androsaemifolium_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p9_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891867/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/apocynum_androsaemifolium_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p9_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891868/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/apocynum_androsaemifolium_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p9_6.png"
    ],
    "page_number": 9
  },
  {
    "guide_id": 1278,
    "species_id": "sp_21",
    "scientific_name": "Teucrium canadense",
    "common_name": "Canadian Germander",
    "family": "Lamiaceae",
    "photo_date": "9-12-17",
    "description": "Shakers. Mama’s Boy. This species is a mint-relation with square stems, irregular pale pink-purple flowers, and seeds forming in the calyx cups. Up to 4 rusty seeds per cup. Watch seed color & snip stalks; the cup color is unimportant. Var. occidentale has spreading hairs.",
    "seed_group_names": [
      "Shakers"
    ],
    "seed_group_details": [
      {
        "name": "Shakers",
        "images": [
          "Shakers_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Shakers drop seeds very close to the mother plant, when shaken loose by the wind or a passing critter. Usually a Mama’s Boy, unless strong weather occurs."
      }
    ],
    "image_filenames": [
      "teucrium_canadense_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p9_7.png",
      "teucrium_canadense_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p9_8.png",
      "teucrium_canadense_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p9_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891961/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/teucrium_canadense_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p9_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891961/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/teucrium_canadense_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p9_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891962/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/teucrium_canadense_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p9_9.png"
    ],
    "page_number": 9
  },
  {
    "guide_id": 1278,
    "species_id": "sp_22",
    "scientific_name": "Helianthus tuberosus",
    "common_name": "Jerusalem Artichoke",
    "family": "Asteraceae",
    "photo_date": "9-11-19",
    "description": "Coneheads. Composite flowers, such as sunflowers, may have fertile ray florets (the “petals”), disk florets (the “eye”), or both. Helianthus species have fertile disks only, so the seeds are throughout the center of the head. Birds like to eat seeds of sunflower-relations; collect promptly. Break open the head to see if seeds are dark, then snip heads. Once heads are completely brown, many of the seeds are gone.",
    "seed_group_names": [
      "Coneheads"
    ],
    "seed_group_details": [
      {
        "name": "Coneheads",
        "images": [
          "Coneheads_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Coneheads are flowers with a cone-shaped center. Imagine these flowers without their colorful parts, and you know exactly what they look like when seeds are ripe."
      }
    ],
    "image_filenames": [
      "helianthus_tuberosus_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p10_1.png",
      "helianthus_tuberosus_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p10_2.png",
      "helianthus_tuberosus_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p10_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891904/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/helianthus_tuberosus_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p10_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891905/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/helianthus_tuberosus_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p10_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891906/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/helianthus_tuberosus_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p10_3.png"
    ],
    "page_number": 10
  },
  {
    "guide_id": 1278,
    "species_id": "sp_23",
    "scientific_name": "Helianthus divaricatus",
    "common_name": "Woodland Sunflower",
    "family": "Asteraceae",
    "photo_date": "9-16-19",
    "description": "Coneheads. Same guidance as for H. tuberosus. Most native Helianthus are prone to weedy behavior, so sow them thoughtfully. Sure beats buckthorn and provides food for butterflies & birds, but not advised for delicate woodlands. This species has hairless stems and leaves are sessile or have tiny petioles (less than 0.7cm). Lateral veins in the leaves immediately split from central vein (less than 1 mm from petiole).",
    "seed_group_names": [
      "Coneheads"
    ],
    "seed_group_details": [
      {
        "name": "Coneheads",
        "images": [
          "Coneheads_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Coneheads are flowers with a cone-shaped center. Imagine these flowers without their colorful parts, and you know exactly what they look like when seeds are ripe."
      }
    ],
    "image_filenames": [
      "helianthus_divaricatus_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p10_4.png",
      "helianthus_divaricatus_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p10_5.png",
      "helianthus_divaricatus_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p10_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891899/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/helianthus_divaricatus_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p10_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891900/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/helianthus_divaricatus_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p10_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891901/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/helianthus_divaricatus_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p10_6.png"
    ],
    "page_number": 10
  },
  {
    "guide_id": 1278,
    "species_id": "sp_24",
    "scientific_name": "Helianthus strumosus",
    "common_name": "Savanna Sunflower",
    "family": "Asteraceae",
    "photo_date": "9-21-20",
    "description": "Coneheads. Subtle differences from H. divaricatus: petioles 0.5 - 3 cm long (lower leaves), some hairs on the stems near the flowering heads; top leaves may be alternate; leaf veins split from the center vein 1 mm or more into the blade, short peach fuzz on the underside of the leaves.",
    "seed_group_names": [
      "Coneheads"
    ],
    "seed_group_details": [
      {
        "name": "Coneheads",
        "images": [
          "Coneheads_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Coneheads are flowers with a cone-shaped center. Imagine these flowers without their colorful parts, and you know exactly what they look like when seeds are ripe."
      }
    ],
    "image_filenames": [
      "helianthus_strumosus_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p10_7.png",
      "helianthus_strumosus_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p10_8.png",
      "helianthus_strumosus_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p10_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891902/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/helianthus_strumosus_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p10_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891903/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/helianthus_strumosus_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p10_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891903/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/helianthus_strumosus_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p10_9.png"
    ],
    "page_number": 10
  },
  {
    "guide_id": 1278,
    "species_id": "sp_25",
    "scientific_name": "Smilax ecirrhata",
    "common_name": "Upright Carrion Flower",
    "family": "Smilacaceae",
    "photo_date": "9-12-18",
    "description": "Berries. Smilax species have clusters of dark purple-black fruits. This species lacks prickles, stands upright, typically shorter than 0.5 m, and less than 25 flowers per head. Unusual to see such colorful seeds hidden inside a berry.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "smilax_ecirrhata_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p11_1.png",
      "smilax_ecirrhata_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p11_2.png",
      "smilax_ecirrhata_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p11_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891958/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/smilax_ecirrhata_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p11_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891958/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/smilax_ecirrhata_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p11_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891959/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/smilax_ecirrhata_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p11_3.png"
    ],
    "page_number": 11
  },
  {
    "guide_id": 1278,
    "species_id": "sp_26",
    "scientific_name": "Smilax lasioneura",
    "common_name": "Common Carrion Flower",
    "family": "Smilacaceae",
    "photo_date": "10-4-17",
    "description": "Berries. Similar to the previous species, but taller/longer (rambling well over 1 m). No prickles. Pubescent hairs (short-hairy) on the underside of the leaves. Commonly more than 25 flowers & berries per head.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "smilax_lasioneura_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p11_4.png",
      "smilax_lasioneura_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p11_5.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891960/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/smilax_lasioneura_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p11_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891960/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/smilax_lasioneura_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p11_5.png"
    ],
    "page_number": 11
  },
  {
    "guide_id": 1278,
    "species_id": "sp_27",
    "scientific_name": "Verbena urticifolia",
    "common_name": "Hairy White Vervain",
    "family": "Verbenaceae",
    "photo_date": "9-13-18",
    "description": "Shakers. Common species in mesic to dry-mesic savannas & woodlands. Spikes of tiny white flowers (single spike to dozens) branch out at the top of the plant. After flowers fade, 4 brown seeds form in each calyx (cup). Lower leaf surfaces are thinly to densely hirsute (stiff, straight hairs). Var. leiocarpa has velutinous (velvety) hairs. Consult Flora for hybrids, vervains like to mix it up.",
    "seed_group_names": [
      "Shakers"
    ],
    "seed_group_details": [
      {
        "name": "Shakers",
        "images": [
          "Shakers_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Shakers drop seeds very close to the mother plant, when shaken loose by the wind or a passing critter. Usually a Mama’s Boy, unless strong weather occurs."
      }
    ],
    "image_filenames": [
      "verbena_urticifolia_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p11_6.png",
      "verbena_urticifolia_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p11_7.png",
      "verbena_urticifolia_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p11_8.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891974/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/verbena_urticifolia_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p11_6.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891974/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/verbena_urticifolia_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p11_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891975/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/verbena_urticifolia_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p11_8.png"
    ],
    "page_number": 11
  },
  {
    "guide_id": 1278,
    "species_id": "sp_28",
    "scientific_name": "Antenoron virginianum",
    "common_name": "Jumpseed",
    "family": "Polygonaceae",
    "photo_date": "9-20-17",
    "description": "Hitchhikers. Mama’s Boy. This ultra-common plant has several English & Latin names. Stems have knobby sheathed elbows like other smartweeds/knotweeds. Elongated spikes with tiny white flowers ripen to beaked seeds that jump onto your clothes, hanging on by the beak. No need to remove the papery shells for germination. The seeds are brown when ripe, look for pale brown shells. .",
    "seed_group_names": [
      "Hitchhikers"
    ],
    "seed_group_details": [
      {
        "name": "Hitchhikers",
        "images": [
          "Hitchhikers_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Hitchhikers are easy to tell when ripe – they hitch a ride on your pants! Color can be an indicator, but not always. Do Not Collect."
      }
    ],
    "image_filenames": [
      "antenoron_virginianum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p12_1.png",
      "antenoron_virginianum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p12_2.png",
      "antenoron_virginianum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p12_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891861/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/antenoron_virginianum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p12_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891863/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/antenoron_virginianum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p12_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891864/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/antenoron_virginianum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p12_3.png"
    ],
    "page_number": 12
  },
  {
    "guide_id": 1278,
    "species_id": "sp_29",
    "scientific_name": "Smilacina racemosa",
    "common_name": "Feathery False Solomon’s Seal",
    "family": "Convallariaceae",
    "photo_date": "9-15-18",
    "description": "Berries. Mama’s Boy. False Solomon leaves look very similar to “true,” but the flowers/fruit are clustered at the terminal end of the plant and berries are red. Collect clusters that are mostly red; speckled red berries are half-ripe.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "smilacina_racemosa_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p12_4.png",
      "smilacina_racemosa_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p12_5.png",
      "smilacina_racemosa_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p12_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891954/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/smilacina_racemosa_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p12_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891955/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/smilacina_racemosa_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p12_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891955/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/smilacina_racemosa_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p12_6.png"
    ],
    "page_number": 12
  },
  {
    "guide_id": 1278,
    "species_id": "sp_30",
    "scientific_name": "Smilacina stellata",
    "common_name": "Starry False Solomon’s Seal",
    "family": "Convallariaceae",
    "photo_date": "9-28-19",
    "description": "Berries. “Starry” has 6-pointed star flowers. Half-ripe berries have beach ball stripes, which also resembles a 6-pointed star from the right angle. Fully ripe berries are a deep cranberry red. Compared to the previous species, S. stellata is more upright & leaves are skinnier.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "smilacina_stellata_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p12_7.png",
      "smilacina_stellata_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p12_8.png",
      "smilacina_stellata_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p12_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891956/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/smilacina_stellata_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p12_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891956/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/smilacina_stellata_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p12_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891957/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/smilacina_stellata_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p12_9.png"
    ],
    "page_number": 12
  },
  {
    "guide_id": 1278,
    "species_id": "sp_31",
    "scientific_name": "Polygonatum biflorum",
    "common_name": "Smooth Solomon’s Seal",
    "family": "Convallariaceae",
    "photo_date": "9-16-19",
    "description": "Berries. Mama’s Boy. True Solomon’s Seal species hides its flowers under the leaves, with a “blueberry” fruit. This is the more common of the “true” species, with smooth leaves. Deer candy, like many lily-relatives; this has been moved into a more distant relation in the mayflower family.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "polygonatum_biflorum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p13_1.png",
      "polygonatum_biflorum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p13_2.png",
      "polygonatum_biflorum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p13_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891934/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/polygonatum_biflorum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p13_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891935/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/polygonatum_biflorum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p13_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891936/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/polygonatum_biflorum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p13_3.png"
    ],
    "page_number": 13
  },
  {
    "guide_id": 1278,
    "species_id": "sp_32",
    "scientific_name": "Polygonatum pubescens",
    "common_name": "Downy Solomon’s Seal",
    "family": "Convallariaceae",
    "photo_date": "10-8-19",
    "description": "Berries. This state threatened species has tiny peach fuzz on the underside of the leaves. Plants are usually smaller than its more common sister. Wet-mesic and mesic woodlands. Like other Solomon’s Seals and lilies, these seeds have decent germination but take years to mature.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "polygonatum_pubescens_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p13_4.png",
      "polygonatum_pubescens_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p13_5.png",
      "polygonatum_pubescens_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p13_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891937/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/polygonatum_pubescens_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p13_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891937/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/polygonatum_pubescens_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p13_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891938/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/polygonatum_pubescens_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p13_6.png"
    ],
    "page_number": 13
  },
  {
    "guide_id": 1278,
    "species_id": "sp_33",
    "scientific_name": "Dioscorea villosa",
    "common_name": "Wild Yam",
    "family": "Dioscoreaceae",
    "photo_date": "9-20-17",
    "description": "Shakers. This vine has heart-shaped leaves & subtle green flowers. Look for 3-finned propellers, ripening from green to beige/brown, and finally splitting open along the bottom to release 2 papery seeds from each fin. Often does not flower & found creeping along the ground. Flowers & seed are more likely when plants grow on woodland edges (more sunlight) and when climbing. Rodents sometimes eat the seeds.",
    "seed_group_names": [
      "Shakers"
    ],
    "seed_group_details": [
      {
        "name": "Shakers",
        "images": [
          "Shakers_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Shakers drop seeds very close to the mother plant, when shaken loose by the wind or a passing critter. Usually a Mama’s Boy, unless strong weather occurs."
      }
    ],
    "image_filenames": [
      "dioscorea_villosa_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p13_7.png",
      "dioscorea_villosa_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p13_8.png",
      "dioscorea_villosa_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p13_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891894/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/dioscorea_villosa_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p13_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891894/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/dioscorea_villosa_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p13_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891895/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/dioscorea_villosa_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p13_9.png"
    ],
    "page_number": 13
  },
  {
    "guide_id": 1278,
    "species_id": "sp_34",
    "scientific_name": "Agastache scrophulariifolia",
    "common_name": "Purple Giant Hyssop",
    "family": "Lamiaceae",
    "photo_date": "9-20-17",
    "description": "Shakers. Mama’s Boy. These mint-relatives have square stems & irregular flowers. “Purple” often blooms white, but sometimes pale lavender. Stems are hairy on the square angles. Leaves are a medium green. Snip heads when they are mostly brown, seeds easily spill out.",
    "seed_group_names": [
      "Shakers"
    ],
    "seed_group_details": [
      {
        "name": "Shakers",
        "images": [
          "Shakers_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Shakers drop seeds very close to the mother plant, when shaken loose by the wind or a passing critter. Usually a Mama’s Boy, unless strong weather occurs."
      }
    ],
    "image_filenames": [
      "agastache_scrophulariifolia_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p14_1.png",
      "agastache_scrophulariifolia_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p14_2.png",
      "agastache_scrophulariifolia_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p14_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891850/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/agastache_scrophulariifolia_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p14_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891851/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/agastache_scrophulariifolia_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p14_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891852/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/agastache_scrophulariifolia_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p14_3.png"
    ],
    "page_number": 14
  },
  {
    "guide_id": 1278,
    "species_id": "sp_35",
    "scientific_name": "Agastache nepetoides",
    "common_name": "Yellow Giant Hyssop",
    "family": "Lamiaceae",
    "photo_date": "9-24-19",
    "description": "Shakers. Mama’s Boy. Yellow hyssop has yellow/cream-colored flowers, stems are typically smooth and hairless. Stems & leaves are a brighter yellow-green; seed spikes & mature stems are a little skinnier than its sister.",
    "seed_group_names": [
      "Shakers"
    ],
    "seed_group_details": [
      {
        "name": "Shakers",
        "images": [
          "Shakers_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Shakers drop seeds very close to the mother plant, when shaken loose by the wind or a passing critter. Usually a Mama’s Boy, unless strong weather occurs."
      }
    ],
    "image_filenames": [
      "agastache_nepetoides_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p14_4.png",
      "agastache_nepetoides_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p14_5.png",
      "agastache_nepetoides_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p14_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891847/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/agastache_nepetoides_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p14_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891848/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/agastache_nepetoides_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p14_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891849/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/agastache_nepetoides_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p14_6.png"
    ],
    "page_number": 14
  },
  {
    "guide_id": 1278,
    "species_id": "sp_36",
    "scientific_name": "Eutrochium purpureum",
    "common_name": "Purple Joe Pye Weed",
    "family": "Asteraceae",
    "photo_date": "9-20-17",
    "description": "Fluffy. Mama’s Boy. This tall perennial has big heads of brown fluffy seeds. The stems are green, or purple at the leaf axils only; E. maculatum (its wetland sister) has stems that are purple or purple-spotted throughout. Rounded & tall heads, often in 2 layers. E. maculatum has single layer, flat-topped heads. Legends claim that Joe Pye was a talented & altruistic Native American medicine man.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "eutrochium_purpureum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p14_7.png",
      "eutrochium_purpureum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p14_8.png",
      "eutrochium_purpureum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p14_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891896/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/eutrochium_purpureum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p14_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891896/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/eutrochium_purpureum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p14_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891897/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/eutrochium_purpureum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p14_9.png"
    ],
    "page_number": 14
  },
  {
    "guide_id": 1278,
    "species_id": "sp_37",
    "scientific_name": "Lithospermum latifolium",
    "common_name": "American Gromwell",
    "family": "Boraginaceae",
    "photo_date": "9-20-17",
    "description": "Shattering. Mama’s Boy. Aka stoneseed or woodland puccoon. Seeds look like little white-gray pearly stones. Long collection window; you can pluck the seeds off long after the leaves are gone. Good germination with directly sowing outdoors in the fall.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "lithospermum_latifolium_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p15_1.png",
      "lithospermum_latifolium_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p15_2.png",
      "lithospermum_latifolium_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p15_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891929/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/lithospermum_latifolium_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p15_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891929/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/lithospermum_latifolium_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p15_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891930/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/lithospermum_latifolium_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p15_3.png"
    ],
    "page_number": 15
  },
  {
    "guide_id": 1278,
    "species_id": "sp_38",
    "scientific_name": "Lobelia inflata",
    "common_name": "Indian Tobacco",
    "family": "Lobeliaceae",
    "photo_date": "9-20-17",
    "description": "Shakers. This annual Lobelia is uncommon. Species name refers to the inflated seed capsules. Tiny pale purple flowers and tiny seeds (500,000 seeds/oz). Germinates well in the low-competition of a greenhouse tray, but in the wild it is a special treat. Collect 10%",
    "seed_group_names": [
      "Shakers"
    ],
    "seed_group_details": [
      {
        "name": "Shakers",
        "images": [
          "Shakers_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Shakers drop seeds very close to the mother plant, when shaken loose by the wind or a passing critter. Usually a Mama’s Boy, unless strong weather occurs."
      }
    ],
    "image_filenames": [
      "lobelia_inflata_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p15_4.png",
      "lobelia_inflata_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p15_5.png",
      "lobelia_inflata_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p15_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891930/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/lobelia_inflata_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p15_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891931/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/lobelia_inflata_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p15_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891932/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/lobelia_inflata_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p15_6.png"
    ],
    "page_number": 15
  },
  {
    "guide_id": 1278,
    "species_id": "sp_39",
    "scientific_name": "Scrophularia marilandica",
    "common_name": "Late Figwort",
    "family": "Scrophulariaceae",
    "photo_date": "9-20-17",
    "description": "Beaks. Mama’s Boy. In the extended family of the mints, with square stems. Small green & burgundy flowers and a dark purple sterile stamen, good for many pollinators. Brown teardrop capsules open to release tiny seeds. S. lanceolata blooms earlier, sterile stamen is green.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "scrophularia_marilandica_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p15_7.png",
      "scrophularia_marilandica_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p15_8.png",
      "scrophularia_marilandica_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p15_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891952/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/scrophularia_marilandica_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p15_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891953/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/scrophularia_marilandica_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p15_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891954/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/scrophularia_marilandica_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p15_9.png"
    ],
    "page_number": 15
  },
  {
    "guide_id": 1278,
    "species_id": "sp_40",
    "scientific_name": "Cirsium altissimum",
    "common_name": "Tall Thistle",
    "family": "Asteraceae",
    "photo_date": "9-28-19",
    "description": "Fluffy. One of the good thistles. Native thistles are never abundant, but are equally desirable to insects & birds. Leaves are typically unlobed in this species, green on top and a bright bleached woolly white beneath. Snip heads, process with a machine or pluck seeds with tweezers.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "cirsium_altissimum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p16_1.png",
      "cirsium_altissimum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p16_2.png",
      "cirsium_altissimum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p16_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891882/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/cirsium_altissimum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p16_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891882/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/cirsium_altissimum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p16_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891883/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/cirsium_altissimum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p16_3.png"
    ],
    "page_number": 16
  },
  {
    "guide_id": 1278,
    "species_id": "sp_41",
    "scientific_name": "Aureolaria grandiflora var. pulchra",
    "common_name": "Yellow False Foxglove",
    "family": "Orobanchaceae",
    "photo_date": "9-30-17",
    "description": "Beaks. Mama’s Boy. These plants have sunny yellow trumpet flowers. Hemiparasitic (germinate solo but need their host to reach maturity). ID Aureolaria by checking stems, leaves, and seed capsules for hairs, the length of the pedicels (flower stalks). Short-lived perennials.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "aureolaria_grandiflora_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p16_4.png",
      "aureolaria_grandiflora_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p16_5.png",
      "aureolaria_grandiflora_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p16_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891877/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/aureolaria_grandiflora_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p16_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891877/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/aureolaria_grandiflora_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p16_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891878/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/aureolaria_grandiflora_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p16_6.png"
    ],
    "page_number": 16
  },
  {
    "guide_id": 1278,
    "species_id": "sp_42",
    "scientific_name": "Dasistoma macrophylla",
    "common_name": "Mullein Foxglove",
    "family": "Orobanchaceae",
    "photo_date": "10-24-19",
    "description": "Beaks. Mama’s Boy. An annual or monocarpic perennial (flowers once then dies). Dasistoma means “woolly-mouthed” referring to the dense hairs in the trumpet’s throat. Flowers, seed capsules, and pedicels (flower stems) are slightly smaller than A. grandiflora. Collect 10%",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "dasistoma_macrophylla_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p16_7.png",
      "dasistoma_macrophylla_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p16_8.png",
      "dasistoma_macrophylla_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p16_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891886/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/dasistoma_macrophylla_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p16_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891887/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/dasistoma_macrophylla_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p16_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891887/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/dasistoma_macrophylla_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p16_9.png"
    ],
    "page_number": 16
  },
  {
    "guide_id": 1278,
    "species_id": "sp_43",
    "scientific_name": "Allium tricoccum",
    "common_name": "Wild Leek",
    "family": "Alliaceae",
    "photo_date": "9-30-19",
    "description": "Shattering. Mama’s Boy. Black pearls hiding in the shady understory. Species name means “3-seeded,” referring to the triplicate clusters of seed. Differs from A. burdickii by having red petioles & leaf sheaths, ripening slightly later, and a few more seeds per stalk. Unripe leek seeds are covered in a light green shell, which splits & turns beige. Poor from seed, but spreads locally by bulbs. Poaching is a problem.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "allium_tricoccum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p17_1.png",
      "allium_tricoccum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p17_2.png",
      "allium_tricoccum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p17_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891854/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/allium_tricoccum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p17_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891855/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/allium_tricoccum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p17_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891856/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/allium_tricoccum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p17_3.png"
    ],
    "page_number": 17
  },
  {
    "guide_id": 1278,
    "species_id": "sp_44",
    "scientific_name": "Hieracium scabrum",
    "common_name": "Rough Hawkweed",
    "family": "Asteraceae",
    "photo_date": "9-30-17",
    "description": "Fluffy. Like many dandelion-like flowers, hawkweeds are often ignored. This conservative (C = 7) species likes mesic to dry habitats, often in sandy/gravelly soils. Leafy stems. Hairy throughout, stem hairs of two types: black glandular (lollipop) hairs and tiny fuzzy white hairs. Seeds are shaped in columns (not tapered) with tawny (amber-orange) pappus.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "hieracium_scabrum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p17_4.png",
      "hieracium_scabrum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p17_5.png",
      "hieracium_scabrum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p17_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891907/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/hieracium_scabrum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p17_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891908/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/hieracium_scabrum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p17_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891910/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/hieracium_scabrum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p17_6.png"
    ],
    "page_number": 17
  },
  {
    "guide_id": 1278,
    "species_id": "sp_45",
    "scientific_name": "Lespedeza frutescens",
    "common_name": "Violet Bush Clover",
    "family": "Fabaceae",
    "photo_date": "9-30-17",
    "description": "Shattering. Mama’s Boy. This delicate plant loves mesic to dry oak savannas. Distinguished from other Lespedezas by its height, and flowers on short stalks that are longer than the leaflets. Showy flowers are chasmogamous (cross-pollinated) and tiny cleistogamous flowers (selfpollinating, resembling closed buds) form in axils. Note: the former name of L. violacea has been reassigned to a different species.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "lespedeza_frutescens_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p17_7.png",
      "lespedeza_frutescens_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p17_8.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891924/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/lespedeza_frutescens_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p17_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891925/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/lespedeza_frutescens_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p17_8.png"
    ],
    "page_number": 17
  },
  {
    "guide_id": 1278,
    "species_id": "sp_46",
    "scientific_name": "Phryma leptostachya",
    "common_name": "Lopseed",
    "family": "Phrymaceae",
    "photo_date": "10-2-17",
    "description": "Hitchhikers. Mama’s Boy. The only species in this genus for the entire country, with paired seeds that dangle like a lop-eared rabbit or beagle ears. Cute little pink & white flowers, happiest in rocky/sandy soil. Snip stems or strip with a gloved hand.",
    "seed_group_names": [
      "Hitchhikers"
    ],
    "seed_group_details": [
      {
        "name": "Hitchhikers",
        "images": [
          "Hitchhikers_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Hitchhikers are easy to tell when ripe – they hitch a ride on your pants! Color can be an indicator, but not always. Do Not Collect."
      }
    ],
    "image_filenames": [
      "phryma_leptostachya_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p18_1.png",
      "phryma_leptostachya_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p18_2.png",
      "phryma_leptostachya_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p18_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891932/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/phryma_leptostachya_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p18_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891933/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/phryma_leptostachya_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p18_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891934/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/phryma_leptostachya_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p18_3.png"
    ],
    "page_number": 18
  },
  {
    "guide_id": 1278,
    "species_id": "sp_47",
    "scientific_name": "Liatris scariosa var. nieuwlandii",
    "common_name": "Savanna Blazing Star",
    "family": "Asteraceae",
    "photo_date": "10-4-17",
    "description": "Fluffy. Like many true savanna species, this is an uncommon plant. The pink-purple flowers have unusually long stalks (pedicels), ripening to a light brown poof. Flora notes different textures of the pappus hairs of Liatris species, which can be observed under magnification.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "liatris_scariosa_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p18_4.png",
      "liatris_scariosa_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p18_5.png",
      "liatris_scariosa_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p18_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891926/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/liatris_scariosa_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p18_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891927/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/liatris_scariosa_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p18_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891928/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/liatris_scariosa_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p18_6.png"
    ],
    "page_number": 18
  },
  {
    "guide_id": 1278,
    "species_id": "sp_48",
    "scientific_name": "Thaspium trifoliatum",
    "common_name": "Meadow Parsnip",
    "family": "Apiaceae",
    "photo_date": "10-4-20",
    "description": "Shattering. Mama’s Boy. This rare flower is understandably overlooked as a common Zizia. The leaves are essentially identical, both have yellow flowers. Seeds are similar, but this species has larger seeds and ribs are elongated into wings. The flower/seed in the exact center of each umbel is stalkless for Zizia, but stalked for Thaspium. Savannas & prairies.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "thaspium_trifoliatum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p18_7.png",
      "thaspium_trifoliatum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p18_8.png",
      "thaspium_trifoliatum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p18_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891962/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/thaspium_trifoliatum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p18_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891963/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/thaspium_trifoliatum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p18_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891964/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/thaspium_trifoliatum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p18_9.png"
    ],
    "page_number": 18
  },
  {
    "guide_id": 1278,
    "species_id": "sp_49",
    "scientific_name": "Clematis virginiana",
    "common_name": "Virgin’s Bower",
    "family": "Ranunculaceae",
    "photo_date": "10-11-18",
    "description": "Shattering. Mama’s Boy. One of two native Clematis vines. This one has small white flowers & seeds like prairie smoke. Leaves in 3s rather than 5s. Dioecious (need male & female plants). Uncommon in the region but locally abundant. Ripe seeds are easily tugged loose.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "clematis_virginiana_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p19_1.png",
      "clematis_virginiana_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p19_2.png",
      "clematis_virginiana_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p19_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891884/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/clematis_virginiana_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p19_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891884/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/clematis_virginiana_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p19_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891885/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/clematis_virginiana_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p19_3.png"
    ],
    "page_number": 19
  },
  {
    "guide_id": 1278,
    "species_id": "sp_50",
    "scientific_name": "Verbena stricta",
    "common_name": "Hoary Vervain",
    "family": "Verbenaceae",
    "photo_date": "10-13-17",
    "description": "Shakers. Mama’s Boy. Hoary refers to the grayish hairs (think: hoarfrost). 1-3 tightly packed spikes per plant. Leaves more than 2 cm wide, without petioles (or at most 5 mm long). Test by tipping spike into your hand; skinny seeds will fall out when ripe. Snip stalks.",
    "seed_group_names": [
      "Shakers"
    ],
    "seed_group_details": [
      {
        "name": "Shakers",
        "images": [
          "Shakers_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Shakers drop seeds very close to the mother plant, when shaken loose by the wind or a passing critter. Usually a Mama’s Boy, unless strong weather occurs."
      }
    ],
    "image_filenames": [
      "verbena_stricta_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p19_4.png",
      "verbena_stricta_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p19_5.png",
      "verbena_stricta_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p19_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891972/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/verbena_stricta_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p19_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891972/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/verbena_stricta_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p19_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891973/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/verbena_stricta_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p19_6.png"
    ],
    "page_number": 19
  },
  {
    "guide_id": 1278,
    "species_id": "sp_51",
    "scientific_name": "Amphicarpaea bracteata",
    "common_name": "Upland Hog Peanut",
    "family": "Fabaceae",
    "photo_date": "10-15-18",
    "description": "Ballistic. This native vine crawls all over the surrounding vegetation like a kudzu-wannabe and is locally annoying. White & lavender flowers become pea-pods; cleistogamous flowers (closed flowers that self-fertilize) grow on low stolons (runners) that form “peanuts.” Var. comosa is hairier. Butterflies & hummingbirds feed on it, and reportedly the passenger pigeon did too.",
    "seed_group_names": [
      "Ballistic"
    ],
    "seed_group_details": [
      {
        "name": "Ballistic",
        "images": [
          "Ballistic_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Ballistic capsules catapult their babies away, up to 30 feet! Search YouTube for “exploding seeds” to see these in action. To harvest: learn the ripening sequence & harvest just before explosion; store in a *sealed* paper bag or mesh bag for a day or two."
      }
    ],
    "image_filenames": [
      "amphicarpaea_bracteata_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p19_7.png",
      "amphicarpaea_bracteata_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p19_8.png",
      "amphicarpaea_bracteata_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p19_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891857/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/amphicarpaea_bracteata_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p19_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891858/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/amphicarpaea_bracteata_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p19_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891859/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/amphicarpaea_bracteata_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p19_9.png"
    ],
    "page_number": 19
  },
  {
    "guide_id": 1278,
    "species_id": "sp_52",
    "scientific_name": "Hypericum perforatum",
    "common_name": "Common St. John’s Wort",
    "family": "Hypericaceae",
    "photo_date": "10-18-19",
    "description": "Beaks. Mama’s Boy. A common European species with translucent dots in the leaves (hold up to the sun for quick ID) and bushy with many branches. Black glands are primarily on the margins of petals. Leaves less than 1 cm wide. Seeds usually longer than 1 mm. Hypericum species were reportedly used on the eve of St. John’s day to ward off evil spirits. Common. Do not collect.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "hypericum_perforatum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p20_1.png",
      "hypericum_perforatum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p20_2.png",
      "hypericum_perforatum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p20_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891912/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/hypericum_perforatum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p20_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891913/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/hypericum_perforatum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p20_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891913/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/hypericum_perforatum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p20_3.png"
    ],
    "page_number": 20
  },
  {
    "guide_id": 1278,
    "species_id": "sp_53",
    "scientific_name": "Hypericum punctatum",
    "common_name": "Spotted St. John’s Wort",
    "family": "Hypericaceae",
    "photo_date": "10-19-19",
    "description": "Beaks. Mama’s Boy. A native species with dots in the petals like H. perforatum, but with only a few branches (if any). Dots of black glands are evident throughout petals, sepals, stems, and leaves. Larger leaves wider than 1 cm. Seeds mostly shorter than 1 mm.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "hypericum_punctatum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p20_4.png",
      "hypericum_punctatum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p20_5.png",
      "hypericum_punctatum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p20_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891914/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/hypericum_punctatum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p20_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891916/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/hypericum_punctatum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p20_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891917/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/hypericum_punctatum_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p20_6.png"
    ],
    "page_number": 20
  },
  {
    "guide_id": 1278,
    "species_id": "sp_54",
    "scientific_name": "Rudbeckia triloba",
    "common_name": "Brown-eyed Susan",
    "family": "Asteraceae",
    "photo_date": "10-25-17",
    "description": "Coneheads. Mama’s Boy. The name is apparent after the conehead is empty of seeds. Snip heads that are dark almost black, or crumble to see if seeds come out. Favors savannas & woodland edges. Leaves with 3-lobes (“triloba”). Rudbeckia spp are quick to flower in restorations.",
    "seed_group_names": [
      "Coneheads"
    ],
    "seed_group_details": [
      {
        "name": "Coneheads",
        "images": [
          "Coneheads_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Coneheads are flowers with a cone-shaped center. Imagine these flowers without their colorful parts, and you know exactly what they look like when seeds are ripe."
      }
    ],
    "image_filenames": [
      "rudbeckia_triloba_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p20_7.png",
      "rudbeckia_triloba_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p20_8.png",
      "rudbeckia_triloba_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p20_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891944/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/rudbeckia_triloba_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p20_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891944/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/rudbeckia_triloba_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p20_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891945/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/rudbeckia_triloba_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p20_9.png"
    ],
    "page_number": 20
  },
  {
    "guide_id": 1278,
    "species_id": "sp_55",
    "scientific_name": "Prenanthes alba",
    "common_name": "White Lettuce",
    "family": "Asteraceae",
    "photo_date": "11-2-18",
    "description": "Fluffy. Mama’s Boy. Another genus of lettuce with milky sap. Flowers are dangling trumpets. Seeds have rusty pappus (fluff) and typically 8 bracts around the seeds (and cupped around the flowers). Flowers are white & pink/purple. Collect 10%, biennial/short-lived perennial.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "prenanthes_alba_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p21_1.png",
      "prenanthes_alba_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p21_2.png",
      "prenanthes_alba_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p21_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891938/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/prenanthes_alba_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p21_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891940/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/prenanthes_alba_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p21_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891940/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/prenanthes_alba_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p21_3.png"
    ],
    "page_number": 21
  },
  {
    "guide_id": 1278,
    "species_id": "sp_56",
    "scientific_name": "Prenanthes altissima",
    "common_name": "Tall White Lettuce",
    "family": "Asteraceae",
    "photo_date": "11-2-18",
    "description": "Fluffy. Mama’s Boy. Contrary to the name, this species is usually shorter than P. alba. Fluff is honey to cinnamon colored, with 5 bracts. All Prenanthes species have variable leaf shapes; ID by flowers or seeds. Flowers are green-yellow. Collect 10%",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "prenanthes_altissima_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p21_4.png",
      "prenanthes_altissima_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p21_5.png",
      "prenanthes_altissima_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p21_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891942/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/prenanthes_altissima_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p21_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891942/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/prenanthes_altissima_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p21_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766891943/1278_usa_illinois_lakecounty_fallwoodlandforbsv2/prenanthes_altissima_1278_usa_illinois_lakecounty_fallwoodlandforbsv2_p21_6.png"
    ],
    "page_number": 21
  },
  {
    "guide_id": 1279,
    "species_id": "sp_1",
    "scientific_name": "Impatiens capensis",
    "common_name": "Spotted Touch-me-not",
    "family": "Balsaminaceae",
    "photo_date": "9-4-18",
    "description": "Ballistic. These plants are named for their explosive seeds. Fun to play with! Plump pods burst from the slightest touch, startling even when you expect it. Collect carefully – grab pods with a firm grip or snip stalks and bag immediately. This is the more common species. Annual.",
    "seed_group_names": [
      "Ballistic"
    ],
    "seed_group_details": [
      {
        "name": "Ballistic",
        "images": [
          "Ballistic_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Ballistic capsules catapult their babies away, up to 30 feet! Search YouTube for “exploding seeds” to see these in action. To harvest: learn the ripening sequence & harvest just before explosion; store in a *sealed* paper bag or mesh bag for a day or two."
      }
    ],
    "image_filenames": [
      "impatiens_capensis_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p3_1.png",
      "impatiens_capensis_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p3_2.png",
      "impatiens_capensis_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p3_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892630/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/impatiens_capensis_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p3_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892631/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/impatiens_capensis_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p3_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892631/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/impatiens_capensis_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p3_3.png"
    ],
    "page_number": 3
  },
  {
    "guide_id": 1279,
    "species_id": "sp_2",
    "scientific_name": "Impatiens pallida",
    "common_name": "Pale Touch-me-not",
    "family": "Balsaminaceae",
    "photo_date": "9-5-19",
    "description": "Ballistic. Easiest to ID Impatiens by flower color. This species is larger overall; largest leaves are typically 8+ cm long. Can grow in sunny moist places like I. capensis, but also mesic woodlands. The sap is reportedly useful in washing off poison ivy oils. Annual, collect 10%",
    "seed_group_names": [
      "Ballistic"
    ],
    "seed_group_details": [
      {
        "name": "Ballistic",
        "images": [
          "Ballistic_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Ballistic capsules catapult their babies away, up to 30 feet! Search YouTube for “exploding seeds” to see these in action. To harvest: learn the ripening sequence & harvest just before explosion; store in a *sealed* paper bag or mesh bag for a day or two."
      }
    ],
    "image_filenames": [
      "impatiens_pallida_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p3_4.png",
      "impatiens_pallida_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p3_5.png",
      "impatiens_pallida_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p3_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892632/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/impatiens_pallida_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p3_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892632/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/impatiens_pallida_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p3_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892633/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/impatiens_pallida_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p3_6.png"
    ],
    "page_number": 3
  },
  {
    "guide_id": 1279,
    "species_id": "sp_3",
    "scientific_name": "Symplocarpus foetidus",
    "common_name": "Skunk Cabbage",
    "family": "Araceae",
    "photo_date": "9-5-19",
    "description": "Berries. This awesomely weird plant blooms around February but doesn’t ripen until August. Look for chunky fruit, looks more like a mushroom or a meteorite. Collect soft, dark fruits. Fruits naturally degrade and release brownish nuts that can float. Seeds may germinate right away. Also known for its contractile roots that pull the plant deep into the muck, flowers that can melt snow, and an odor flies love.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "symplocarpus_foetidus_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p3_7.png",
      "symplocarpus_foetidus_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p3_8.png",
      "symplocarpus_foetidus_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p3_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892708/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/symplocarpus_foetidus_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p3_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892708/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/symplocarpus_foetidus_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p3_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892709/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/symplocarpus_foetidus_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p3_9.png"
    ],
    "page_number": 3
  },
  {
    "guide_id": 1279,
    "species_id": "sp_4",
    "scientific_name": "Arisaema dracontium",
    "common_name": "Green Dragon",
    "family": "Araceae",
    "photo_date": "9-10-19",
    "description": "Berries. Grows a “dragon’s wing” of leaves; the flower is a green head with a long yellow tongue of “flame”! In fruit, it looks like its brother Jack-in-the-Pulpit (see Fall Woodland Forbs) and they can grow next to each other in wetter woodlands. Look for remnants of leaves or flag one species earlier in the season. Fruits are a bright tomato-red when ripe. Process these seeds with gloves; skin irritation is possible.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "arisaema_dracontium_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p4_1.png",
      "arisaema_dracontium_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p4_2.png",
      "arisaema_dracontium_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p4_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892591/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/arisaema_dracontium_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p4_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892591/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/arisaema_dracontium_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p4_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892592/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/arisaema_dracontium_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p4_3.png"
    ],
    "page_number": 4
  },
  {
    "guide_id": 1279,
    "species_id": "sp_5",
    "scientific_name": "Hibiscus palustris",
    "common_name": "Northern Rose Mallow",
    "family": "Malvaceae",
    "photo_date": "9-12-17",
    "description": "Beaks. Mallows are our own little piece of Hawaii, except native to IL! Stunning big flowers in shades of white & pink. This species has ovate leaves (broader at the base tapering to a pointed tip). Seeds are hairless, chocolate brown. Collect open pods.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "hibiscus_palustris_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p4_4.png",
      "hibiscus_palustris_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p4_5.png",
      "hibiscus_palustris_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p4_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892626/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/hibiscus_palustris_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p4_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892627/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/hibiscus_palustris_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p4_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892628/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/hibiscus_palustris_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p4_6.png"
    ],
    "page_number": 4
  },
  {
    "guide_id": 1279,
    "species_id": "sp_6",
    "scientific_name": "Hibiscus laevis",
    "common_name": "Halberd-leaved Rose Mallow",
    "family": "Malvaceae",
    "photo_date": "10-16-17",
    "description": "Beaks. This species has triangular pointed leaves with lobes at the base like a cross-guard of a weapon. (Whether this resembles a halberd is debatable.) Seeds are rusty & fuzzy. Both species have large capsules that split open like a brown orange, 5 segments. Collect open pods.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "hibiscus_laevis_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p4_7.png",
      "hibiscus_laevis_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p4_8.png",
      "hibiscus_laevis_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p4_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892624/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/hibiscus_laevis_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p4_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892625/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/hibiscus_laevis_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p4_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892625/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/hibiscus_laevis_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p4_9.png"
    ],
    "page_number": 4
  },
  {
    "guide_id": 1279,
    "species_id": "sp_7",
    "scientific_name": "Lysimachia ciliata",
    "common_name": "Fringed Loosestrife",
    "family": "Myrsinaceae",
    "photo_date": "9-12-17",
    "description": "Beaks. This yellow loosestrife has cilia (fringes) on the leaf petiole. Leaves are broad, round bases. Globe-shaped capsules turn brown & split open at the top. Seeds are small rounded wedges. Seed quality can vary; bigger globes tend to have better quality (fewer aborted) seeds.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "lysimachia_ciliata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p5_1.png",
      "lysimachia_ciliata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p5_2.png",
      "lysimachia_ciliata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p5_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892652/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/lysimachia_ciliata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p5_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892653/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/lysimachia_ciliata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p5_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892654/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/lysimachia_ciliata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p5_3.png"
    ],
    "page_number": 5
  },
  {
    "guide_id": 1279,
    "species_id": "sp_8",
    "scientific_name": "Senna hebecarpa",
    "common_name": "Wild Senna",
    "family": "Caesalpiniaceae",
    "photo_date": "9-20-17",
    "description": "Beaks. The 2 native Senna species have bright yellow flowers that pollinators love. The differences are subtle: the gland on the petiole (leaf stem) and hairs on the pod can assist with ID. Easiest way is to look at the seeds: this species has broad seeds with wide wings (kind of like a stingray). S. marilandica has pointed oval seeds, like small watermelon seeds. The legumes don’t always split open, collect brown pods.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "senna_hebecarpa_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p5_4.png",
      "senna_hebecarpa_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p5_5.png",
      "senna_hebecarpa_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p5_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892696/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/senna_hebecarpa_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p5_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892696/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/senna_hebecarpa_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p5_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892697/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/senna_hebecarpa_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p5_6.png"
    ],
    "page_number": 5
  },
  {
    "guide_id": 1279,
    "species_id": "sp_9",
    "scientific_name": "Senna marilandica",
    "common_name": "Maryland Senna",
    "family": "Caesalpiniaceae",
    "photo_date": "10-15-20",
    "description": "Beaks. Seeds of this species are more oval shaped, compared to its sister S. hebecarpa. The gland on the petiole (leaf stalk) is cylindrical (versus club-shaped and widest beyond the middle). Pods - legumes - can be hairy or hairless for both species, although this species is at best thinly hairy. If present, hairs on the ovary and fruit are shorter on this species (S. hebecarpa hairs are “longer,” more than 1.3 mm long).",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "senna_marilandica_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p5_7.png",
      "senna_marilandica_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p5_8.png",
      "senna_marilandica_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p5_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892698/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/senna_marilandica_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p5_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892699/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/senna_marilandica_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p5_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892699/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/senna_marilandica_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p5_9.png"
    ],
    "page_number": 5
  },
  {
    "guide_id": 1279,
    "species_id": "sp_10",
    "scientific_name": "Laportea canadensis",
    "common_name": "Wood Nettle",
    "family": "Urticaceae",
    "photo_date": "9-21-18",
    "description": "Shattering. One of several nettle species that stings, don’t touch without gloves! This plant is important for butterflies, including the Question Mark, Comma, and Red Admiral. Leaves are wide. Fruit are terminal (at the top of the plant). Self-sows readily. Rarely collected.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "laportea_canadensis_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p6_1.png",
      "laportea_canadensis_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p6_2.png",
      "laportea_canadensis_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p6_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892633/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/laportea_canadensis_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p6_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892634/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/laportea_canadensis_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p6_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892634/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/laportea_canadensis_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p6_3.png"
    ],
    "page_number": 6
  },
  {
    "guide_id": 1279,
    "species_id": "sp_11",
    "scientific_name": "Cuscuta polygonorum",
    "common_name": "Knotweed Dodder",
    "family": "Cuscutaceae",
    "photo_date": "9-23-19",
    "description": "Beaks. Mama’s Boy. Dodders are parasitic annuals, most noticeable in summer when the orange “silly string” vines start crawling over host plants. The dodder spirals around a host, attaches, and the viny bits disappear. Check dark brown/black capsules to see if the seed has ripened to brown. Collect 10%. Dodders can be helpful to keep their hosts - typically common (aggressive) native plants – in check.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "cuscuta_polygonorum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p6_4.png",
      "cuscuta_polygonorum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p6_5.png",
      "cuscuta_polygonorum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p6_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892607/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/cuscuta_polygonorum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p6_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892607/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/cuscuta_polygonorum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p6_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892608/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/cuscuta_polygonorum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p6_6.png"
    ],
    "page_number": 6
  },
  {
    "guide_id": 1279,
    "species_id": "sp_12",
    "scientific_name": "Scutellaria galericulata",
    "common_name": "Marsh Skullcap",
    "family": "Lamiaceae",
    "photo_date": "9-25-20",
    "description": "Shakers. Like other skullcaps, seeds are loosely sitting on a scoop shovel, with a funny little cap on top that readily falls off. Individual flowers often tucked in at leaf axils (where leaf & stems meet) although there can be a cluster at the end of a branch. Leaves have petioles and are at least 2x long as wide. Leaf surface is hairless on top and hairy underneath.",
    "seed_group_names": [
      "Shakers"
    ],
    "seed_group_details": [
      {
        "name": "Shakers",
        "images": [
          "Shakers_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Shakers drop seeds very close to the mother plant, when shaken loose by the wind or a passing critter. Usually a Mama’s Boy, unless strong weather occurs."
      }
    ],
    "image_filenames": [
      "scutellaria_galericulata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p6_7.png",
      "scutellaria_galericulata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p6_8.png",
      "scutellaria_galericulata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p6_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892694/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/scutellaria_galericulata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p6_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892694/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/scutellaria_galericulata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p6_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892695/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/scutellaria_galericulata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p6_9.png"
    ],
    "page_number": 6
  },
  {
    "guide_id": 1279,
    "species_id": "sp_13",
    "scientific_name": "Cicuta maculata",
    "common_name": "Water Hemlock",
    "family": "Apiaceae",
    "photo_date": "9-23-19",
    "description": "Shattering. Mama’s Boy. White flowers, reminiscent of its cousin, Queen Anne’s lace. Seeds are small, chunky, and striped, 3-4 mm long. Leaves are double compound (branches of leaves are subdivided with their own branches of leaves). Toxic to humans (don’t eat it!) but good for swallowtail butterflies & other wildlife.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "cicuta_maculata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p7_1.png",
      "cicuta_maculata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p7_2.png",
      "cicuta_maculata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p7_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892603/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/cicuta_maculata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p7_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892604/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/cicuta_maculata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p7_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892604/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/cicuta_maculata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p7_3.png"
    ],
    "page_number": 7
  },
  {
    "guide_id": 1279,
    "species_id": "sp_14",
    "scientific_name": "Cicuta bulbifera",
    "common_name": "Wispy Water Hemlock",
    "family": "Apiaceae",
    "photo_date": "9-25-20",
    "description": "Shattering. Wispy indeed! Similar, but far more delicate than the common water hemlock. The stems lean on surrounding plants for support, the leaves are skinnier and bulblets are tucked into the leaf axils in the upper part of the plant. Very poisonous - don’t eat! This rare plant grows from seed and from bulblets (vegetative reproduction). The white umbel flowers rarely make seed.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "cicuta_bulbifera_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p7_4.png",
      "cicuta_bulbifera_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p7_5.png",
      "cicuta_bulbifera_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p7_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892601/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/cicuta_bulbifera_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p7_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892602/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/cicuta_bulbifera_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p7_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892603/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/cicuta_bulbifera_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p7_6.png"
    ],
    "page_number": 7
  },
  {
    "guide_id": 1279,
    "species_id": "sp_15",
    "scientific_name": "Oxypolis rigidior",
    "common_name": "Cowbane",
    "family": "Apiaceae",
    "photo_date": "10-21-18",
    "description": "Shattering. Mama’s Boy. Another cousin of Cicuta, this species has larger seeds (5-6 mm long) that are papery and almost flat. Leaves are compound (divided only once). Ripe seeds are beige with black stripes in the center, and easily plucked by hand. Wet habitats, sun & shade.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "oxypolis_rigidior_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p7_7.png",
      "oxypolis_rigidior_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p7_8.png",
      "oxypolis_rigidior_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p7_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892667/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/oxypolis_rigidior_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p7_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892668/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/oxypolis_rigidior_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p7_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892668/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/oxypolis_rigidior_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p7_9.png"
    ],
    "page_number": 7
  },
  {
    "guide_id": 1279,
    "species_id": "sp_16",
    "scientific_name": "Epilobium ciliatum",
    "common_name": "Northern Willowherb",
    "family": "Onagraceae",
    "photo_date": "9-26-18",
    "description": "Fluffy. Willowherbs have delicate white or pink flowers. A long skinny capsule splits to release tiny seeds on long hairs. E. ciliatum & E. coloratum both have leaves with serrated edges; E. ciliatum has little nubs instead of full teeth and the leaf margin between the nubs is relatively straight (E. coloratum margins curve between teeth). Collect open capsules. Annual or short-lived perennial, collect 10%",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "epilobium_ciliatum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p8_1.png",
      "epilobium_ciliatum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p8_2.png",
      "epilobium_ciliatum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p8_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892611/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/epilobium_ciliatum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p8_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892612/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/epilobium_ciliatum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p8_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892612/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/epilobium_ciliatum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p8_3.png"
    ],
    "page_number": 8
  },
  {
    "guide_id": 1279,
    "species_id": "sp_17",
    "scientific_name": "Epilobium coloratum",
    "common_name": "Cinnamon Willowherb",
    "family": "Onagraceae",
    "photo_date": "10-9-18",
    "description": "Fluffy. Fluffy seeds are contained within a 4-parted capsule. Cinnamon gets its name from the cinnamon-colored fluff; E. ciliatum has white fluff. Both species have stems that are hairless or may have lines of hairs. Annual or short-lived perennial, collect 10%.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "epilobium_coloratum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p8_4.png",
      "epilobium_coloratum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p8_5.png",
      "epilobium_coloratum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p8_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892613/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/epilobium_coloratum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p8_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892614/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/epilobium_coloratum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p8_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892614/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/epilobium_coloratum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p8_6.png"
    ],
    "page_number": 8
  },
  {
    "guide_id": 1279,
    "species_id": "sp_18",
    "scientific_name": "Bidens trichosperma",
    "common_name": "Tall Swamp Marigold",
    "family": "Asteraceae",
    "photo_date": "9-25-20",
    "description": "Crumbly Coneheads. Many of the Bidens species are common, pioneering species that quickly fill openings in wet habitats. This one has the distinction of a high conservative value (C = 8). Leaves are divided, blooms with yellow rays. Seeds are elongated triangles, with bristlyhairy edges (“trichosperma” means hairy seed). Seed awns lack the barbs of its hitchhiking sisters. Compare outer phyllaries to confirm ID.",
    "seed_group_names": [
      "Coneheads"
    ],
    "seed_group_details": [
      {
        "name": "Coneheads",
        "images": [
          "Coneheads_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Coneheads are flowers with a cone-shaped center. Imagine these flowers without their colorful parts, and you know exactly what they look like when seeds are ripe."
      }
    ],
    "image_filenames": [
      "bidens_trichosperma_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p8_7.png",
      "bidens_trichosperma_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p8_8.png",
      "bidens_trichosperma_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p8_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892594/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/bidens_trichosperma_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p8_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892594/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/bidens_trichosperma_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p8_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892595/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/bidens_trichosperma_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p8_9.png"
    ],
    "page_number": 8
  },
  {
    "guide_id": 1279,
    "species_id": "sp_19",
    "scientific_name": "Boltonia asteroides",
    "common_name": "False Aster",
    "family": "Asteraceae",
    "photo_date": "9-27-17",
    "description": "Coneheads. In flower, this looks like an aster or a tall fleabane, but the seeds are clearly very different. Collect when easily crumbles by hand. Rhizomatous, can be locally aggressive; best used in wetlands with other aggressive species. Great for insects & pollinators.",
    "seed_group_names": [
      "Coneheads"
    ],
    "seed_group_details": [
      {
        "name": "Coneheads",
        "images": [
          "Coneheads_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Coneheads are flowers with a cone-shaped center. Imagine these flowers without their colorful parts, and you know exactly what they look like when seeds are ripe."
      }
    ],
    "image_filenames": [
      "boltonia_asteroides_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p9_1.png",
      "boltonia_asteroides_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p9_2.png",
      "boltonia_asteroides_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p9_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892598/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/boltonia_asteroides_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p9_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892598/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/boltonia_asteroides_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p9_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892599/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/boltonia_asteroides_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p9_3.png"
    ],
    "page_number": 9
  },
  {
    "guide_id": 1279,
    "species_id": "sp_20",
    "scientific_name": "Lobelia cardinalis",
    "common_name": "Cardinal Flower",
    "family": "Lobeliaceae",
    "photo_date": "9-27-17",
    "description": "Beaks. The bold red flowers make this species a favorite of hummingbirds & humans alike. Far more subtle in seed, look for light brown capsules that open with 2 chambers (like a pig nose). All Lobelia species have tiny seeds: 500,000 - 900,000 seeds/ounce.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "lobelia_cardinalis_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p9_4.png",
      "lobelia_cardinalis_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p9_5.png",
      "lobelia_cardinalis_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p9_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892642/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/lobelia_cardinalis_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p9_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892643/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/lobelia_cardinalis_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p9_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892644/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/lobelia_cardinalis_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p9_6.png"
    ],
    "page_number": 9
  },
  {
    "guide_id": 1279,
    "species_id": "sp_21",
    "scientific_name": "Lobelia siphilitica",
    "common_name": "Great Blue Lobelia",
    "family": "Lobeliaceae",
    "photo_date": "10-3-17",
    "description": "Beaks. L. siphilitica & L. cardinalis are tough to tell apart after flowering, and they can grow side by side. Examine the calyx (green bracts behind the flower): L. cardinalis has skinny, needle-like spikes that abruptly stop, making almost a right angle. L. siphilitica bracts widen at the base like shoulders, and are hairier; hairs on pedicels (flower stalks) are longer. This species was once thought to cure syphilis (it doesn’t).",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "lobelia_siphilitica_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p9_7.png",
      "lobelia_siphilitica_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p9_8.png",
      "lobelia_siphilitica_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p9_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892644/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/lobelia_siphilitica_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p9_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892645/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/lobelia_siphilitica_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p9_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892646/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/lobelia_siphilitica_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p9_9.png"
    ],
    "page_number": 9
  },
  {
    "guide_id": 1279,
    "species_id": "sp_22",
    "scientific_name": "Mimulus ringens",
    "common_name": "Monkey Flower",
    "family": "Scrophulariaceae",
    "photo_date": "9-27-17",
    "description": "Beaks. Royal purple flowers that look like a monkey’s face (if you squint. Really hard). Oval capsules form inside the pointed calyx. Collect brown capsules, the teeny tiny seeds (2,300,000 seeds per ounce!) will easily fall out when ripe.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "mimulus_ringens_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p10_1.png",
      "mimulus_ringens_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p10_2.png",
      "mimulus_ringens_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p10_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892662/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/mimulus_ringens_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p10_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892662/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/mimulus_ringens_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p10_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892663/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/mimulus_ringens_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p10_3.png"
    ],
    "page_number": 10
  },
  {
    "guide_id": 1279,
    "species_id": "sp_23",
    "scientific_name": "Penthorum sedoides",
    "common_name": "Ditch Stonecrop",
    "family": "Penthoraceae",
    "photo_date": "9-27-17",
    "description": "Beaks. This short wetland plant with an unattractive name has cute little white flowers on branching octopus arms, followed by capsules full of teeny tiny seed (1,300,000/oz). Collect crumbly capsules, which can be pink or brown. Only member of the genus.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "penthorum_sedoides_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p10_4.png",
      "penthorum_sedoides_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p10_5.png",
      "penthorum_sedoides_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p10_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892669/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/penthorum_sedoides_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p10_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892669/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/penthorum_sedoides_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p10_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892670/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/penthorum_sedoides_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p10_6.png"
    ],
    "page_number": 10
  },
  {
    "guide_id": 1279,
    "species_id": "sp_24",
    "scientific_name": "Physostegia speciosa",
    "common_name": "Showy Obedient Plant",
    "family": "Lamiaceae",
    "photo_date": "9-27-17",
    "description": "Shakers. Mama’s Boy. Similar to the other obedient plant species, but leaves are bigger & broader (usually 2.3cm or wider) and the teeth are more coarse (more than 2 mm deep on the short side). This species is more likely in shady places than its sisters.",
    "seed_group_names": [
      "Shakers"
    ],
    "seed_group_details": [
      {
        "name": "Shakers",
        "images": [
          "Shakers_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Shakers drop seeds very close to the mother plant, when shaken loose by the wind or a passing critter. Usually a Mama’s Boy, unless strong weather occurs."
      }
    ],
    "image_filenames": [
      "physostegia_speciosa_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p10_7.png",
      "physostegia_speciosa_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p10_8.png",
      "physostegia_speciosa_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p10_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892676/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/physostegia_speciosa_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p10_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892677/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/physostegia_speciosa_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p10_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892678/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/physostegia_speciosa_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p10_9.png"
    ],
    "page_number": 10
  },
  {
    "guide_id": 1279,
    "species_id": "sp_25",
    "scientific_name": "Proserpinaca palustris",
    "common_name": "Mermaid Weed",
    "family": "Haloragidaceae",
    "photo_date": "9-27-17",
    "description": "Shattering. This species likes marshes and is often found in the muddy flats after the water recedes. Upper leaves are linear with serrated edges; submersed leaves are feathery, resembling seaweeds. Seeds are chunky and are easily plucked when ripe.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "proserpinaca_palustris_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p11_1.png",
      "proserpinaca_palustris_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p11_2.png",
      "proserpinaca_palustris_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p11_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892682/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/proserpinaca_palustris_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p11_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892683/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/proserpinaca_palustris_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p11_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892683/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/proserpinaca_palustris_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p11_3.png"
    ],
    "page_number": 11
  },
  {
    "guide_id": 1279,
    "species_id": "sp_26",
    "scientific_name": "Pycnanthemum virginianum",
    "common_name": "Common Mountain Mint",
    "family": "Lamiaceae",
    "photo_date": "9-27-17",
    "description": "Shakers. The first Pycnanthemum species was named in the mountains; our species carry over the English name despite our flatlander habitats. This common species happily lives from dry-mesic to wet conditions & supports a wide variety of pollinators. Look for grayish heads; tip them into your hand & seeds will easily spill out of the clustered tubes when ripe. Smells lovely!",
    "seed_group_names": [
      "Shakers"
    ],
    "seed_group_details": [
      {
        "name": "Shakers",
        "images": [
          "Shakers_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Shakers drop seeds very close to the mother plant, when shaken loose by the wind or a passing critter. Usually a Mama’s Boy, unless strong weather occurs."
      }
    ],
    "image_filenames": [
      "pycnanthemum_virginianum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p11_4.png",
      "pycnanthemum_virginianum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p11_5.png",
      "pycnanthemum_virginianum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p11_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892684/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/pycnanthemum_virginianum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p11_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892684/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/pycnanthemum_virginianum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p11_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892685/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/pycnanthemum_virginianum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p11_6.png"
    ],
    "page_number": 11
  },
  {
    "guide_id": 1279,
    "species_id": "sp_27",
    "scientific_name": "Silphium perfoliatum",
    "common_name": "Cup Plant",
    "family": "Asteraceae",
    "photo_date": "9-27-17",
    "description": "Coneheads. S. perfoliatum is well named, with its perfoliate leaves (stem perforates the leaves) that cup & hold water. Like all Silphium, collect brown heads. Note the seeds are sandwiched between the outer sandpapery bracts & the skinny inner florets.",
    "seed_group_names": [
      "Coneheads"
    ],
    "seed_group_details": [
      {
        "name": "Coneheads",
        "images": [
          "Coneheads_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Coneheads are flowers with a cone-shaped center. Imagine these flowers without their colorful parts, and you know exactly what they look like when seeds are ripe."
      }
    ],
    "image_filenames": [
      "silphium_perfoliatum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p11_7.png",
      "silphium_perfoliatum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p11_8.png",
      "silphium_perfoliatum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p11_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892700/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/silphium_perfoliatum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p11_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892701/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/silphium_perfoliatum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p11_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892702/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/silphium_perfoliatum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p11_9.png"
    ],
    "page_number": 11
  },
  {
    "guide_id": 1279,
    "species_id": "sp_28",
    "scientific_name": "Sagittaria brevirostra",
    "common_name": "Short-beaked Arrowhead",
    "family": "Alismataceae",
    "photo_date": "9-27-17",
    "description": "Crumbly Coneheads. Arrow-shaped leaves. Contrary to the name, the beak is longer than many in the region. Bright white flowers. Seeds are ripe when brown & easily crumble by hand. This species has a long, curved beak on the seed (longer than 0.3 mm long, up to 1.5 mm long); the opposite side of the seed is rounded with subtle, broad teeth and/or waviness.",
    "seed_group_names": [
      "Coneheads"
    ],
    "seed_group_details": [
      {
        "name": "Coneheads",
        "images": [
          "Coneheads_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Coneheads are flowers with a cone-shaped center. Imagine these flowers without their colorful parts, and you know exactly what they look like when seeds are ripe."
      }
    ],
    "image_filenames": [
      "sagittaria_brevirostra_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p12_1.png",
      "sagittaria_brevirostra_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p12_2.png",
      "sagittaria_brevirostra_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p12_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892689/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/sagittaria_brevirostra_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p12_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892689/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/sagittaria_brevirostra_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p12_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892690/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/sagittaria_brevirostra_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p12_3.png"
    ],
    "page_number": 12
  },
  {
    "guide_id": 1279,
    "species_id": "sp_29",
    "scientific_name": "Sagittaria latifolia",
    "common_name": "Common Arrowhead",
    "family": "Alismataceae",
    "photo_date": "10-4-20",
    "description": "Crumbly coneheads. The most common of the arrowhead species. The leaves are arrow-shaped, with variation in their width and angles. Leafy bracts, located where flowering petioles meet the stem, are 1 cm or shorter. Seed beaks form a strong right angle. Collect when crumbles easily by hand.",
    "seed_group_names": [
      "Beaks",
      "Coneheads"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      },
      {
        "name": "Coneheads",
        "images": [
          "Coneheads_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Coneheads are flowers with a cone-shaped center. Imagine these flowers without their colorful parts, and you know exactly what they look like when seeds are ripe."
      }
    ],
    "image_filenames": [
      "sagittaria_latifolia_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p12_4.png",
      "sagittaria_latifolia_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p12_5.png",
      "sagittaria_latifolia_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p12_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892691/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/sagittaria_latifolia_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p12_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892692/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/sagittaria_latifolia_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p12_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892693/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/sagittaria_latifolia_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p12_6.png"
    ],
    "page_number": 12
  },
  {
    "guide_id": 1279,
    "species_id": "sp_30",
    "scientific_name": "Vernonia fasciculata",
    "common_name": "Common Ironweed",
    "family": "Asteraceae",
    "photo_date": "9-27-17",
    "description": "Fluffy. Found throughout the region, this species has hairless leaves; stems are hairless (glabrous) or nearly so. Bright hot purple-pink flowers turn to rusty-brown poofs. Collect when fluffy. It has been given a boost in Flora, C = 8 (formerly 5). Possibly named for the irontough stem, or for the rusty pappus color.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "vernonia_fasciculata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p12_7.png",
      "vernonia_fasciculata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p12_8.png",
      "vernonia_fasciculata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p12_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892717/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/vernonia_fasciculata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p12_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892718/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/vernonia_fasciculata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p12_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892718/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/vernonia_fasciculata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p12_9.png"
    ],
    "page_number": 12
  },
  {
    "guide_id": 1279,
    "species_id": "sp_31",
    "scientific_name": "Urtica gracilis",
    "common_name": "Tall Nettle",
    "family": "Urticaceae",
    "photo_date": "9-28-18",
    "description": "Beaks. This species has opposite leaves, with a lance-like shape (usually 3x long as wide, or longer). Other nettles in the region have fatter leaves or alternate leaves. Butterflies, moths, and other insects like it. Common in moist areas and one of the stinging species. The sting eases in hours, faster if you wash up. The sap of jewelweed, which often grows nearby, can also be used to ease the sting. Rarely needs collecting.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "urtica_gracilis_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p13_1.png",
      "urtica_gracilis_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p13_2.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892712/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/urtica_gracilis_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p13_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892713/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/urtica_gracilis_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p13_2.png"
    ],
    "page_number": 13
  },
  {
    "guide_id": 1279,
    "species_id": "sp_32",
    "scientific_name": "Gentiana andrewsii",
    "common_name": "Closed Gentian",
    "family": "Gentianaceae",
    "photo_date": "9-28-18, 10-14-18",
    "description": "Beaks. These late season blooms go from bright blue, to plum purple, to paper bag brown. Plump duck bills are full of tiny “fried egg” seeds. Collect open beaks. Hard to ID from G. alba at harvest time; this species has small ragged serrations at the top of the papery shell; G. alba has chunkier teeth. This species is slightly more likely in wetter habitats, but they can grow together. See the Fall Prairie Forbs Guide.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "gentiana_andrewsii_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p13_3.png",
      "gentiana_andrewsii_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p13_4.png",
      "gentiana_andrewsii_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p13_5.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892618/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/gentiana_andrewsii_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p13_3.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892619/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/gentiana_andrewsii_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p13_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892620/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/gentiana_andrewsii_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p13_5.png"
    ],
    "page_number": 13
  },
  {
    "guide_id": 1279,
    "species_id": "sp_33",
    "scientific_name": "Gentianopsis crinita",
    "common_name": "Fringed Gentian",
    "family": "Gentianaceae",
    "photo_date": "10-9-19",
    "description": "Beaks. Like its Gentiana & Gentianella cousins, this species forms a long duck billed capsule full of tiny seeds. Lives as an annual/biennial, collect 10%. Seeds are bristly. Flowers are pretty, fringed blue-purple. G. virgata is a smaller species; upper leaves are slender & linear.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "gentianopsis_crinita_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p13_6.png",
      "gentianopsis_crinita_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p13_7.png",
      "gentianopsis_crinita_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p13_8.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892621/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/gentianopsis_crinita_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p13_6.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892621/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/gentianopsis_crinita_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p13_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892622/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/gentianopsis_crinita_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p13_8.png"
    ],
    "page_number": 13
  },
  {
    "guide_id": 1279,
    "species_id": "sp_34",
    "scientific_name": "Echinocystis lobata",
    "common_name": "Wild Cucumber",
    "family": "Cucurbitaceae",
    "photo_date": "9-30-17",
    "description": "Beaks. Echinocystis means “spiny bladder” an appropriate name for the fruit! A non-edible green fruit that dries to an airy shell and opens at the base to release seeds. Annual, collect 10%. Likes wet communities with partial to full sun, and something to climb.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "echinocystis_lobata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p14_1.png",
      "echinocystis_lobata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p14_2.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892609/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/echinocystis_lobata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p14_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892609/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/echinocystis_lobata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p14_2.png"
    ],
    "page_number": 14
  },
  {
    "guide_id": 1279,
    "species_id": "sp_35",
    "scientific_name": "Eutrochium maculatum",
    "common_name": "Spotted Joe Pye Weed",
    "family": "Asteraceae",
    "photo_date": "9-30-19",
    "description": "Fluffy. Mama’s Boy. This perennial has big heads of brown fluffy seeds. Flat-topped heads. Stems are purple or purple-spotted throughout; E. purpureum (its woodland sister) has stems that are purple at the axils only, or all green. When in doubt: label seed with the habitat.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "eutrochium_maculatum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p14_3.png",
      "eutrochium_maculatum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p14_4.png",
      "eutrochium_maculatum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p14_5.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892616/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/eutrochium_maculatum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p14_3.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892617/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/eutrochium_maculatum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p14_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892618/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/eutrochium_maculatum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p14_5.png"
    ],
    "page_number": 14
  },
  {
    "guide_id": 1279,
    "species_id": "sp_36",
    "scientific_name": "Lilium michiganense",
    "common_name": "Michigan Lily",
    "family": "Liliaceae",
    "photo_date": "9-30-20",
    "description": "Beaks. Stunning orange lily, 6 reflexed petals resemble a turban. Sometimes called Turks Cap, but technically refers to L. superbum; most publications define that species a southern native. Leaves arranged in a whorl around the stem. Bronze capsule opens in 3 parts, revealing 6 columns of delicate papery seeds. 2 years for seeds to germinate in the wild, and can be another 5 years before flowering. Deer candy.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "lilium_michiganense_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p14_6.png",
      "lilium_michiganense_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p14_7.png",
      "lilium_michiganense_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p14_8.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892641/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/lilium_michiganense_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p14_6.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892641/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/lilium_michiganense_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p14_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892642/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/lilium_michiganense_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p14_8.png"
    ],
    "page_number": 14
  },
  {
    "guide_id": 1279,
    "species_id": "sp_37",
    "scientific_name": "Agalinis skinneriana",
    "common_name": "Pale False Foxglove",
    "family": "Orobanchaceae",
    "photo_date": "10-3-18",
    "description": "Beaks. Agalinis species are hemi-parasitic with graminoid hosts. Hot pink flowers. Pedicels (flower stems) are typically more than 6 mm long. Plant specimens remain light colored after drying (does not blacken), seeds are light brown, calyx is net veined. Annual, collect 10%",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "agalinis_skinneriana_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p15_1.png",
      "agalinis_skinneriana_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p15_2.png",
      "agalinis_skinneriana_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p15_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892589/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/agalinis_skinneriana_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p15_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892590/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/agalinis_skinneriana_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p15_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892590/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/agalinis_skinneriana_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p15_3.png"
    ],
    "page_number": 15
  },
  {
    "guide_id": 1279,
    "species_id": "sp_38",
    "scientific_name": "Agalinis paupercula",
    "common_name": "Pauper False Foxglove",
    "family": "Orobanchaceae",
    "photo_date": "9-17-20, 10-3-20",
    "description": "Beaks. Fuchsia flowers are less than 2 cm long, leaves are linear. Calyx (greenery behind the flower/brown cup around seed pod) is about the same length as the pedicel (flower stalk). Calyx is papery and slowly turns black as the specimen dries. Collect open beaks.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "agalinis_paupercula_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p15_4.png",
      "agalinis_paupercula_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p15_5.png",
      "agalinis_paupercula_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p15_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892587/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/agalinis_paupercula_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p15_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892588/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/agalinis_paupercula_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p15_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892589/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/agalinis_paupercula_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p15_6.png"
    ],
    "page_number": 15
  },
  {
    "guide_id": 1279,
    "species_id": "sp_39",
    "scientific_name": "Spiranthes cernua",
    "common_name": "Nodding Lady’s Tresses",
    "family": "Orchidaceae",
    "photo_date": "9-12-18, 10-3-18",
    "description": "Beaks. Lady’s tresses are ‘common’ native orchids. Blooms are arranged in double spirals up the short stalk, popping up to bloom in fall. Spiranthes are tough to ID; examine flower lips, sepals, sheaths, and presence/absence of leaves at flowering time. Orchids will not germinate without a specific fungus; collect & sow thoughtfully. Seeds are dust-like, note the image above shows mm markings!",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "spiranthes_cernua_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p15_7.png",
      "spiranthes_cernua_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p15_8.png",
      "spiranthes_cernua_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p15_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892703/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/spiranthes_cernua_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p15_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892704/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/spiranthes_cernua_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p15_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892705/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/spiranthes_cernua_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p15_9.png"
    ],
    "page_number": 15
  },
  {
    "guide_id": 1279,
    "species_id": "sp_40",
    "scientific_name": "Lythrum alatum",
    "common_name": "Winged Loosestrife",
    "family": "Lythraceae",
    "photo_date": "10-3-20",
    "description": "Shakers. Aka “good purple loosestrife.” Like many native species with non-native bullies for sisters, this species is more subtle, with fewer flowers, fewer seeds, and is less common. This species has ridged (“winged”) stems, smaller leaves (often 1-2 cm long, up to 4 cm), alternate or subopposite. 1-2 flowers per axil (1-2 seed tubes). Collect when calyx is brown/burgundy; capsule inside holds dust-like seeds.",
    "seed_group_names": [
      "Shakers"
    ],
    "seed_group_details": [
      {
        "name": "Shakers",
        "images": [
          "Shakers_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Shakers drop seeds very close to the mother plant, when shaken loose by the wind or a passing critter. Usually a Mama’s Boy, unless strong weather occurs."
      }
    ],
    "image_filenames": [
      "lythrum_alatum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p16_1.png",
      "lythrum_alatum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p16_2.png",
      "lythrum_alatum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p16_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892654/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/lythrum_alatum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p16_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892655/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/lythrum_alatum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p16_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892656/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/lythrum_alatum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p16_3.png"
    ],
    "page_number": 16
  },
  {
    "guide_id": 1279,
    "species_id": "sp_41",
    "scientific_name": "Lythrum salicaria",
    "common_name": "Purple Loosestrife",
    "family": "Lythraceae",
    "photo_date": "10-18-19",
    "description": "Shakers. This pretty devil is invasive in wetlands across most of the county. A single mature plant annually produces 1-2 million seeds. The good winged loosestrife (L. alatum) is much smaller, fewer blossoms and fewer tubes of seed. L. salicaria has large leaves in opposite pairs or (rarely) whorls of 3. Leaves have unique veins: parallel to the edge and feather veins inside. Illegal to sell in IL, yet gardeners still plant it.",
    "seed_group_names": [
      "Shakers"
    ],
    "seed_group_details": [
      {
        "name": "Shakers",
        "images": [
          "Shakers_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Shakers drop seeds very close to the mother plant, when shaken loose by the wind or a passing critter. Usually a Mama’s Boy, unless strong weather occurs."
      }
    ],
    "image_filenames": [
      "lythrum_salicaria_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p16_4.png",
      "lythrum_salicaria_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p16_5.png",
      "lythrum_salicaria_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p16_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892657/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/lythrum_salicaria_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p16_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892657/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/lythrum_salicaria_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p16_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892659/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/lythrum_salicaria_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p16_6.png"
    ],
    "page_number": 16
  },
  {
    "guide_id": 1279,
    "species_id": "sp_42",
    "scientific_name": "Stachys hispida",
    "common_name": "Marsh Hedge Nettle",
    "family": "Lamiaceae",
    "photo_date": "10-6-20",
    "description": "Shakers. Serrated paired leaves. Square stems have hairs on the angles, not the faces. Calyx is bristly-hairy on the angles, with wispier hairs on the lobes. Flowers are pink to lavender with white. Formerly a variety, now elevated to its own species.",
    "seed_group_names": [
      "Shakers"
    ],
    "seed_group_details": [
      {
        "name": "Shakers",
        "images": [
          "Shakers_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Shakers drop seeds very close to the mother plant, when shaken loose by the wind or a passing critter. Usually a Mama’s Boy, unless strong weather occurs."
      }
    ],
    "image_filenames": [
      "stachys_hispida_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p16_7.png",
      "stachys_hispida_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p16_8.png",
      "stachys_hispida_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p16_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892706/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/stachys_hispida_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p16_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892706/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/stachys_hispida_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p16_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892707/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/stachys_hispida_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p16_9.png"
    ],
    "page_number": 16
  },
  {
    "guide_id": 1279,
    "species_id": "sp_43",
    "scientific_name": "Asclepias incarnata",
    "common_name": "Swamp Milkweed",
    "family": "Asclepiadaceae",
    "photo_date": "10-9-18",
    "description": "Milkweed. The bright pink flowers become finger-wide pods. The primary milkweed in wetlands. It is hard to mistake this species, unless handed a bag of pods. Similar sized pods to A. tuberosa, but those pods have peach fuzz and A. incarnata has smooth pods.",
    "seed_group_names": [
      "Milkweed"
    ],
    "seed_group_details": [
      {
        "name": "Milkweed",
        "images": [
          "Milkweed_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Milkweed seeds are ripe when pods are split open & seeds are brown."
      }
    ],
    "image_filenames": [
      "asclepias_incarnata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p17_1.png",
      "asclepias_incarnata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p17_2.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892593/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/asclepias_incarnata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p17_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892593/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/asclepias_incarnata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p17_2.png"
    ],
    "page_number": 17
  },
  {
    "guide_id": 1279,
    "species_id": "sp_44",
    "scientific_name": "Cirsium muticum",
    "common_name": "Fen Thistle",
    "family": "Asteraceae",
    "photo_date": "10-9-19",
    "description": "Fluffy. A tall native thistle. Mature leaves are green above & below. Vibrant purple-pink flowers, loves moist prairies & fens. Lacks the painful spikes on the phyllaries (the bracts forming the cup under the fluff). Biennial, collect 10%. Native thistles are loved by insects & birds, without the obnoxious behavior of their invasive siblings.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "cirsium_muticum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p17_3.png",
      "cirsium_muticum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p17_4.png",
      "cirsium_muticum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p17_5.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892605/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/cirsium_muticum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p17_3.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892606/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/cirsium_muticum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p17_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892606/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/cirsium_muticum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p17_5.png"
    ],
    "page_number": 17
  },
  {
    "guide_id": 1279,
    "species_id": "sp_45",
    "scientific_name": "Nuphar advena",
    "common_name": "Yellow Pond Lily",
    "family": "Nymphaeaceae",
    "photo_date": "10-9-20",
    "description": "Berries. Found in ponds and muddy edges, these yellow-flowering pond lilies generally keep their leaves and flowers above the water. Leaves are elliptical (rather than perfectly round, like white lilies, Nymphaea). The Pac-Man mouth of the lily pad opens wide. Pods are similar to Podophyllum; starting green & firm, but softening and becoming green-yellow as they ripen. Also called Spatterdock.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "nuphar_advena_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p17_6.png",
      "nuphar_advena_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p17_7.png",
      "nuphar_advena_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p17_8.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892663/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/nuphar_advena_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p17_6.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892664/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/nuphar_advena_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p17_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892666/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/nuphar_advena_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p17_8.png"
    ],
    "page_number": 17
  },
  {
    "guide_id": 1279,
    "species_id": "sp_46",
    "scientific_name": "Boehmeria cylindrica",
    "common_name": "Swamp False Nettle",
    "family": "Urticaceae",
    "photo_date": "8-14-20, 10-11-20",
    "description": "Shattering. Related to the stinging nettles, but without the sting! Found in many wet to wet-mesic habitats. Opposite, ovate leaves; stems are not translucent. Food for caterpillars of several native butterflies. Var. drummondiana has shorter petioles and leaves typically folded in half along the main vein.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "boehmeria_cylindrica_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p18_1.png",
      "boehmeria_cylindrica_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p18_2.png",
      "boehmeria_cylindrica_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p18_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892596/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/boehmeria_cylindrica_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p18_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892596/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/boehmeria_cylindrica_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p18_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892597/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/boehmeria_cylindrica_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p18_3.png"
    ],
    "page_number": 18
  },
  {
    "guide_id": 1279,
    "species_id": "sp_47",
    "scientific_name": "Persicaria hydropiperoides",
    "common_name": "Mild Water Pepper",
    "family": "Polygonaceae",
    "photo_date": "10-11-18",
    "description": "Shattering. Mama’s Boy. The water pepper/smart weed group is challenging to ID. Look at the broad sheaths wrapping the stem joints (ocrea) and similar sheaths in the floral spikes (ocreola). Narrow down the ID with flower color & arrangement, cilia (fringes on edges), and hairs.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "persicaria_hydropiperoides_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p18_4.png",
      "persicaria_hydropiperoides_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p18_5.png",
      "persicaria_hydropiperoides_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p18_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892671/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/persicaria_hydropiperoides_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p18_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892671/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/persicaria_hydropiperoides_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p18_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892672/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/persicaria_hydropiperoides_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p18_6.png"
    ],
    "page_number": 18
  },
  {
    "guide_id": 1279,
    "species_id": "sp_48",
    "scientific_name": "Persicaria punctata",
    "common_name": "Water Pepper",
    "family": "Polygonaceae",
    "photo_date": "10-21-18",
    "description": "Shattering. Mama’s Boy. The green calyx surrounding the seeds (and the base of the flower) is dotted (“punctate”). Common in wetlands. Collect Persicaria when the seeds are dark. Removing the green calyx is not necessary for sowing, but it’s a good check for ripeness.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "persicaria_punctata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p18_7.png",
      "persicaria_punctata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p18_8.png",
      "persicaria_punctata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p18_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892673/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/persicaria_punctata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p18_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892674/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/persicaria_punctata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p18_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892674/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/persicaria_punctata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p18_9.png"
    ],
    "page_number": 18
  },
  {
    "guide_id": 1279,
    "species_id": "sp_49",
    "scientific_name": "Eupatorium perfoliatum",
    "common_name": "Common Boneset",
    "family": "Asteraceae",
    "photo_date": "10-11-18",
    "description": "Fluffy. The perfoliate leaves encasing the stem were historically taken as a divine sign that this plant could set bones. White flowers ripen to dark seeds with white pappus (fluff); sometimes brown dried florets remain attached. Collect when poofy. Great for pollinators.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "eupatorium_perfoliatum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p19_1.png",
      "eupatorium_perfoliatum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p19_2.png",
      "eupatorium_perfoliatum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p19_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892615/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/eupatorium_perfoliatum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p19_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892615/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/eupatorium_perfoliatum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p19_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892616/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/eupatorium_perfoliatum_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p19_3.png"
    ],
    "page_number": 19
  },
  {
    "guide_id": 1279,
    "species_id": "sp_50",
    "scientific_name": "Phyla lanceolata",
    "common_name": "Fog Fruit",
    "family": "Verbenaceae",
    "photo_date": "10-13-20",
    "description": "Shakers. Found in muddy edges of ponds & streams, this plant likes low-competition areas. Flowers resemble its Verbena cousins, but typically in shades of pink and white. Leaves are lance-like (“lanceolata”). Flora notes a western species that was spotted once in Porter Co, IN, with leaves less than 1cm wide and teeth only at the tip.",
    "seed_group_names": [
      "Shakers"
    ],
    "seed_group_details": [
      {
        "name": "Shakers",
        "images": [
          "Shakers_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Shakers drop seeds very close to the mother plant, when shaken loose by the wind or a passing critter. Usually a Mama’s Boy, unless strong weather occurs."
      }
    ],
    "image_filenames": [
      "phyla_lanceolata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p19_4.png",
      "phyla_lanceolata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p19_5.png",
      "phyla_lanceolata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p19_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892675/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/phyla_lanceolata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p19_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892675/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/phyla_lanceolata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p19_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892676/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/phyla_lanceolata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p19_6.png"
    ],
    "page_number": 19
  },
  {
    "guide_id": 1279,
    "species_id": "sp_51",
    "scientific_name": "Prenanthes racemosa",
    "common_name": "Smooth Prairie Lettuce",
    "family": "Asteraceae",
    "photo_date": "10-13-18",
    "description": "Fluffy. One of two Prenanthes found in prairies, this species has smooth lower stems. Blooms are pinkish (P. aspera has creamy flowers). Both species have honey colored pappus (seed fluff). This species prefers moist prairies & fens. Collect 10% (biennial/short-lived perennial).",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "prenanthes_racemosa_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p19_7.png",
      "prenanthes_racemosa_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p19_8.png",
      "prenanthes_racemosa_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p19_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892681/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/prenanthes_racemosa_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p19_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892681/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/prenanthes_racemosa_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p19_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892682/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/prenanthes_racemosa_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p19_9.png"
    ],
    "page_number": 19
  },
  {
    "guide_id": 1279,
    "species_id": "sp_52",
    "scientific_name": "Lycopus uniflorus",
    "common_name": "Northern Bugleweed",
    "family": "Lamiaceae",
    "photo_date": "10-21-17",
    "description": "Shattering. The bugleweed/horehound species can be tricky to ID. They resemble wild mint (Mentha) but without the minty odor. In seed: look at the length of the spiky calyx lobes relative to seed; this species has lobes shorter than the seed. Four nutlets sit together in each cup, the combined surface of the 4 is warty but the outer ridge is slightly higher. Collect when brown. Seeds often have shiny oil droplets.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "lycopus_uniflorus_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p20_1.png",
      "lycopus_uniflorus_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p20_2.png",
      "lycopus_uniflorus_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p20_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892650/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/lycopus_uniflorus_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p20_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892651/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/lycopus_uniflorus_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p20_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892652/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/lycopus_uniflorus_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p20_3.png"
    ],
    "page_number": 20
  },
  {
    "guide_id": 1279,
    "species_id": "sp_53",
    "scientific_name": "Lycopus rubellus",
    "common_name": "Stalked Water Horehound",
    "family": "Lamiaceae",
    "photo_date": "10-16-17",
    "description": "Shattering. This rare species has calyx lobes longer than the seed, and the surface of the 4 combined seeds is wavy and uneven. Both L. rubellus & L. uniflorus can also spread by stolons, which may be visible aboveground. The other species have underground rhizomes.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "lycopus_rubellus_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p20_4.png",
      "lycopus_rubellus_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p20_5.png",
      "lycopus_rubellus_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p20_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892648/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/lycopus_rubellus_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p20_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892649/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/lycopus_rubellus_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p20_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892650/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/lycopus_rubellus_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p20_6.png"
    ],
    "page_number": 20
  },
  {
    "guide_id": 1279,
    "species_id": "sp_54",
    "scientific_name": "Lycopus americanus",
    "common_name": "Common Water Horehound",
    "family": "Lamiaceae",
    "photo_date": "11-2-17",
    "description": "Shattering. This common species has skinnier leaves and the lobes are deeper fingers (more than just teeth). The 4 seeds create a flat surface with a ridged outer margin, and calyx lobes are longer than the seeds. Water horehounds were used for coughs, much like the similar looking Common Horehound (from Europe, Asia, & Africa). Old fashioned horehound candies made from the non-native species are still sold today.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "lycopus_americanus_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p20_7.png",
      "lycopus_americanus_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p20_8.png",
      "lycopus_americanus_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p20_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892646/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/lycopus_americanus_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p20_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892647/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/lycopus_americanus_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p20_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892647/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/lycopus_americanus_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p20_9.png"
    ],
    "page_number": 20
  },
  {
    "guide_id": 1279,
    "species_id": "sp_55",
    "scientific_name": "Mentha canadensis",
    "common_name": "Wild Mint",
    "family": "Lamiaceae",
    "photo_date": "10-21-18",
    "description": "Shakers. Similar to Lycopus¸ but leaves have a lovely minty smell. White flowers are clustered around the leaf axils, calyx (the cup) turns from green to brown, and seeds easily fall out when ripe. A refreshing wetland native.",
    "seed_group_names": [
      "Shakers"
    ],
    "seed_group_details": [
      {
        "name": "Shakers",
        "images": [
          "Shakers_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Shakers drop seeds very close to the mother plant, when shaken loose by the wind or a passing critter. Usually a Mama’s Boy, unless strong weather occurs."
      }
    ],
    "image_filenames": [
      "mentha_canadensis_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p21_1.png",
      "mentha_canadensis_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p21_2.png",
      "mentha_canadensis_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p21_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892660/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/mentha_canadensis_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p21_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892660/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/mentha_canadensis_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p21_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892661/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/mentha_canadensis_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p21_3.png"
    ],
    "page_number": 21
  },
  {
    "guide_id": 1279,
    "species_id": "sp_56",
    "scientific_name": "Pontederia cordata",
    "common_name": "Pickerelweed",
    "family": "Pontederiaceae",
    "photo_date": "10-21-20",
    "description": "Shattering. Spikes of royal purple flowers and leaves that are heart-shaped (“cordata”). Grows on pond edges. Seeds are arranged like tiny banana trees, green to brown. Seeds have a papery membrane (possibly to help dispersal by floating). Native Plants Journal indicates germination is best when sown in water, sown relatively fresh (0-3 months), and with the papery membrane removed. Spreads by rhizomes.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "pontederia_cordata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p21_4.png",
      "pontederia_cordata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p21_5.png",
      "pontederia_cordata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p21_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892679/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/pontederia_cordata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p21_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892680/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/pontederia_cordata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p21_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892680/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/pontederia_cordata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p21_6.png"
    ],
    "page_number": 21
  },
  {
    "guide_id": 1279,
    "species_id": "sp_57",
    "scientific_name": "Rumex orbiculatus",
    "common_name": "Great Water Dock",
    "family": "Polygonaceae",
    "photo_date": "10-21-20",
    "description": "Shattering. Most people know the weedy curly dock, but fewer people are aware there are several native Rumex. This is the biggest (“Great”) of the native species, with leaves 8-15 cm wide, 50-100 cm long. Identify Rumex by looking at the seed “tubercle” (grain) and “valve” (the papery wings around it). Some species have tubercles on every valve, some do not. Shape of the valve can be an indicator too.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "rumex_orbiculatus_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p21_7.png",
      "rumex_orbiculatus_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p21_8.png",
      "rumex_orbiculatus_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p21_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892687/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/rumex_orbiculatus_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p21_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892688/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/rumex_orbiculatus_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p21_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892688/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/rumex_orbiculatus_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p21_9.png"
    ],
    "page_number": 21
  },
  {
    "guide_id": 1279,
    "species_id": "sp_58",
    "scientific_name": "Triadenum fraseri",
    "common_name": "Marsh St. John’s Wort",
    "family": "Hypericaceae",
    "photo_date": "10-21-17",
    "description": "Beaks. Mama’s Boy. The pink-flowered St. John’s worts have been split from the yellow-flowering Hypericum. Both Triadenum species can be found in Lake Co. T. fraseri has shorter sepals (less than 5 mm long). T. virginicum has sepals about half the length of the capsule.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "triadenum_fraseri_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p22_1.png",
      "triadenum_fraseri_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p22_2.png",
      "triadenum_fraseri_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p22_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892709/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/triadenum_fraseri_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p22_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892710/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/triadenum_fraseri_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p22_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892711/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/triadenum_fraseri_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p22_3.png"
    ],
    "page_number": 22
  },
  {
    "guide_id": 1279,
    "species_id": "sp_59",
    "scientific_name": "Hypericum ascyron",
    "common_name": "Great St. John’s Wort",
    "family": "Hypericaceae",
    "photo_date": "10-24-19",
    "description": "Beaks. Mama’s Boy. Great big flowers (3+ cm across) and great big capsules (1+ cm long)! This plant is herbaceous, not woody. Grows in wet prairies, sedge meadows, and fens. Collect open capsules.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "hypericum_ascyron_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p22_4.png",
      "hypericum_ascyron_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p22_5.png",
      "hypericum_ascyron_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p22_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892628/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/hypericum_ascyron_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p22_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892629/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/hypericum_ascyron_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p22_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892630/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/hypericum_ascyron_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p22_6.png"
    ],
    "page_number": 22
  },
  {
    "guide_id": 1279,
    "species_id": "sp_60",
    "scientific_name": "Verbena hastata",
    "common_name": "Blue Vervain",
    "family": "Verbenaceae",
    "photo_date": "10-21-18",
    "description": "Shakers. Mama’s Boy. The purple-blue flowers are fantastic for pollinators. The closely spaced, slender brown spikes are hard to mistake, often a dozen per stalk. Calyces (cups) are tightly packed & overlap. Prefers wet prairies & sedge meadows.",
    "seed_group_names": [
      "Shakers"
    ],
    "seed_group_details": [
      {
        "name": "Shakers",
        "images": [
          "Shakers_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Shakers drop seeds very close to the mother plant, when shaken loose by the wind or a passing critter. Usually a Mama’s Boy, unless strong weather occurs."
      }
    ],
    "image_filenames": [
      "verbena_hastata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p22_7.png",
      "verbena_hastata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p22_8.png",
      "verbena_hastata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p22_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892713/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/verbena_hastata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p22_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892714/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/verbena_hastata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p22_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892714/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/verbena_hastata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p22_9.png"
    ],
    "page_number": 22
  },
  {
    "guide_id": 1279,
    "species_id": "sp_61",
    "scientific_name": "Rudbeckia laciniata",
    "common_name": "Wild Golden Glow",
    "family": "Asteraceae",
    "photo_date": "10-26-17",
    "description": "Coneheads. Mama’s Boy. This Rudbeckia is drastically different from its Susan sisters – much taller (up to 3m) with a green eye instead of black. Leaves have 3-7 deeply cut lobes; laciniata means cut, or lacerated. Snip brown heads.",
    "seed_group_names": [
      "Coneheads"
    ],
    "seed_group_details": [
      {
        "name": "Coneheads",
        "images": [
          "Coneheads_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Coneheads are flowers with a cone-shaped center. Imagine these flowers without their colorful parts, and you know exactly what they look like when seeds are ripe."
      }
    ],
    "image_filenames": [
      "rudbeckia_laciniata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p23_1.png",
      "rudbeckia_laciniata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p23_2.png",
      "rudbeckia_laciniata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p23_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892685/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/rudbeckia_laciniata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p23_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892686/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/rudbeckia_laciniata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p23_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892687/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/rudbeckia_laciniata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p23_3.png"
    ],
    "page_number": 23
  },
  {
    "guide_id": 1279,
    "species_id": "sp_62",
    "scientific_name": "Chelone glabra",
    "common_name": "Turtlehead",
    "family": "Scrophulariaceae",
    "photo_date": "10-29-17",
    "description": "Beaks. Reportedly named for the flower’s resemblance to a turtle’s head, but the seed capsule is arguably a better inspiration for the name. Capsules are initially green with a distinct closed mouth (seam), which splits and opens up. Seeds are small papery “fried eggs” and shake out on windy days. Important host plant for Baltimore Checkerspot butterflies.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "chelone_glabra_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p23_4.png",
      "chelone_glabra_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p23_5.png",
      "chelone_glabra_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p23_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892599/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/chelone_glabra_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p23_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892600/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/chelone_glabra_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p23_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892600/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/chelone_glabra_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p23_6.png"
    ],
    "page_number": 23
  },
  {
    "guide_id": 1279,
    "species_id": "sp_63",
    "scientific_name": "Helenium autumnale",
    "common_name": "Sneezeweed",
    "family": "Asteraceae",
    "photo_date": "11-2-17",
    "description": "Crumbly Coneheads. Ripe chocolate brown heads easily crumble by hand. Stems are winged. Common to see yellow (unripe) and ripe heads on the same plant. H. flexuosum (non-native) has brown “eyes.” Rare var. canaliculatum has extra-long leaves without any serrations. The straight species has serrations; leaves are less than 7 times as long as wide. This plant was used as snuff, to sneeze out evil spirits.",
    "seed_group_names": [
      "Coneheads"
    ],
    "seed_group_details": [
      {
        "name": "Coneheads",
        "images": [
          "Coneheads_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Coneheads are flowers with a cone-shaped center. Imagine these flowers without their colorful parts, and you know exactly what they look like when seeds are ripe."
      }
    ],
    "image_filenames": [
      "helenium_autumnale_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p23_7.png",
      "helenium_autumnale_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p23_8.png",
      "helenium_autumnale_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p23_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892622/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/helenium_autumnale_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p23_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892623/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/helenium_autumnale_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p23_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892624/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/helenium_autumnale_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p23_9.png"
    ],
    "page_number": 23
  },
  {
    "guide_id": 1279,
    "species_id": "sp_64",
    "scientific_name": "Liatris pycnostachya",
    "common_name": "Prairie Gay Feather",
    "family": "Asteraceae",
    "photo_date": "10-29-19",
    "description": "Fluffy. Easily confused with L. spicata: both species pack their flowers densely on a spike, both can grow in mesic & wet prairies. L. pycnostachya has hairy stems. Phyllaries (bracts behind the flower) are bent backwards during flowering; hard to judge at harvest time. Flora labels this species FACW.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "liatris_pycnostachya_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p24_1.png",
      "liatris_pycnostachya_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p24_2.png",
      "liatris_pycnostachya_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p24_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892635/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/liatris_pycnostachya_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p24_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892636/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/liatris_pycnostachya_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p24_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892636/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/liatris_pycnostachya_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p24_3.png"
    ],
    "page_number": 24
  },
  {
    "guide_id": 1279,
    "species_id": "sp_65",
    "scientific_name": "Liatris spicata",
    "common_name": "Marsh Gay Feather",
    "family": "Asteraceae",
    "photo_date": "11-4-19",
    "description": "Fluffy. Primarily in wetlands, but can also be found in mesic prairies and even dry-mesic prairies. Flora reclassified this species as FAC. Stems are hairless or a few sparse hairs. Check the phyllaries; during flowering time, these green floral bracts are pressed flat to the head.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "liatris_spicata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p24_4.png",
      "liatris_spicata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p24_5.png",
      "liatris_spicata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p24_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892638/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/liatris_spicata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p24_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892638/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/liatris_spicata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p24_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892640/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/liatris_spicata_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p24_6.png"
    ],
    "page_number": 24
  },
  {
    "guide_id": 1279,
    "species_id": "sp_66",
    "scientific_name": "Verbesina alternifolia",
    "common_name": "Wingstem",
    "family": "Asteraceae",
    "photo_date": "11-2-17",
    "description": "Crumbly Coneheads. This tall wildflower can be very aggressive – use only in areas where other natives are equally aggressive! Stems have wings and are fuzzy. Seeds look like little butterflies. Great for pollinators, reportedly attractive to the rusty patched bumblebee (but so are other native flowers).",
    "seed_group_names": [
      "Coneheads"
    ],
    "seed_group_details": [
      {
        "name": "Coneheads",
        "images": [
          "Coneheads_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_page1_img1.png"
        ],
        "description": "Coneheads are flowers with a cone-shaped center. Imagine these flowers without their colorful parts, and you know exactly what they look like when seeds are ripe."
      }
    ],
    "image_filenames": [
      "verbesina_alternifolia_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p25_1.png",
      "verbesina_alternifolia_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p25_2.png",
      "verbesina_alternifolia_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p25_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892715/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/verbesina_alternifolia_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p25_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892715/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/verbesina_alternifolia_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p25_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766892717/1279_usa_illinois_lakecounty_fallwetlandforbsv2_1/verbesina_alternifolia_1279_usa_illinois_lakecounty_fallwetlandforbsv2_1_p25_3.png"
    ],
    "page_number": 25
  },
  {
    "guide_id": 1280,
    "species_id": "sp_1",
    "scientific_name": "Carex pallescens",
    "common_name": "Pale Green Sedge",
    "family": "Cyperaceae",
    "photo_date": "8-26-20",
    "description": "A new record for the county, this rare species is similar to C. hirsutella. Both have hairy sheaths & leaves. This species has oval, glossy beakless perigynia, like little green river stones packed into a tight pine cone. Terminal spikelet is entirely staminate in this species. Found in a savanna edge near a railroad and in a prairie.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_pallescens_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p3_1.png",
      "carex_pallescens_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p3_2.png",
      "carex_pallescens_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p3_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896005/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/carex_pallescens_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p3_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896005/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/carex_pallescens_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p3_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896006/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/carex_pallescens_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p3_3.png"
    ],
    "page_number": 3
  },
  {
    "guide_id": 1280,
    "species_id": "sp_2",
    "scientific_name": "Carex crinita",
    "common_name": "Fringed Sedge",
    "family": "Cyperaceae",
    "photo_date": "9-2-17",
    "description": "This conservative species grows in wet to mesic woodlands and marshes. Seed spikes dangle, with long bristle-like scales giving a fringed appearance. Plants are tall (often 1.5 m), larger leaves can be 1 cm wide. Typically separate pistillate (female) and staminate (male) spikes.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_crinita_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p3_4.png",
      "carex_crinita_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p3_5.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766895992/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/carex_crinita_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p3_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766895993/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/carex_crinita_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p3_5.png"
    ],
    "page_number": 3
  },
  {
    "guide_id": 1280,
    "species_id": "sp_3",
    "scientific_name": "Carex utriculata",
    "common_name": "Common Yellow Lake Sedge",
    "family": "Cyperaceae",
    "photo_date": "9-16-20",
    "description": "A hairless Carex, with spongy bases of the stem. Terminal spikelets are all male (staminate). Pistillate spikes are sessile or sometimes short stalks (peduncles). Perigynia are yellow to brown and slightly inflated.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_utriculata_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p3_6.png",
      "carex_utriculata_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p3_7.png",
      "carex_utriculata_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p3_8.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896006/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/carex_utriculata_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p3_6.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896007/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/carex_utriculata_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p3_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896007/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/carex_utriculata_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p3_8.png"
    ],
    "page_number": 3
  },
  {
    "guide_id": 1280,
    "species_id": "sp_4",
    "scientific_name": "Carex cryptolepis",
    "common_name": "Small Yellow Sedge",
    "family": "Cyperaceae",
    "photo_date": "9-18-19",
    "description": "This state threatened sedge is easily overlooked due to its small stature - usually less than 6” tall. Named for the yellowy perigynia (papery seed shells). Very similar to C. viridula, another state threatened species, and hybridization between these 2 is possible. C. cryptolepis is slightly bigger - often an inch taller; perigynia ~ 1 mm broader. Formerly C = 9 & 10; now C = 4 & 5. Mostly sandy/gravelly wet prairies.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_cryptolepis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p4_1.png",
      "carex_cryptolepis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p4_2.png",
      "carex_cryptolepis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p4_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766895994/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/carex_cryptolepis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p4_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766895995/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/carex_cryptolepis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p4_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766895995/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/carex_cryptolepis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p4_3.png"
    ],
    "page_number": 4
  },
  {
    "guide_id": 1280,
    "species_id": "sp_5",
    "scientific_name": "Carex frankii",
    "common_name": "Bristly Cattail Sedge",
    "family": "Cyperaceae",
    "photo_date": "9-20-17",
    "description": "Spiky cucumbers of seeds; they turn brown & crumbles when ripe. Perigynia are similar to C. squarrosa; individual perigynia are shaped like a skinny bell pepper (most Carex taper to a beak). Northern end of its range. Prefers a long stratification (cold treatment) for germination.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_frankii_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p4_4.png",
      "carex_frankii_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p4_5.png",
      "carex_frankii_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p4_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766895996/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/carex_frankii_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p4_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766895996/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/carex_frankii_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p4_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766895997/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/carex_frankii_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p4_6.png"
    ],
    "page_number": 4
  },
  {
    "guide_id": 1280,
    "species_id": "sp_6",
    "scientific_name": "Carex grayi",
    "common_name": "Common Bur Sedge",
    "family": "Cyperaceae",
    "photo_date": "9-20-17",
    "description": "One of the “super sedges” with large seeds - a great group of Carex for beginners because you can see all of the features without magnification. A “medieval mace” of seeds, usually at least a dozen seeds per mace. Achenes (seeds) are rounded. Also spelled C. grayi.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_grayi_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p4_7.png",
      "carex_grayi_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p4_8.png",
      "carex_grayi_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p4_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766895998/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/carex_grayi_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p4_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766895999/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/carex_grayi_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p4_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896000/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/carex_grayi_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p4_9.png"
    ],
    "page_number": 4
  },
  {
    "guide_id": 1280,
    "species_id": "sp_7",
    "scientific_name": "Carex lupulina",
    "common_name": "Common Hop Sedge",
    "family": "Cyperaceae",
    "photo_date": "10-11-18",
    "description": "No doubt this species was named by a thirsty botanist. The clusters of spiky perigynia sort of look like hops when they are dangling downwards, or perhaps after enjoying a hoppy beverage. Common in flatwoods and other partially shady wet places. The achene (seeds inside the papery perigynia) has worn elbows, but no knobs on the corners.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_lupulina_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p5_1.png",
      "carex_lupulina_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p5_2.png",
      "carex_lupulina_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p5_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896003/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/carex_lupulina_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p5_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896003/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/carex_lupulina_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p5_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896004/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/carex_lupulina_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p5_3.png"
    ],
    "page_number": 5
  },
  {
    "guide_id": 1280,
    "species_id": "sp_8",
    "scientific_name": "Carex lupuliformis",
    "common_name": "Knobbed Hop Sedge",
    "family": "Cyperaceae",
    "photo_date": "10-11-18",
    "description": "The rare sister (C = 10) to C. lupulina. This species often has slightly longer spikelets (more seeds per spikelet). The achenes have obvious knobs, like a Popeye elbow, which can be felt by pressing the perigynia between fingers. When in doubt, it is the more common C. lupulina.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "carex_lupuliformis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p5_4.png",
      "carex_lupuliformis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p5_5.png",
      "carex_lupuliformis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p5_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896001/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/carex_lupuliformis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p5_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896002/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/carex_lupuliformis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p5_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896002/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/carex_lupuliformis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p5_6.png"
    ],
    "page_number": 5
  },
  {
    "guide_id": 1280,
    "species_id": "sp_9",
    "scientific_name": "Eleocharis obtusa",
    "common_name": "Blunt Spikerush",
    "family": "Cyperaceae",
    "photo_date": "10-4-20",
    "description": "This spikerush grows in a clump. Stem is far skinnier than the fruiting head. The tubercle (the triangular cap at the top of the seed) is about as wide as the seed, whereas other Eleocharis species have a dramatic change at the junction of tubercle and body. Brown seed preferred.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "eleocharis_obtusa_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p5_7.png",
      "eleocharis_obtusa_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p5_8.png",
      "eleocharis_obtusa_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p5_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896013/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/eleocharis_obtusa_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p5_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896014/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/eleocharis_obtusa_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p5_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896014/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/eleocharis_obtusa_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p5_9.png"
    ],
    "page_number": 5
  },
  {
    "guide_id": 1280,
    "species_id": "sp_10",
    "scientific_name": "Scirpus cyperinus",
    "common_name": "Woolgrass",
    "family": "Cyperaceae",
    "photo_date": "9-2-17, 10-19-19",
    "description": "Woolgrass is not a grass, nor part of a sheep, but the ripe seeds are clustered in a soft, woolly, cotton-candy puff. Look for off-white seeds in a cloud of rusty-colored, loose fluff. Collect when it is a loose cloud and easy to strip by hand.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "scirpus_cyperinus_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p6_1.png",
      "scirpus_cyperinus_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p6_2.png",
      "scirpus_cyperinus_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p6_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896039/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/scirpus_cyperinus_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p6_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896040/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/scirpus_cyperinus_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p6_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896040/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/scirpus_cyperinus_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p6_3.png"
    ],
    "page_number": 6
  },
  {
    "guide_id": 1280,
    "species_id": "sp_11",
    "scientific_name": "Leersia virginica",
    "common_name": "White Grass",
    "family": "Poaceae",
    "photo_date": "9-4-18",
    "description": "This is the gentler, smaller sister (shin to knee high) to L. oryzoides, and lacks the cutting edges. Often found in muddy, shady places after spring waters recede. Or trailside. Does not like competition. Same fuzzy white nodes as its sister. Seeds are slender, small, and often white. Strip by hand when loose. Takes time to collect quantity, likely why this seed is not commercially available.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "leersia_virginica_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p6_4.png",
      "leersia_virginica_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p6_5.png",
      "leersia_virginica_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p6_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896022/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/leersia_virginica_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p6_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896023/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/leersia_virginica_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p6_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896024/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/leersia_virginica_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p6_6.png"
    ],
    "page_number": 6
  },
  {
    "guide_id": 1280,
    "species_id": "sp_12",
    "scientific_name": "Leersia oryzoides",
    "common_name": "Rice Cut Grass",
    "family": "Poaceae",
    "photo_date": "9-27-17",
    "description": "This grass is well-named and quickly identified by bare skin while walking through wetlands. Usually about 3 feet tall, seeds are in a sparse panicle. Leersia species have white fuzzy nodes, like bracelets, along the stem. Good for skippers, birds, and deterring off-trail humans. Collect loose seeds. Seeds look bristly, but they don’t bite like the leaves.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "leersia_oryzoides_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p6_7.png",
      "leersia_oryzoides_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p6_8.png",
      "leersia_oryzoides_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p6_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896021/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/leersia_oryzoides_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p6_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896021/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/leersia_oryzoides_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p6_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896022/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/leersia_oryzoides_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p6_9.png"
    ],
    "page_number": 6
  },
  {
    "guide_id": 1280,
    "species_id": "sp_13",
    "scientific_name": "Panicum dichotomiflorum",
    "common_name": "Knee Grass",
    "family": "Poaceae",
    "photo_date": "9-12-18",
    "description": "This annual is common to disturbed places. The stem sheaths are hairless (an uncommon trait in this genus) and stems are “geniculate” near the base (like a bent knee - think genuflecting). Good for skippers & birds. A rare sister found in IN has smaller seeds & longer pedicels.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "panicum_dichotomiflorum_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p7_1.png",
      "panicum_dichotomiflorum_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p7_2.png",
      "panicum_dichotomiflorum_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p7_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896028/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/panicum_dichotomiflorum_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p7_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896031/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/panicum_dichotomiflorum_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p7_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896032/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/panicum_dichotomiflorum_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p7_3.png"
    ],
    "page_number": 7
  },
  {
    "guide_id": 1280,
    "species_id": "sp_14",
    "scientific_name": "Bromus latiglumis",
    "common_name": "Ear-leaved Brome",
    "family": "Poaceae",
    "photo_date": "9-14-20",
    "description": "One of the hairy-seeded native woodland brome species. This one has “ears,” where the leaves clasp the stem. This feature may degrade late in the season, but you can also readily identify it by the vast number of nodes (the swollen joints in the stem). There are more than 10 nodes per stem (often 14+). Ripens a little later than other hairy woodland bromes.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "bromus_latiglumis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p7_4.png",
      "bromus_latiglumis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p7_5.png",
      "bromus_latiglumis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p7_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766895987/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/bromus_latiglumis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p7_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766895988/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/bromus_latiglumis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p7_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766895988/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/bromus_latiglumis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p7_6.png"
    ],
    "page_number": 7
  },
  {
    "guide_id": 1280,
    "species_id": "sp_15",
    "scientific_name": "Bromus nottowayanus",
    "common_name": "Glossy-leaved Brome",
    "family": "Poaceae",
    "photo_date": "9-20-17",
    "description": "One of several tall hairy woodland brome grasses. Sources disagree. Flora includes B. ciliatus (lemmas hairy on margins only); B. latiglumis (flared lobes at base of leaf that clasp the stem); B. pubescens (sheath uniformly hairy & 2nd glume 3-nerved); and B. nottowayanus (sheath collar is hairier than rest of sheath & 2nd glume is 5-nerved). Many specimens formerly called B. purgens/pubescens are reclassified here.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "bromus_nottowayanus_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p7_7.png",
      "bromus_nottowayanus_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p7_8.png",
      "bromus_nottowayanus_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p7_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766895989/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/bromus_nottowayanus_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p7_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766895990/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/bromus_nottowayanus_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p7_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766895990/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/bromus_nottowayanus_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p7_9.png"
    ],
    "page_number": 7
  },
  {
    "guide_id": 1280,
    "species_id": "sp_16",
    "scientific_name": "Sporobolus heterolepis",
    "common_name": "Prairie Dropseed",
    "family": "Poaceae",
    "photo_date": "9-12-17",
    "description": "A staple in prairie restorations and a sign of a high-quality remnant. Big fountains of grass blades make this the most ornamental-looking native prairie grass. Smells like popcorn on warm summer days. Increased seed production after burns and easily stripped by hand when ripe. Best sown within 6 months of harvest. Decent germination, but slow to reach mature size; installing plants can be preferred over seed.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "sporobolus_heterolepis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p8_1.png",
      "sporobolus_heterolepis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p8_2.png",
      "sporobolus_heterolepis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p8_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896044/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/sporobolus_heterolepis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p8_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896045/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/sporobolus_heterolepis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p8_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896045/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/sporobolus_heterolepis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p8_3.png"
    ],
    "page_number": 8
  },
  {
    "guide_id": 1280,
    "species_id": "sp_17",
    "scientific_name": "Bouteloua curtipendula",
    "common_name": "Side-oats Grama",
    "family": "Poaceae",
    "photo_date": "9-19-17",
    "description": "Seeds dangle towards one side of the stem, typically pointing toward the ground at harvest time. Vibrant red anthers are stunning & a beautiful reminder that grasses bloom too. A short grass (1-3’ tall). Seeds are beige & easy to strip by hand when ripe.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "bouteloua_curtipendula_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p8_4.png",
      "bouteloua_curtipendula_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p8_5.png",
      "bouteloua_curtipendula_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p8_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766895986/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/bouteloua_curtipendula_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p8_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766895986/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/bouteloua_curtipendula_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p8_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766895987/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/bouteloua_curtipendula_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p8_6.png"
    ],
    "page_number": 8
  },
  {
    "guide_id": 1280,
    "species_id": "sp_18",
    "scientific_name": "Cinna arundinacea",
    "common_name": "Common Wood Reed",
    "family": "Poaceae",
    "photo_date": "9-20-17",
    "description": "This pretty, feathery grass is common in wet & mesic woodlands. Arundinacea means reed, which is why it shares a species name with the evil reed canary grass. The ligule (the ‘popped collar’ of the leaf sheath) is often purple-reddish. Strip loose seeds by hand or snip heads.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "cinna_arundinacea_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p8_7.png",
      "cinna_arundinacea_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p8_8.png",
      "cinna_arundinacea_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p8_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896008/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/cinna_arundinacea_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p8_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896009/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/cinna_arundinacea_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p8_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896010/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/cinna_arundinacea_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p8_9.png"
    ],
    "page_number": 8
  },
  {
    "guide_id": 1280,
    "species_id": "sp_19",
    "scientific_name": "Elymus virginicus",
    "common_name": "Virginia Wild Rye",
    "family": "Poaceae",
    "photo_date": "9-20-17",
    "description": "Seeds are tightly packed & upright, like an idealized wheat stalk. The base of the seed spike is typically wrapped by the leaf sheath. Spikelets are hairless (or at most, sandpapery). Flora includes 2 regionally rare subspecies. Collect beige seeds; don’t be deterred by the green bracts.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "elymus_virginicus_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p9_1.png",
      "elymus_virginicus_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p9_2.png",
      "elymus_virginicus_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p9_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896018/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/elymus_virginicus_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p9_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896019/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/elymus_virginicus_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p9_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896020/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/elymus_virginicus_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p9_3.png"
    ],
    "page_number": 9
  },
  {
    "guide_id": 1280,
    "species_id": "sp_20",
    "scientific_name": "Elymus riparius",
    "common_name": "Riverbank Wild Rye",
    "family": "Poaceae",
    "photo_date": "9-30-17",
    "description": "The glumes (the empty scales that cup the fertile seeds) are skinnier than most species, less than 1 mm wide, and persist on the spike after the florets have fallen. Similar to E. villosus, which ripens earlier, has spikes that are 5-12 cm long, and hairy lemmas. E. riparius spikes are generally 8-20 cm long, and lemmas are hispidulous (tiny hairs, visible with magnification).",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "elymus_riparius_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p9_4.png",
      "elymus_riparius_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p9_5.png",
      "elymus_riparius_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p9_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896016/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/elymus_riparius_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p9_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896017/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/elymus_riparius_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p9_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896017/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/elymus_riparius_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p9_6.png"
    ],
    "page_number": 9
  },
  {
    "guide_id": 1280,
    "species_id": "sp_21",
    "scientific_name": "Elymus canadensis",
    "common_name": "Canada Wild Rye",
    "family": "Poaceae",
    "photo_date": "10-2-17",
    "description": "This common grass will grow just about anywhere and is a fantastic native cover crop - fast to grow, but gives way to more conservative species. Easily ID’d by the long awns on the seed, which resembles a frizzy ponytail from a distance. Spike typically starts straight, but curves late in the season. Easy to strip by hand when ripe.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "elymus_canadensis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p9_7.png",
      "elymus_canadensis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p9_8.png",
      "elymus_canadensis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p9_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896015/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/elymus_canadensis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p9_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896015/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/elymus_canadensis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p9_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896016/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/elymus_canadensis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p9_9.png"
    ],
    "page_number": 9
  },
  {
    "guide_id": 1280,
    "species_id": "sp_22",
    "scientific_name": "Panicum virgatum",
    "common_name": "Switch Grass",
    "family": "Poaceae",
    "photo_date": "9-27-17",
    "description": "One of the common tall grasses (usually 4-6’ tall) in prairie restorations, and the tallest Panicum in the area. Once considered for biofuel, this perennial grass provides food for skippers & other insects, birds, as well as small & large mammals. This species has straight, hairless stems. Collect when seeds are loose & easily stripped by hand.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "panicum_virgatum_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p10_1.png",
      "panicum_virgatum_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p10_2.png",
      "panicum_virgatum_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p10_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896032/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/panicum_virgatum_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p10_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896033/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/panicum_virgatum_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p10_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896034/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/panicum_virgatum_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p10_3.png"
    ],
    "page_number": 10
  },
  {
    "guide_id": 1280,
    "species_id": "sp_23",
    "scientific_name": "Calamovilfa longifolia var. magna",
    "common_name": "Sand Reed",
    "family": "Poaceae",
    "photo_date": "10-2-20",
    "description": "Grows in Lake Michigan beaches. The pale empty glumes (the clamshell at the base of each spikelet) are left on the stalk after the seeds fall out. Seeds have long hairs, reaching more than ½ height of the seed. Sheaths are typically hairy, the ligule (‘popped collar’) is a hairy fringe, and lower sheaths are usually overlapping. Leaves are long, less than 12 mm wide, and the tips are skinny & rolled up.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "calamovilfa_longifolia_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p10_4.png",
      "calamovilfa_longifolia_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p10_5.png",
      "calamovilfa_longifolia_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p10_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766895991/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/calamovilfa_longifolia_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p10_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766895991/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/calamovilfa_longifolia_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p10_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766895992/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/calamovilfa_longifolia_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p10_6.png"
    ],
    "page_number": 10
  },
  {
    "guide_id": 1280,
    "species_id": "sp_24",
    "scientific_name": "Digitaria sanguinalis",
    "common_name": "Hairy Crabgrass",
    "family": "Poaceae",
    "photo_date": "10-11-19",
    "description": "Crabgrass is well known by lawn-lovers. Broad grass blades sprawl low to the ground like crab legs or fingers (“digitaria”). Almost all crabgrass species are non-native weeds found in disturbed places. The exception is the rare D. filiformis, an upright plant in sandy savannas.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "digitaria_sanguinalis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p10_7.png",
      "digitaria_sanguinalis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p10_8.png",
      "digitaria_sanguinalis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p10_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896012/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/digitaria_sanguinalis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p10_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896012/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/digitaria_sanguinalis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p10_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896013/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/digitaria_sanguinalis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p10_9.png"
    ],
    "page_number": 10
  },
  {
    "guide_id": 1280,
    "species_id": "sp_25",
    "scientific_name": "Andropogon gerardii",
    "common_name": "Big Bluestem",
    "family": "Poaceae",
    "photo_date": "10-9-17",
    "description": "Illinois’ official state grass and a tallgrass prairie icon. Easily ID’d by height (usually 5-7’) and the upside-down “turkey foot” of seeds. Flowers with bright yellow anthers, and the stem nodes are shades of blue, purple, and red. Ripe seeds are easily stripped by hand. This species, along with Indian grass, are the most commonly used tall grasses in prairie restorations.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "andropogon_gerardii_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p11_1.png",
      "andropogon_gerardii_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p11_2.png",
      "andropogon_gerardii_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p11_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766895984/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/andropogon_gerardii_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p11_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766895984/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/andropogon_gerardii_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p11_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766895985/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/andropogon_gerardii_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p11_3.png"
    ],
    "page_number": 11
  },
  {
    "guide_id": 1280,
    "species_id": "sp_26",
    "scientific_name": "Sorghastrum nutans",
    "common_name": "Indian Grass",
    "family": "Poaceae",
    "photo_date": "10-9-17",
    "description": "This species has coppery, feathery seed spikes, which is one possibility for the name. Another legend claims this grass was the first to pop up after a native tribe moved on. Many land managers hold off on installing tall prairie grasses until after a diverse mix establishes; these species can be overly dominant, an easy way to identify older restorations. Seeds are soft and enjoyable to collect, adding to their abundant use.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "sorghastrum_nutans_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p11_4.png",
      "sorghastrum_nutans_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p11_5.png",
      "sorghastrum_nutans_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p11_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896041/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/sorghastrum_nutans_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p11_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896041/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/sorghastrum_nutans_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p11_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896042/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/sorghastrum_nutans_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p11_6.png"
    ],
    "page_number": 11
  },
  {
    "guide_id": 1280,
    "species_id": "sp_27",
    "scientific_name": "Schizachyrium scoparium",
    "common_name": "Little Bluestem",
    "family": "Poaceae",
    "photo_date": "10-25-17",
    "description": "Similar to big blue, little bluestem also has purple-blue stems, especially the stem nodes. Seeds are fluffy white & excellent at catching the sunlight like starry constellations on the prairie. Ripens sporadically – easily stripped by hand; return next week and more seeds will be ripe.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "schizachyrium_scoparium_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p11_7.png",
      "schizachyrium_scoparium_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p11_8.png",
      "schizachyrium_scoparium_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p11_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896038/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/schizachyrium_scoparium_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p11_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896038/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/schizachyrium_scoparium_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p11_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896038/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/schizachyrium_scoparium_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p11_9.png"
    ],
    "page_number": 11
  },
  {
    "guide_id": 1280,
    "species_id": "sp_28",
    "scientific_name": "Muhlenbergia frondosa",
    "common_name": "Leafy Satin Grass",
    "family": "Poaceae",
    "photo_date": "10-16-17",
    "description": "This species is quite leafy, tends to have many branches, and sprawls as the season goes on. Plant is typically hairless, other than a few wispy hairs at the base of the seed. Spreads by seeds and scaly rhizomes. Valued by wildlife. Flora notes some historic mentions of M. mexicana should be referred here. These species are often called “muhly grasses.”",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "muhlenbergia_frondosa_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p12_1.png",
      "muhlenbergia_frondosa_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p12_2.png",
      "muhlenbergia_frondosa_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p12_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896024/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/muhlenbergia_frondosa_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p12_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896025/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/muhlenbergia_frondosa_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p12_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896025/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/muhlenbergia_frondosa_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p12_3.png"
    ],
    "page_number": 12
  },
  {
    "guide_id": 1280,
    "species_id": "sp_29",
    "scientific_name": "Muhlenbergia mexicana",
    "common_name": "Wood Satin Grass",
    "family": "Poaceae",
    "photo_date": "10-16-17",
    "description": "Another branching leafy satin grass (sometimes called “leafy satin grass” – always double check your references for muhlies), but stems are rough with teeny tiny hairs just beneath the nodes. Lemmas have long hairs at the base, and are awnless (or at most, tiny awns less than 5 mm long). Panicle of flowers are slender, usually less than 5 mm broad.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "muhlenbergia_mexicana_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p12_4.png",
      "muhlenbergia_mexicana_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p12_5.png",
      "muhlenbergia_mexicana_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p12_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896026/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/muhlenbergia_mexicana_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p12_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896027/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/muhlenbergia_mexicana_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p12_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896027/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/muhlenbergia_mexicana_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p12_6.png"
    ],
    "page_number": 12
  },
  {
    "guide_id": 1280,
    "species_id": "sp_30",
    "scientific_name": "Phragmites australis",
    "common_name": "Common Reed",
    "family": "Poaceae",
    "photo_date": "10-17-18",
    "description": "Evil. Tall (up to 15’!) with dense feathery heads. Primarily spreads by rhizomes. References disagree on seed viability; possibly related to self-incompatibility vs. cross-pollinated seed. There is a native species (formerly a subspecies) which is less aggressive, has reddish stems & more spindly heads. See the excellent minnesotawildflowers.info. Our local specimens all appear to be the non-native invasive species.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "phragmites_australis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p12_7.png",
      "phragmites_australis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p12_8.png",
      "phragmites_australis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p12_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896034/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/phragmites_australis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p12_7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896035/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/phragmites_australis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p12_8.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896036/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/phragmites_australis_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p12_9.png"
    ],
    "page_number": 12
  },
  {
    "guide_id": 1280,
    "species_id": "sp_31",
    "scientific_name": "Spartina pectinata",
    "common_name": "Prairie Cordgrass",
    "family": "Poaceae",
    "photo_date": "10-18-19",
    "description": "This common native wetland grass is readily identified by its height, the tightly packed fingers of seeds, and leaves that are sharp enough to cut. Seed viability is low, likely due to self-incompatibility and insects. Spreads well by rhizomes.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "spartina_pectinata_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p13_1.png",
      "spartina_pectinata_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p13_2.png",
      "spartina_pectinata_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p13_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896043/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/spartina_pectinata_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p13_1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896043/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/spartina_pectinata_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p13_2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896044/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/spartina_pectinata_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p13_3.png"
    ],
    "page_number": 13
  },
  {
    "guide_id": 1280,
    "species_id": "sp_32",
    "scientific_name": "Diarrhena obovata",
    "common_name": "Beak Grass",
    "family": "Poaceae",
    "photo_date": "10-24-19",
    "description": "A rare grass of mesic woodlands. Seeds are unusually large for a native grass, chunky with a neck, like a bent bottle. Seeds are often weighing down the long skinny branches. Spreads by rhizomes too. Collect when seeds are beige & easy to remove.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "diarrhena_obovata_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p13_4.png",
      "diarrhena_obovata_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p13_5.png",
      "diarrhena_obovata_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p13_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896010/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/diarrhena_obovata_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p13_4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896011/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/diarrhena_obovata_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p13_5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766896011/1280_usa_illinois_lakecounty_fallgrassesandkinv2_1/diarrhena_obovata_1280_usa_illinois_lakecounty_fallgrassesandkinv2_1_p13_6.png"
    ],
    "page_number": 13
  },
  {
    "guide_id": 1281,
    "species_id": "sp_1",
    "scientific_name": "Doellingeria umbellata",
    "common_name": "Flat-top Aster",
    "family": "Asteraceae",
    "photo_date": "9-20-17",
    "description": "Fluffy. Mama’s Boy. Doellingeria are flat-topped asters without heart-shaped leaves or skinny linear leaves; this is the only species in our region. White flowers. Leaves are alternate, with the unusual venation seen in purple loosestrife (a pair of veins parallel to the edge and feather veins inside). Likes fens and wet to wet-mesic prairies. Can tolerate a little shade but happier in full sun. Off-white pappus.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "doellingeria_umbellata_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p3_1.png",
      "doellingeria_umbellata_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p3_2.png",
      "doellingeria_umbellata_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p3_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853454/doellingeria_umbellata_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p3_1_gvgtd7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853455/doellingeria_umbellata_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p3_2_sqiruc.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853456/doellingeria_umbellata_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p3_3_ikm3yc.png"
    ],
    "page_number": 3
  },
  {
    "guide_id": 1281,
    "species_id": "sp_2",
    "scientific_name": "Eurybia furcata",
    "common_name": "Forked Aster",
    "family": "Asteraceae",
    "photo_date": "9-20-17",
    "description": "Fluffy. Mama’s Boy. Eurybia are flat-topped asters with heart-shaped leaves. This state threatened species has rough leaves. Basal leaves are typically smaller than your hand, and the stem leaves are fairly similar in size. Like many composite flowers, this species is selfincompatible but has decent seed production with cross-pollination. Flowers are white, pappus (seed fluff) is off-white.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "eurybia_furcata_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p3_4.png",
      "eurybia_furcata_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p3_5.png",
      "eurybia_furcata_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p3_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853459/eurybia_furcata_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p3_4_ixyynd.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853461/eurybia_furcata_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p3_5_uqj3yg.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853462/eurybia_furcata_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p3_6_kopwxf.png"
    ],
    "page_number": 3
  },
  {
    "guide_id": 1281,
    "species_id": "sp_3",
    "scientific_name": "Eurybia macrophylla",
    "common_name": "Big-leaf Aster",
    "family": "Asteraceae",
    "photo_date": "10-6-18",
    "description": "Fluffy. Mama’s Boy. Often a carpet of leaves bigger than your hand. A few flowering stalks with smaller leaves. Happiest in well-drained soils in canopy openings. Flowers white tinged purple; one of the first asters to bloom. Spreads by rhizomes and has allelopathic effects.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "eurybia_macrophylla_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p3_7.png",
      "eurybia_macrophylla_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p3_8.png",
      "eurybia_macrophylla_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p3_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853465/eurybia_macrophylla_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p3_7_hjuucw.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853467/eurybia_macrophylla_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p3_8_qg9tnm.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853469/eurybia_macrophylla_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p3_9_nk4w7j.png"
    ],
    "page_number": 3
  },
  {
    "guide_id": 1281,
    "species_id": "sp_4",
    "scientific_name": "Symphyotrichum drummondii",
    "common_name": "Drummond’s Aster",
    "family": "Asteraceae",
    "photo_date": "10-25-17",
    "description": "Fluffy. Mama’s Boy. Heart-shaped leaves with chunky teeth and winged petioles. Upper leaves tend to have rounded rather than heartshaped bases. Stem is uniformly covered in tiny grayish hairs, especially on the upper half. Often blooms lavender-blue but can be white.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "symphyotrichum_drummondii_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p4_1.png",
      "symphyotrichum_drummondii_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p4_2.png",
      "symphyotrichum_drummondii_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p4_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853707/symphyotrichum_drummondii_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p4_1_nd4vkp.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853713/symphyotrichum_drummondii_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p4_2_nj3ayg.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853713/symphyotrichum_drummondii_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p4_3_f5itjj.png"
    ],
    "page_number": 4
  },
  {
    "guide_id": 1281,
    "species_id": "sp_5",
    "scientific_name": "Symphyotrichum urophyllum",
    "common_name": "Arrow-leaved Aster",
    "family": "Asteraceae",
    "photo_date": "10-4-17",
    "description": "Fluffy. Mama’s Boy. Very similar to the more common S. drummondii (former variety), with heart-shaped leaves with winged petiole. S. urophyllum differs with stems that are hairless, or at most, hairs in the floral branches only. Phyllaries (individual floral bracts) are practically linear (S. drummondii phyllaries have a dilated diamond shape in the green band). This species often blooms white.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "symphyotrichum_urophyllum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p4_4.png",
      "symphyotrichum_urophyllum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p4_5.png",
      "symphyotrichum_urophyllum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p4_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766854225/symphyotrichum_urophyllum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p4_4_ywkupr.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766854226/symphyotrichum_urophyllum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p4_5_txusyo.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766854230/symphyotrichum_urophyllum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p4_6_ifkq23.png"
    ],
    "page_number": 4
  },
  {
    "guide_id": 1281,
    "species_id": "sp_6",
    "scientific_name": "Symphyotrichum dumosum",
    "common_name": "Bushy Aster",
    "family": "Asteraceae",
    "photo_date": "10-13-19",
    "description": "Fluffy. Mama’s Boy. This uncommon species favors sandy soils. Small white flowers and small upper leaves. Somewhat like the more common S. ericoides, but flowers are less dense and phyllaries (floral bracts) are hairless. Flowers are dotted around the plant, but solitary on the end of short branches. Plants often lean, but flowers still face the sky. Leaves are linear.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "symphyotrichum_dumosum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p4_7.png",
      "symphyotrichum_dumosum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p4_8.png",
      "symphyotrichum_dumosum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p4_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853719/symphyotrichum_dumosum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p4_7_raqzks.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853725/symphyotrichum_dumosum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p4_8_tvaoe9.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853725/symphyotrichum_dumosum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p4_9_ruu5by.png"
    ],
    "page_number": 4
  },
  {
    "guide_id": 1281,
    "species_id": "sp_7",
    "scientific_name": "Symphyotrichum ericoides",
    "common_name": "Heath Aster",
    "family": "Asteraceae",
    "photo_date": "10-16-17",
    "description": "Fluffy. Mama’s Boy. Usually this species is readily ID’d by its petite stature (often 6-12” tall), packed with tiny flowers, and tiny leaves. But grown in decent soil with medium nutrition, this species can be MUCH bigger. If in doubt: ray florets (“petals”) are typically less than 20 per flower head; involucres (green floral “cup”) are no more than 5 mm tall; heads are densely packed and mostly on one side of the branch.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "symphyotrichum_ericoides_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p5_1.png",
      "symphyotrichum_ericoides_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p5_2.png",
      "symphyotrichum_ericoides_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p5_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853731/symphyotrichum_ericoides_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p5_1_b2csm0.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853733/symphyotrichum_ericoides_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p5_2_n6y0b5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853741/symphyotrichum_ericoides_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p5_3_vdockg.png"
    ],
    "page_number": 5
  },
  {
    "guide_id": 1281,
    "species_id": "sp_8",
    "scientific_name": "Symphyotrichum laeve",
    "common_name": "Smooth Blue Aster",
    "family": "Asteraceae",
    "photo_date": "10-9-17",
    "description": "Fluffy. Mama’s Boy. A waxy blue-green color to the stem and leaves, especially early in the season. Leaves with a smooth almost rubbery feel. Upper leaves clasp the stem, lower leaves narrow to a winged petiole, usually no serrations. Upper leaves are smaller than lower ones. Loves mesic to dry prairies and inhabits sunnier openings in savannas. Pappus (seed fluff) is off-white, usually tinged with amber or rose.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "symphyotrichum_laeve_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p5_4.png",
      "symphyotrichum_laeve_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p5_5.png",
      "symphyotrichum_laeve_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p5_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853745/symphyotrichum_laeve_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p5_4_ftgqqj.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853805/symphyotrichum_laeve_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p5_5_uchacy.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766854076/symphyotrichum_laeve_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p5_6_yabbqj.png"
    ],
    "page_number": 5
  },
  {
    "guide_id": 1281,
    "species_id": "sp_9",
    "scientific_name": "Symphyotrichum lanceolatum var. interior",
    "common_name": "Marsh Aster",
    "family": "Asteraceae",
    "photo_date": "10-30-18",
    "description": "Fluffy. Mama’s Boy. A common species, tall and dense with white flowers. Spreads by rhizomes and seed. Stems are hairless, or at most hairy in lines on the upper half. Leaves are hairless. The “eye” of the flowers (disc florets) matures from yellow to burgundy. Pappus (fluff) is white to amber. Similar to straight species, but this variety has smaller involucres (cup of bracts under the flower), less than 4 mm high.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "symphyotrichum_lanceolatum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p5_7.png",
      "symphyotrichum_lanceolatum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p5_8.png",
      "symphyotrichum_lanceolatum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p5_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766854081/symphyotrichum_lanceolatum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p5_7_zzchzv.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766854082/symphyotrichum_lanceolatum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p5_8_o0d0am.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766854083/symphyotrichum_lanceolatum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p5_9_vivzff.png"
    ],
    "page_number": 5
  },
  {
    "guide_id": 1281,
    "species_id": "sp_10",
    "scientific_name": "Symphyotrichum lateriflorum",
    "common_name": "Calico Aster",
    "family": "Asteraceae",
    "photo_date": "9-28-17",
    "description": "Fluffy. Mama’s Boy. “Calico” refers to the color-changing “eye,” although this trait occurs in other asters too. Side-flowering (“lateriflorum”) refers to the flowers all growing on one side of the branches, usually facing up towards the sun. Many tiny white flowers on short stalks. Common in wet to dry-mesic woodlands and savannas, also wet to wet-mesic sunny habitats. See Flora for fen variety.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "symphyotrichum_lateriflorum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p6_1.png",
      "symphyotrichum_lateriflorum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p6_2.png",
      "symphyotrichum_lateriflorum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p6_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766854128/symphyotrichum_lateriflorum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p6_1_fhtvea.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766854129/symphyotrichum_lateriflorum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p6_2_ai9tz5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766854133/symphyotrichum_lateriflorum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p6_3_wv7zhx.png"
    ],
    "page_number": 6
  },
  {
    "guide_id": 1281,
    "species_id": "sp_11",
    "scientific_name": "Symphyotrichum novae-angliae",
    "common_name": "New England Aster",
    "family": "Asteraceae",
    "photo_date": "10-4-17",
    "description": "Fluffy. Mama’s Boy. A versatile aster, this species grows in full sun to partial shade, wet to dry-mesic soils. One of only a few native asters with vibrant royal purple flowers; rare to see other colors in natural populations of this species. Leaves clasp the stem. Stem and leaves are hairy. Floral branches and bracts have some glandular (lollipop) hairs. Achenes (seeds) are hairy, and the pappus (seed fluff) is brown.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "symphyotrichum_novaeangliae_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p6_4.png",
      "symphyotrichum_novaeangliae_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p6_5.png",
      "symphyotrichum_novaeangliae_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p6_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766854139/symphyotrichum_novaeangliae_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p6_4_cvd6m4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766854140/symphyotrichum_novaeangliae_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p6_5_szss18.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766854144/symphyotrichum_novaeangliae_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p6_6_o4wi60.png"
    ],
    "page_number": 6
  },
  {
    "guide_id": 1281,
    "species_id": "sp_12",
    "scientific_name": "Symphyotrichum oblongifolium",
    "common_name": "Aromatic Aster",
    "family": "Asteraceae",
    "photo_date": "10-16-17",
    "description": "Fluffy. Mama’s Boy. This uncommon aster loves rocky, calcium-rich, dry soils. A bushy dome of woody stems covered in royal purple flowers. Crushed leaves have a balsam-like aroma. One of the last to bloom, this species is great for pollinators and native gardening. Small leaves dominate; larger leaves are less than 1cm wide and 6 cm long. Brown pappus (seed fluff).",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "symphyotrichum_oblongifolium_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p6_7.png",
      "symphyotrichum_oblongifolium_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p6_8.png",
      "symphyotrichum_oblongifolium_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p6_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766854150/symphyotrichum_oblongifolium_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p6_7_z36sh0.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766854150/symphyotrichum_oblongifolium_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p6_8_ahvtvx.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766854151/symphyotrichum_oblongifolium_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p6_9_qef72p.png"
    ],
    "page_number": 6
  },
  {
    "guide_id": 1281,
    "species_id": "sp_13",
    "scientific_name": "Symphyotrichum oolentangiense",
    "common_name": "Sky-blue Aster",
    "family": "Asteraceae",
    "photo_date": "10-16-20",
    "description": "Fluffy. As with the other “blues” this aster has flowers that are lavender rather than a true bold blue. Lower leaves are heart-shaped or lanceshaped, becoming dramatically smaller up the stem. Leaves have a rough, sandpapery texture and are winged at the petioles, and have few to no teeth on the margins. Dry & mesic prairies and savannas, especially in well-drained soils.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "symphyotrichum_oolentangiense_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p7_1.png",
      "symphyotrichum_oolentangiense_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p7_2.png",
      "symphyotrichum_oolentangiense_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p7_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766854158/symphyotrichum_oolentangiense_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p7_1_ko4wcw.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766854161/symphyotrichum_oolentangiense_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p7_2_mdgx9p.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766854165/symphyotrichum_oolentangiense_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p7_3_wpdu9s.png"
    ],
    "page_number": 7
  },
  {
    "guide_id": 1281,
    "species_id": "sp_14",
    "scientific_name": "Symphyotrichum prenanthoides",
    "common_name": "Crooked-stem Aster",
    "family": "Asteraceae",
    "photo_date": "10-18-18",
    "description": "Fluffy. Mama’s Boy. Clasping leaves with serrated teeth and a “waist” in the leaf. Floral branches and floral bracts are usually hairless. This rare aster is commercially available and appearing in restorations beyond its historic distribution. Found in shady damp places. Flowers are a pale lavender-blue or sometimes white. Pappus is cinnamon colored.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "symphyotrichum_prenanthoides_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p7_4.png",
      "symphyotrichum_prenanthoides_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p7_5.png",
      "symphyotrichum_prenanthoides_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p7_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766854180/symphyotrichum_prenanthoides_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p7_4_ge9ilq.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766854184/symphyotrichum_prenanthoides_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p7_5_tkvdha.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766854186/symphyotrichum_prenanthoides_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p7_6_dxfnc7.png"
    ],
    "page_number": 7
  },
  {
    "guide_id": 1281,
    "species_id": "sp_15",
    "scientific_name": "Symphyotrichum praealtum",
    "common_name": "Willow Aster",
    "family": "Asteraceae",
    "photo_date": "11-3-20",
    "description": "Fluffy. Late-blooming aster in wet-mesic habitats. Rhizomatous. Slender elliptic leaves (like willow leaves) with “reticulate” veins (net veined, like a stained-glass window) are prominent in this species. Lavender or white flowers with large leafy bracts under the flower heads.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "symphyotrichum_praealtum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p7_7.png",
      "symphyotrichum_praealtum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p7_8.png",
      "symphyotrichum_praealtum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p7_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766854171/symphyotrichum_praealtum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p7_7_jvsccl.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766854172/symphyotrichum_praealtum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p7_8_iyhffk.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766854173/symphyotrichum_praealtum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p7_9_yqqebi.png"
    ],
    "page_number": 7
  },
  {
    "guide_id": 1281,
    "species_id": "sp_16",
    "scientific_name": "Symphyotrichum puniceum",
    "common_name": "Bristly Aster",
    "family": "Asteraceae",
    "photo_date": "11-6-18",
    "description": "Fluffy. Mama’s Boy. Often a red-purple stem. Longer leaves are more than 5 cm long and clasp the stem. Flower color varies. Floral bracts are hairless. Underside of main leaves have hairs on the main vein and upper stems have short bristly hairs (S. firmum is nearly hairless all over.) Pappus is white.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "symphyotrichum_puniceum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p8_1.png",
      "symphyotrichum_puniceum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p8_2.png",
      "symphyotrichum_puniceum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p8_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766854191/symphyotrichum_puniceum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p8_1_m1qtxa.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766854195/symphyotrichum_puniceum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p8_2_t6twtk.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766854196/symphyotrichum_puniceum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p8_3_l1allu.png"
    ],
    "page_number": 8
  },
  {
    "guide_id": 1281,
    "species_id": "sp_17",
    "scientific_name": "Symphyotrichum sericeum",
    "common_name": "Silky Aster",
    "family": "Asteraceae",
    "photo_date": "10-28-20",
    "description": "Fluffy. Silky aster is densely covered with fine silky hairs, giving the leaves a slightly shining, grayish tone. This rare aster grows in welldrained sandy and rocky soils, most often in prairies but it can be found in savannas too. Flowers are lavender. Grows in small clumps.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "symphyotrichum_sericeum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p8_4.png",
      "symphyotrichum_sericeum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p8_5.png",
      "symphyotrichum_sericeum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p8_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766854198/symphyotrichum_sericeum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p8_4_ys06qw.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766854205/symphyotrichum_sericeum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p8_5_rpkitq.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766854206/symphyotrichum_sericeum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p8_6_ocotm3.png"
    ],
    "page_number": 8
  },
  {
    "guide_id": 1281,
    "species_id": "sp_18",
    "scientific_name": "Symphyotrichum shortii",
    "common_name": "Short’s Aster",
    "family": "Asteraceae",
    "photo_date": "10-26-18",
    "description": "Fluffy. Mama’s Boy. Heart-shaped leaves with smooth margins (usually no serrations) and skinny petioles without wings. Loves mesic to dry woodlands and savannas. Flowers are blue-purple and pappus (seed fluff) is tan.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "symphyotrichum_shortii_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p8_7.png",
      "symphyotrichum_shortii_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p8_8.png",
      "symphyotrichum_shortii_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p8_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766854212/symphyotrichum_shortii_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p8_7_umm7qz.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766854215/symphyotrichum_shortii_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p8_8_jmzy3n.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766854217/symphyotrichum_shortii_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p8_9_waqym8.png"
    ],
    "page_number": 8
  },
  {
    "guide_id": 1281,
    "species_id": "sp_19",
    "scientific_name": "Oligoneuron album",
    "common_name": "Stiff Aster",
    "family": "Asteraceae",
    "photo_date": "10-24-19",
    "description": "Fluffy. Mama’s Boy. This species has bounced between Aster and Solidago for years. Flowers are white, but it has successfully hybridized with 2 Oligoneuron goldenrods. Most likely to be found on sandy, well-draining prairies. The pale gray pappus color is unusual. Stiff, flat, linear leaves. Flat-topped arrangement of flowers & seeds; leaves are larger at the base and decrease in size up the stem.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "oligoneuron_album_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p9_1.png",
      "oligoneuron_album_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p9_2.png",
      "oligoneuron_album_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p9_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853491/oligoneuron_album_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p9_1_lo7cca.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853492/oligoneuron_album_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p9_2_vvfkit.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853497/oligoneuron_album_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p9_3_mmpohx.png"
    ],
    "page_number": 9
  },
  {
    "guide_id": 1281,
    "species_id": "sp_20",
    "scientific_name": "Oligoneuron ohioense",
    "common_name": "Ohio Goldenrod",
    "family": "Asteraceae",
    "photo_date": "10-9-19",
    "description": "Fluffy. Mama’s Boy. A fen-loving goldenrod, this species is a little more conservative than O. riddellii. Leaves are flat and have blunter tips. Hairless throughout. Like all Oligoneuron species, this species has a flat-topped arrangement of flowers & seeds; leaves are larger at the base and decrease up the stem.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "oligoneuron_ohioense_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p9_4.png",
      "oligoneuron_ohioense_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p9_5.png",
      "oligoneuron_ohioense_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p9_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853502/oligoneuron_ohioense_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p9_4_ela0pk.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853503/oligoneuron_ohioense_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p9_5_e2nozv.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853507/oligoneuron_ohioense_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p9_6_hmasid.png"
    ],
    "page_number": 9
  },
  {
    "guide_id": 1281,
    "species_id": "sp_21",
    "scientific_name": "Oligoneuron riddellii",
    "common_name": "Riddell’s Goldenrod",
    "family": "Asteraceae",
    "photo_date": "10-13-18",
    "description": "Fluffy. Mama’s Boy. Another fen-lover, but this goldenrod has arching, pointed leaves that are typically folded along the keel of the central leaf vein. The main stalks and leaves are hairless, but the short floral branches are hairy. Leaves decrease in size on the upper stem.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "oligoneuron_riddellii_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p9_7.png",
      "oligoneuron_riddellii_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p9_8.png",
      "oligoneuron_riddellii_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p9_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853509/oligoneuron_riddellii_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p9_7_qaoj2p.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853515/oligoneuron_riddellii_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p9_8_doazrj.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853516/oligoneuron_riddellii_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p9_9_aukpzx.png"
    ],
    "page_number": 9
  },
  {
    "guide_id": 1281,
    "species_id": "sp_22",
    "scientific_name": "Oligoneuron rigidum",
    "common_name": "Stiff Goldenrod",
    "family": "Asteraceae",
    "photo_date": "10-9-17",
    "description": "Fluffy. Mama’s Boy. A familiar species to many prairie enthusiasts. Hairy spinach-shaped leaves that start out cuddly-soft and stiffen with age. White pappus, relatively large heads. As with all Oligoneuron species, a flat-topped arrangement of flowers & seeds; leaves are larger at the base and decrease in size up the stem.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "oligoneuron_rigidum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p10_1.png",
      "oligoneuron_rigidum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p10_2.png",
      "oligoneuron_rigidum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p10_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853520/oligoneuron_rigidum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p10_1_rjlivc.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853525/oligoneuron_rigidum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p10_2_nryauc.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853525/oligoneuron_rigidum_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p10_3_hrrzgo.png"
    ],
    "page_number": 10
  },
  {
    "guide_id": 1281,
    "species_id": "sp_23",
    "scientific_name": "Euthamia graminifolia",
    "common_name": "Smooth Grass-leaved Goldenrod",
    "family": "Asteraceae",
    "photo_date": "10-9-19",
    "description": "Fluffy. Mama’s Boy. Euthamia species have flat-topped flower arrangements with linear leaves of similar size, primarily along the stem rather than basal leaves, and the lower leaves quickly drop. Larger leaves on this species are more than 4 mm wide, often with 5+ veins. Stems are hairless, or at most, sparse hairs in lines on the lower stem.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "euthamia_graminifolia_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p10_4.png",
      "euthamia_graminifolia_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p10_5.png",
      "euthamia_graminifolia_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p10_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853473/euthamia_graminifolia_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p10_4_oleeai.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853474/euthamia_graminifolia_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p10_5_rj7nat.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853477/euthamia_graminifolia_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p10_6_teqoml.png"
    ],
    "page_number": 10
  },
  {
    "guide_id": 1281,
    "species_id": "sp_24",
    "scientific_name": "Euthamia nuttallii",
    "common_name": "Hairy Grass-leaved Goldenrod",
    "family": "Asteraceae",
    "photo_date": "10-20-17",
    "description": "Fluffy. Mama’s Boy. Formerly a variety of E. graminifolia, this species has the same leaves and flat-topped arrangement of yellow flowers. Differs by having small hairs throughout the plant, although sometimes the outer branches are hairless.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "euthamia_nuttallii_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p10_7.png",
      "euthamia_nuttallii_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p10_8.png",
      "euthamia_nuttallii_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p10_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853481/euthamia_nuttallii_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p10_7_tzmosi.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853483/euthamia_nuttallii_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p10_8_mxfv3o.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853486/euthamia_nuttallii_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p10_9_woi4ik.png"
    ],
    "page_number": 10
  },
  {
    "guide_id": 1281,
    "species_id": "sp_25",
    "scientific_name": "Solidago caesia",
    "common_name": "Blue-stemmed Goldenrod",
    "family": "Asteraceae",
    "photo_date": "9-30-17",
    "description": "Fluffy. Mama’s Boy. A species of rich mesic woods, and can also be found in savannas. Seeds are clustered in leaf axils. Stem has a light blue waxy coating (glaucous). Elongated, lance-shaped leaves are sessile (stalkless). More clusters of flowers & seeds than S. flexicaulis.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "solidago_caesia_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p11_1.png",
      "solidago_caesia_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p11_2.png",
      "solidago_caesia_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p11_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853532/solidago_caesia_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p11_1_zml7db.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853533/solidago_caesia_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p11_2_k2lne4.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853535/solidago_caesia_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p11_3_elv84e.png"
    ],
    "page_number": 11
  },
  {
    "guide_id": 1281,
    "species_id": "sp_26",
    "scientific_name": "Solidago canadensis",
    "common_name": "Canada Goldenrod",
    "family": "Asteraceae",
    "photo_date": "9-30-17",
    "description": "Fluffy. Mama’s Boy. Good for pollinators and it’s native, but that’s about all the nice things you can say. Happy in disturbed soils and many habitats. Dense plumes of flowers. Leaves have parallel veins, slightly smaller going up the stem. Hairy stem, but lower stem can go bald with age. Spreads by rhizomes too. Differs from S. altissima by height of involucre (green cup under flower). Don’t collect either species.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "solidago_canadensis_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p11_4.png",
      "solidago_canadensis_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p11_5.png",
      "solidago_canadensis_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p11_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853541/solidago_canadensis_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p11_4_cdgcri.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853544/solidago_canadensis_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p11_5_z8vsti.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853545/solidago_canadensis_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p11_6_vrgomp.png"
    ],
    "page_number": 11
  },
  {
    "guide_id": 1281,
    "species_id": "sp_27",
    "scientific_name": "Solidago flexicaulis",
    "common_name": "Zig-zag Goldenrod",
    "family": "Asteraceae",
    "photo_date": "9-30-17",
    "description": "Fluffy. Mama’s Boy. This species has flowers/seeds in the clusters of the leaf axils (where stems & leaves meet). Leaves are broad serrated ovals with a point and winged petioles. Stem has a slight zigzag between axils. Mesic woodlands and mesic microhabitats in wetter woods.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "solidago_flexicaulis_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p11_7.png",
      "solidago_flexicaulis_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p11_8.png",
      "solidago_flexicaulis_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p11_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853551/solidago_flexicaulis_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p11_7_ro6fov.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853555/solidago_flexicaulis_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p11_8_v4u2x1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853556/solidago_flexicaulis_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p11_9_dgozss.png"
    ],
    "page_number": 11
  },
  {
    "guide_id": 1281,
    "species_id": "sp_28",
    "scientific_name": "Solidago gigantea",
    "common_name": "Late Goldenrod",
    "family": "Asteraceae",
    "photo_date": "10-13-18",
    "description": "Similar to S. canadensis, but hairless (or nearly so) on the main stems. Hairy on the floral branches. Like S. canadensis and S. altissima, the shape of the floral plume varies; often pyramid-shaped (wider on bottom) but can be wider in the middle or even club-like. The name isn’t terribly helpful; blooming time overlaps with other goldenrods and while it is tall like its sisters, it is not a giant (gigantea).",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "solidago_gigantea_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p12_1.png",
      "solidago_gigantea_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p12_2.png",
      "solidago_gigantea_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p12_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853563/solidago_gigantea_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p12_1_x52k53.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853563/solidago_gigantea_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p12_2_vwxb7o.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853564/solidago_gigantea_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p12_3_ppc9sw.png"
    ],
    "page_number": 12
  },
  {
    "guide_id": 1281,
    "species_id": "sp_29",
    "scientific_name": "Solidago juncea",
    "common_name": "Early Goldenrod",
    "family": "Asteraceae",
    "photo_date": "10-8-18",
    "description": "Fluffy. Mama’s Boy. Usually the first goldenrod to bloom, but flowering time overlaps with other species. Stems are hairless, including the floral branches. Basal rosettes are common. Typically 1 – 3 veins per leaf and lower leaves present at flowering time.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "solidago_juncea_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p12_4.png",
      "solidago_juncea_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p12_5.png",
      "solidago_juncea_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p12_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853571/solidago_juncea_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p12_4_fjrezm.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853575/solidago_juncea_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p12_5_efhygi.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853576/solidago_juncea_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p12_6_x9oofj.png"
    ],
    "page_number": 12
  },
  {
    "guide_id": 1281,
    "species_id": "sp_30",
    "scientific_name": "Solidago nemoralis",
    "common_name": "Old-field Goldenrod",
    "family": "Asteraceae",
    "photo_date": "10-13-17",
    "description": "Fluffy. Mama’s Boy. The petite “bent Xmas tree” goldenrod, old-field is like a hunched old man. Common to old fields, dry prairies, and savannas. Occasionally in a compact plume rather than a long Xmas tree, just to test you. Hairy throughout. Short (usually less than 2 feet). Measure floral stalks (pedicels) and involucre (cup of floral bracts) to confirm ID against S. nemoralis haleana and S. decemflora.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "solidago_nemoralis_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p12_7.png",
      "solidago_nemoralis_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p12_8.png",
      "solidago_nemoralis_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p12_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853581/solidago_nemoralis_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p12_7_w4svrf.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853587/solidago_nemoralis_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p12_8_g9kg5f.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853586/solidago_nemoralis_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p12_9_px6gfw.png"
    ],
    "page_number": 12
  },
  {
    "guide_id": 1281,
    "species_id": "sp_31",
    "scientific_name": "Solidago patula",
    "common_name": "Swamp Goldenrod",
    "family": "Asteraceae",
    "photo_date": "10-2-17",
    "description": "Fluffy. Mama’s Boy. This species seems happiest growing near gently flowing water, often on a slightly drier rise, in fens or flatwoods. Big (3.5+ cm wide), rough basal leaves. Leaf size shrinks as they move up the stem. Elongated branches of flowers, longer than S. ulmifolia.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "solidago_patula_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p13_1.png",
      "solidago_patula_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p13_2.png",
      "solidago_patula_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p13_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853589/solidago_patula_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p13_1_fmoebw.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853596/solidago_patula_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p13_2_nhxsln.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853597/solidago_patula_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p13_3_jaqgd0.png"
    ],
    "page_number": 13
  },
  {
    "guide_id": 1281,
    "species_id": "sp_32",
    "scientific_name": "Solidago sempervirens",
    "common_name": "Seaside Goldenrod",
    "family": "Asteraceae",
    "photo_date": "11-3-20",
    "description": "Fluffy. This non-native goldenrod is a growing problem, moving up from the southern US along roadsides (and their road salt). Usually the latest-blooming goldenrod, and grows in large, dense colonies. Leaves are toothless; the next closest goldenrod is S. speciosa, but habitat quickly distinguishes the two species.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "solidago_sempervirens_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p13_4.png",
      "solidago_sempervirens_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p13_5.png",
      "solidago_sempervirens_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p13_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853603/solidago_sempervirens_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p13_4_k8ngxy.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853610/solidago_sempervirens_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p13_5_tetcif.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853678/solidago_sempervirens_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p13_6_hjcwh5.png"
    ],
    "page_number": 13
  },
  {
    "guide_id": 1281,
    "species_id": "sp_33",
    "scientific_name": "Solidago speciosa",
    "common_name": "Showy Goldenrod",
    "family": "Asteraceae",
    "photo_date": "10-25-17",
    "description": "Fluffy. Mama’s Boy. Aptly named, this is the showiest of the native goldenrods and the best suited for native gardening. Stems typically a bold crimson late in the season. Xmas tree of flowers. Leaves are entire (lacking any teeth or lobes) on most of the leaves. Grows in little clumps. See Flora for variations. Herbarium specimens can be confused with S. uliginosa, but habitat easily separates them in the wild.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "solidago_speciosa_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p13_7.png",
      "solidago_speciosa_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p13_8.png",
      "solidago_speciosa_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p13_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853683/solidago_speciosa_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p13_7_hdf4s5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853684/solidago_speciosa_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p13_8_hk1z3c.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853689/solidago_speciosa_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p13_9_h30mpj.png"
    ],
    "page_number": 13
  },
  {
    "guide_id": 1281,
    "species_id": "sp_34",
    "scientific_name": "Solidago ulmifolia",
    "common_name": "Elm-leaved Goldenrod",
    "family": "Asteraceae",
    "photo_date": "10-4-17",
    "description": "Fluffy. Mama’s Boy. Flowers are on long branching arms, like exploding fireworks. Leaves are broader than many goldenrods, but a far cry from an elm leaf. Leaves are feather-veined; many goldenrods species have parallel veins. Woodlands and savannas.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "solidago_ulmifolia_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p14_1.png",
      "solidago_ulmifolia_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p14_2.png",
      "solidago_ulmifolia_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p14_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853696/solidago_ulmifolia_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p14_1_nyqelx.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853697/solidago_ulmifolia_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p14_2_rlo489.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766853699/solidago_ulmifolia_1281_usa_illinois_lakecounty_astersgoldenodsv2_0_p14_3_il40u3.png"
    ],
    "page_number": 14
  },
  {
    "guide_id": 1282,
    "species_id": "sp_1",
    "scientific_name": "Echinacea pallida",
    "common_name": "Pale Purple Coneflower",
    "family": "Asteraceae",
    "photo_date": "8-8-18",
    "description": "Coneheads. Mama’s Boy. Colorful “petals” (ray florets) and the orange of the disc florets (cone) disappear, leaving behind a dark spikey cone. Snip dark heads, ideally when a few seeds have fallen out of the conehead. E. pallida seeds look like candy corn - gray with a brown stripe at the kernel end; E. purpurea is solid gray. The sturdy spikey heads are best processed by machine, or wearing thick gloves, or pliers.",
    "seed_group_names": [
      "Coneheads"
    ],
    "seed_group_details": [
      {
        "name": "Coneheads",
        "images": [
          "Coneheads_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Coneheads are flowers with a cone-shaped center. Imagine these flowers without their colorful parts, and you know exactly what they look like when seeds are ripe."
      }
    ],
    "image_filenames": [
      "echinacea_pallida_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p3_1.png",
      "echinacea_pallida_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p3_2.png",
      "echinacea_pallida_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p3_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865140/echinacea_pallida_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p3_1_cduy0g.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865141/echinacea_pallida_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p3_2_q0oswo.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865142/echinacea_pallida_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p3_3_sb4rd4.png"
    ],
    "page_number": 3
  },
  {
    "guide_id": 1282,
    "species_id": "sp_2",
    "scientific_name": "Echinacea purpurea",
    "common_name": "Purple Coneflower",
    "family": "Asteraceae",
    "photo_date": "10-12-17",
    "description": "Coneheads. Mama’s Boy. The colorful “petals” (ray florets) of this composite flower have a deeper fuchsia hue than the aptly named “pale” sister. E. purpurea is overabundant in restorations due to its appeal to gardeners & pollinators alike; the less showy sister was historically the more common. Broader leaves, slightly later & longer blooming time, and stripe-less seeds distinguish this species from E. pallida.",
    "seed_group_names": [
      "Coneheads"
    ],
    "seed_group_details": [
      {
        "name": "Coneheads",
        "images": [
          "Coneheads_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Coneheads are flowers with a cone-shaped center. Imagine these flowers without their colorful parts, and you know exactly what they look like when seeds are ripe."
      }
    ],
    "image_filenames": [
      "echinacea_purpurea_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p3_4.png",
      "echinacea_purpurea_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p3_5.png",
      "echinacea_purpurea_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p3_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865147/echinacea_purpurea_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p3_4_c0wwpt.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865147/echinacea_purpurea_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p3_5_udgari.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865147/echinacea_purpurea_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p3_6_jcl4pi.png"
    ],
    "page_number": 3
  },
  {
    "guide_id": 1282,
    "species_id": "sp_3",
    "scientific_name": "Daucus carota",
    "common_name": "Queen Anne’s Lace",
    "family": "Apiaceae",
    "photo_date": "8-19-20",
    "description": "Hitchhikers. A non-native flower of disturbed habitats, yet this species has a place in people’s hearts. Childhood stories of Queen Anne and her bloody lace probably help inspire the connection. White flowers, often with a dark purple floret in the center. Good for pollinators.",
    "seed_group_names": [
      "Hitchhikers"
    ],
    "seed_group_details": [
      {
        "name": "Hitchhikers",
        "images": [
          "Hitchhikers_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Hitchhikers are easy to tell when ripe – they hitch a ride on your pants! Color can be an indicator, but not always. Do Not Collect."
      }
    ],
    "image_filenames": [
      "daucus_carota_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p3_7.png",
      "daucus_carota_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p3_8.png",
      "daucus_carota_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p3_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865124/daucus_carota_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p3_7_egux2s.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865126/daucus_carota_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p3_8_s5fgr3.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865129/daucus_carota_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p3_9_cdipfr.png"
    ],
    "page_number": 3
  },
  {
    "guide_id": 1282,
    "species_id": "sp_4",
    "scientific_name": "Dalea candida",
    "common_name": "White Prairie Clover",
    "family": "Fabaceae",
    "photo_date": "8-31-17",
    "description": "Crumbly Coneheads. Mama’s Boy. The prairie clovers bloom with tutus of flowers, from the bottom to the top of the spike. These legume seeds are ripe when the thimble starts to crumble. Collect when easy to strip by hand.",
    "seed_group_names": [
      "Coneheads"
    ],
    "seed_group_details": [
      {
        "name": "Coneheads",
        "images": [
          "Coneheads_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Coneheads are flowers with a cone-shaped center. Imagine these flowers without their colorful parts, and you know exactly what they look like when seeds are ripe."
      }
    ],
    "image_filenames": [
      "dalea_candida_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p4_1.png",
      "dalea_candida_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p4_2.png",
      "dalea_candida_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p4_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865116/dalea_candida_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p4_1_tmq0xc.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865116/dalea_candida_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p4_2_rzh4a2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865117/dalea_candida_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p4_3_a4ekb4.png"
    ],
    "page_number": 4
  },
  {
    "guide_id": 1282,
    "species_id": "sp_5",
    "scientific_name": "Dalea purpurea",
    "common_name": "Purple Prairie Clover",
    "family": "Fabaceae",
    "photo_date": "8-31-17",
    "description": "Crumbly Coneheads. After the clovers stop blooming, it can be tough to tell the sisters apart. Purple (D. purpurea) has skinnier leaflets – slender as pine needles; leaflets of white (D. candida) are 2-3 times wider. D. candida seeds are enclosed in a dry papery hull, black & tan colored; D. purpurea has fuzzy hulls, gray-peachy colored. Seeds do not need be de-hulled, especially if sown in fall.",
    "seed_group_names": [
      "Coneheads"
    ],
    "seed_group_details": [
      {
        "name": "Coneheads",
        "images": [
          "Coneheads_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Coneheads are flowers with a cone-shaped center. Imagine these flowers without their colorful parts, and you know exactly what they look like when seeds are ripe."
      }
    ],
    "image_filenames": [
      "dalea_purpurea_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p4_4.png",
      "dalea_purpurea_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p4_5.png",
      "dalea_purpurea_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p4_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865123/dalea_purpurea_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p4_4_hfxma5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865123/dalea_purpurea_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p4_5_zotp7u.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865123/dalea_purpurea_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p4_6_vve0o1.png"
    ],
    "page_number": 4
  },
  {
    "guide_id": 1282,
    "species_id": "sp_6",
    "scientific_name": "Dianthus armeria",
    "common_name": "Deptford Pink",
    "family": "Caryophyllaceae",
    "photo_date": "9-2-19",
    "description": "Beaks. This bright pink wildflower hails from Europe, notably from the Deptford district in London. Likes disturbed areas. The tiny pops of color are attractive, but don’t spread this non-native.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "dianthus_armeria_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p4_7.png",
      "dianthus_armeria_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p4_8.png",
      "dianthus_armeria_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p4_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865134/dianthus_armeria_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p4_7_cccypd.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865135/dianthus_armeria_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p4_8_ccacvl.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865140/dianthus_armeria_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p4_9_izrosk.png"
    ],
    "page_number": 4
  },
  {
    "guide_id": 1282,
    "species_id": "sp_7",
    "scientific_name": "Monarda fistulosa",
    "common_name": "Wild Bergamot",
    "family": "Lamiaceae",
    "photo_date": "9-7-17",
    "description": "Shakers. Mama’s Boy. This common wildflower is found in prairies & savannas. Similar odor to the citrus fruit of the same name, which is popular as an essential oil & in Earl Gray tea. Lavender florets drop off, leaving the tube-shaped calyx behind. Tip the head into your hand, seeds fall out of the tubes when ripe. Popular with many pollinators, including the rusty patched bumblebee.",
    "seed_group_names": [
      "Shakers"
    ],
    "seed_group_details": [
      {
        "name": "Shakers",
        "images": [
          "Shakers_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Shakers drop seeds very close to the mother plant, when shaken loose by the wind or a passing critter. Usually a Mama’s Boy, unless strong weather occurs."
      }
    ],
    "image_filenames": [
      "monarda_fistulosa_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p5_1.png",
      "monarda_fistulosa_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p5_2.png",
      "monarda_fistulosa_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p5_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865250/monarda_fistulosa_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p5_1_fuatnq.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865250/monarda_fistulosa_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p5_2_v6kak3.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865251/monarda_fistulosa_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p5_3_zfilor.png"
    ],
    "page_number": 5
  },
  {
    "guide_id": 1282,
    "species_id": "sp_9",
    "scientific_name": "Silphium integrifolium var. neglectum",
    "common_name": "Bald Rosinweed",
    "family": "Asteraceae",
    "photo_date": "9-7-17",
    "description": "Coneheads. There are now 3 varieties of rosinweed recognized in our area. Look at the bracts (greenery behind the flower). In the typical species, the bracts (aka phyllaries) are rough with fine hairs, but hairs lack glands. (Glandular hairs look like lollipops). The varieties have glandular hairs on the bracts; var. deamii also has soft hairs all over leaf undersides; var. neglectum has hairless leaves or hairy veins only.",
    "seed_group_names": [
      "Coneheads"
    ],
    "seed_group_details": [
      {
        "name": "Coneheads",
        "images": [
          "Coneheads_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Coneheads are flowers with a cone-shaped center. Imagine these flowers without their colorful parts, and you know exactly what they look like when seeds are ripe."
      }
    ],
    "image_filenames": [
      "silphium_integrifolium_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p5_7.png",
      "silphium_integrifolium_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p5_8.png",
      "silphium_integrifolium_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p5_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865353/silphium_integrifolium_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p5_7_t6sbqx.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865353/silphium_integrifolium_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p5_8_blulrs.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865354/silphium_integrifolium_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p5_9_teelqp.png"
    ],
    "page_number": 5
  },
  {
    "guide_id": 1282,
    "species_id": "sp_10",
    "scientific_name": "Silphium terebinthinaceum",
    "common_name": "Prairie Dock",
    "family": "Asteraceae",
    "photo_date": "9-28-17",
    "description": "Coneheads. This Silphium has the ginormous elephant ear leaves that are fun to stomp on in fall. Seed heads are smaller than its sisters. Avoid nodding heads; seeds have aborted due to weevil damage. Can hybridize with compass plant (“compass dock”).",
    "seed_group_names": [
      "Coneheads"
    ],
    "seed_group_details": [
      {
        "name": "Coneheads",
        "images": [
          "Coneheads_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Coneheads are flowers with a cone-shaped center. Imagine these flowers without their colorful parts, and you know exactly what they look like when seeds are ripe."
      }
    ],
    "image_filenames": [
      "silphium_terebinthinaceum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p6_1.png",
      "silphium_terebinthinaceum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p6_2.png",
      "silphium_terebinthinaceum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p6_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865366/silphium_terebinthinaceum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p6_1_kcyzxi.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865366/silphium_terebinthinaceum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p6_2_c1kl9n.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865368/silphium_terebinthinaceum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p6_3_ab5dit.png"
    ],
    "page_number": 6
  },
  {
    "guide_id": 1282,
    "species_id": "sp_11",
    "scientific_name": "Silphium laciniatum",
    "common_name": "Compass Plant",
    "family": "Asteraceae",
    "photo_date": "10-4-17",
    "description": "Coneheads. Collect seeds when they are shades of brown or beige; the unusual burgundy color in this seed photo is likely a sign of abnormally cold weather. Like all sunflower-relations, birds love to eat these seeds; don’t delay too long in collecting.",
    "seed_group_names": [
      "Coneheads"
    ],
    "seed_group_details": [
      {
        "name": "Coneheads",
        "images": [
          "Coneheads_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Coneheads are flowers with a cone-shaped center. Imagine these flowers without their colorful parts, and you know exactly what they look like when seeds are ripe."
      }
    ],
    "image_filenames": [
      "silphium_laciniatum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p6_4.png",
      "silphium_laciniatum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p6_5.png",
      "silphium_laciniatum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p6_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865354/silphium_laciniatum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p6_4_jzr95h.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865355/silphium_laciniatum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p6_5_kgqzgw.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865356/silphium_laciniatum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p6_6_ypkkol.png"
    ],
    "page_number": 6
  },
  {
    "guide_id": 1282,
    "species_id": "sp_12",
    "scientific_name": "Ratibida pinnata",
    "common_name": "Yellow Coneflower",
    "family": "Asteraceae",
    "photo_date": "9-7-17",
    "description": "Crumbly Coneheads. Mama’s Boy. A great seed for group workdays! Ripe seeds easily crumble & strip by hand. The seeds are graphitegray, tucked between lighter gray chaff. Seeds have a refreshing odor, usually described as citrus-like.",
    "seed_group_names": [
      "Coneheads"
    ],
    "seed_group_details": [
      {
        "name": "Coneheads",
        "images": [
          "Coneheads_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Coneheads are flowers with a cone-shaped center. Imagine these flowers without their colorful parts, and you know exactly what they look like when seeds are ripe."
      }
    ],
    "image_filenames": [
      "ratibida_pinnata_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p6_7.png",
      "ratibida_pinnata_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p6_8.png",
      "ratibida_pinnata_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p6_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865300/ratibida_pinnata_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p6_7_hzabyf.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865303/ratibida_pinnata_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p6_8_jhwl7r.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865308/ratibida_pinnata_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p6_9_oz7nv6.png"
    ],
    "page_number": 6
  },
  {
    "guide_id": 1282,
    "species_id": "sp_13",
    "scientific_name": "Hieracium umbellatum",
    "common_name": "Canada Hawkweed",
    "family": "Asteraceae",
    "photo_date": "9-9-18",
    "description": "Fluffy. Hawkweeds, like all dandelion-imitators, are often overlooked. This conservative species (C = 8) has more leaves on the stem than any other in the area, with over 24 leaves per stem. Likes wet-mesic to dry-mesic prairies and dry-mesic to dry savannas.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "hieracium_umbellatum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p7_1.png",
      "hieracium_umbellatum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p7_2.png",
      "hieracium_umbellatum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p7_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865212/hieracium_umbellatum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p7_1_el9kfm.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865212/hieracium_umbellatum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p7_2_n5ayam.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865214/hieracium_umbellatum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p7_3_kyvhur.png"
    ],
    "page_number": 7
  },
  {
    "guide_id": 1282,
    "species_id": "sp_14",
    "scientific_name": "Chamaecrista fasciculata",
    "common_name": "Common Partridge Pea",
    "family": "Caesalpiniaceae",
    "photo_date": "9-10-17",
    "description": "Ballistic. This annual wildflower is very successful in restorations. The bright yellow flowers look similar to Senna and are popular with pollinators. Skinny pods split & spiral open to catapult the seeds away. Collect when pods are brown, store in a closed paper or mesh bag.",
    "seed_group_names": [
      "Ballistic"
    ],
    "seed_group_details": [
      {
        "name": "Ballistic",
        "images": [
          "Ballistic_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Ballistic capsules catapult their babies away, up to 30 feet! Search YouTube for “exploding seeds” to see these in action. To harvest: learn the ripening sequence & harvest just before explosion; store in a *sealed* paper bag or mesh bag for a day or two."
      }
    ],
    "image_filenames": [
      "chamaecrista_fasciculata_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p7_4.png",
      "chamaecrista_fasciculata_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p7_5.png",
      "chamaecrista_fasciculata_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p7_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865092/chamaecrista_fasciculata_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p7_4_h7zgti.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865092/chamaecrista_fasciculata_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p7_5_wydwgu.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865094/chamaecrista_fasciculata_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p7_6_ncz9o9.png"
    ],
    "page_number": 7
  },
  {
    "guide_id": 1282,
    "species_id": "sp_15",
    "scientific_name": "Desmodium canadense",
    "common_name": "Showy Ticktrefoil",
    "family": "Fabaceae",
    "photo_date": "9-11-17",
    "description": "Hitchhikers. Mama’s Boy. Common in prairie restorations. Leaves are longer than they are wide, the seed “ticks” will be in chains of 3 or more. Leaf underside is hairy across the surface and especially on the veins. The loment (complete pod) is made up of individual “articles” (“ticks”) that are rounded rather than triangular. De-hulling is not necessary, especially with fall sowing. Collect when they hitchhike.",
    "seed_group_names": [
      "Hitchhikers"
    ],
    "seed_group_details": [
      {
        "name": "Hitchhikers",
        "images": [
          "Hitchhikers_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Hitchhikers are easy to tell when ripe – they hitch a ride on your pants! Color can be an indicator, but not always. Do Not Collect."
      }
    ],
    "image_filenames": [
      "desmodium_canadense_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p7_7.png",
      "desmodium_canadense_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p7_8.png",
      "desmodium_canadense_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p7_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865132/desmodium_canadense_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p7_7_o3owda.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865132/desmodium_canadense_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p7_8_ny8bg5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865132/desmodium_canadense_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p7_9_lkmisq.png"
    ],
    "page_number": 7
  },
  {
    "guide_id": 1282,
    "species_id": "sp_16",
    "scientific_name": "Asclepias syriaca",
    "common_name": "Common Milkweed",
    "family": "Asclepiadaceae",
    "photo_date": "10-9-17",
    "description": "Milkweed. Milkweeds are especially popular due to their importance to monarchs. Asclepias are ripe when the pod splits; ignore the pod color. This is by far the most common species and can be identified by the large pods (follicles) covered with soft hooks. Leaves are fuzzy underneath. A. sullivantii has waxy pods (often ridges & points but no hooks); leaves are waxy-hairless, pink leaf vein is common.",
    "seed_group_names": [
      "Milkweed"
    ],
    "seed_group_details": [
      {
        "name": "Milkweed",
        "images": [
          "Milkweed_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Milkweed seeds are ripe when pods are split open & seeds are brown."
      }
    ],
    "image_filenames": [
      "asclepias_syriaca_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p8_1.png",
      "asclepias_syriaca_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p8_2.png",
      "asclepias_syriaca_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p8_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865066/asclepias_syriaca_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p8_1_ppq2gs.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865066/asclepias_syriaca_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p8_2_ptkbom.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865068/asclepias_syriaca_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p8_3_kwk0z2.png"
    ],
    "page_number": 8
  },
  {
    "guide_id": 1282,
    "species_id": "sp_17",
    "scientific_name": "Asclepias sullivantii",
    "common_name": "Prairie Milkweed",
    "family": "Asclepiadaceae",
    "photo_date": "9-12-17",
    "description": "Milkweed. The biggest challenge is often the processing. A few options: 1. Collect when pods first split but have not poofed; seeds are easy to remove by hand at this early stage. 2. DIY seed separator from https://MonarchWatch.org 3. A gentle shop vac (low horsepower for smaller seeded species), adding a vortex dust separator helps 4. Sow seed with poof. 5. Do not use fire to clean the seed, it kills it.",
    "seed_group_names": [
      "Milkweed"
    ],
    "seed_group_details": [
      {
        "name": "Milkweed",
        "images": [
          "Milkweed_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Milkweed seeds are ripe when pods are split open & seeds are brown."
      }
    ],
    "image_filenames": [
      "asclepias_sullivantii_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p8_4.png",
      "asclepias_sullivantii_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p8_5.png",
      "asclepias_sullivantii_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p8_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865062/asclepias_sullivantii_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p8_4_qbtewg.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865065/asclepias_sullivantii_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p8_5_iau1q1.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865065/asclepias_sullivantii_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p8_6_i0qshk.png"
    ],
    "page_number": 8
  },
  {
    "guide_id": 1282,
    "species_id": "sp_18",
    "scientific_name": "Asclepias viridiflora",
    "common_name": "Short Green Milkweed",
    "family": "Asclepiadaceae",
    "photo_date": "9-17-19",
    "description": "Milkweed. This rare milkweed is shorter than most species, often 1.5 feet tall, and leaves are skinny & elongated. Pods (follicles) are located in the leaf axils rather than the top of the plant. Coma (milkweed seed hairs) are sordid (dirty off-white); most species are bright white.",
    "seed_group_names": [
      "Milkweed"
    ],
    "seed_group_details": [
      {
        "name": "Milkweed",
        "images": [
          "Milkweed_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Milkweed seeds are ripe when pods are split open & seeds are brown."
      }
    ],
    "image_filenames": [
      "asclepias_viridiflora_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p8_7.png",
      "asclepias_viridiflora_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p8_8.png",
      "asclepias_viridiflora_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p8_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865074/asclepias_viridiflora_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p8_7_qg2tln.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865078/asclepias_viridiflora_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p8_8_savlbq.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865078/asclepias_viridiflora_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p8_9_ssoomu.png"
    ],
    "page_number": 8
  },
  {
    "guide_id": 1282,
    "species_id": "sp_19",
    "scientific_name": "Asclepias verticillata",
    "common_name": "Whorled Milkweed",
    "family": "Asclepiadaceae",
    "photo_date": "9-28-17",
    "description": "Milkweed. This milkweed loves old fields, a survivor species that is great for early restorations. Skinniest pods of the native species. Skinny leaves whorl around the stem, reminiscent of pine needles, although may be absent by harvest time. Seeds are smaller than other milkweeds.",
    "seed_group_names": [
      "Milkweed"
    ],
    "seed_group_details": [
      {
        "name": "Milkweed",
        "images": [
          "Milkweed_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Milkweed seeds are ripe when pods are split open & seeds are brown."
      }
    ],
    "image_filenames": [
      "asclepias_verticillata_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p9_1.png",
      "asclepias_verticillata_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p9_2.png",
      "asclepias_verticillata_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p9_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865071/asclepias_verticillata_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p9_1_drkunh.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865072/asclepias_verticillata_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p9_2_p0j1cv.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865072/asclepias_verticillata_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p9_3_sadmbo.png"
    ],
    "page_number": 9
  },
  {
    "guide_id": 1282,
    "species_id": "sp_20",
    "scientific_name": "Gaura longiflora",
    "common_name": "Common Gaura",
    "family": "Onagraceae",
    "photo_date": "9-11-17",
    "description": "Shattering. This annual/biennial species does well in prairie restorations & disturbed old field soils. The white & pink flowers give way to little football shaped seeds. Examine the stem hairs: this species has stem hairs that are curly, appressed (flattened), or strongly ascending. G. biennis has straight spreading hairs (perpendicular to the stem) and Flora suggests this is native a little to the south. Collect 10%",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "gaura_longiflora_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p9_4.png",
      "gaura_longiflora_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p9_5.png",
      "gaura_longiflora_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p9_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865165/gaura_longiflora_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p9_4_oufsox.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865166/gaura_longiflora_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p9_5_lutda2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865166/gaura_longiflora_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p9_6_i9dg1s.png"
    ],
    "page_number": 9
  },
  {
    "guide_id": 1282,
    "species_id": "sp_21",
    "scientific_name": "Isanthus brachiatus",
    "common_name": "False Pennyroyal",
    "family": "Lamiaceae",
    "photo_date": "9-17-20",
    "description": "Shakers. This sweet little purple flower is found in gravelly prairies and fens. Threatened by habitat loss, especially by gravel mining. Plant is typically about a foot tall. Fine hairs cover the plant, stems are square. Seeds are reminiscent of Teucrium, with dimpled surface and seated inside a pointy cup. Up to 4 seeds per cup.",
    "seed_group_names": [
      "Shakers"
    ],
    "seed_group_details": [
      {
        "name": "Shakers",
        "images": [
          "Shakers_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Shakers drop seeds very close to the mother plant, when shaken loose by the wind or a passing critter. Usually a Mama’s Boy, unless strong weather occurs."
      }
    ],
    "image_filenames": [
      "isanthus_brachiatus_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p9_7.png",
      "isanthus_brachiatus_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p9_8.png",
      "isanthus_brachiatus_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p9_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865222/isanthus_brachiatus_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p9_7_cdqykl.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865222/isanthus_brachiatus_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p9_8_ec4tdd.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865224/isanthus_brachiatus_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p9_9_vtra6h.png"
    ],
    "page_number": 9
  },
  {
    "guide_id": 1282,
    "species_id": "sp_22",
    "scientific_name": "Ambrosia trifida",
    "common_name": "Giant Ragweed",
    "family": "Asteraceae",
    "photo_date": "9-19-20",
    "description": "Shattering. Ah-choo! Ragweed and its wind-born pollen is the cause of hay fever (not the slandered goldenrods, which are insectpollinated). This species is truly giant, often growing over your head. Leaves have 3 lobes. The ragweeds have been included in “noxious weed” laws for many states. Annual.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "ambrosia_trifida_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p10_1.png",
      "ambrosia_trifida_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p10_2.png",
      "ambrosia_trifida_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p10_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865051/ambrosia_trifida_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p10_1_j74vn6.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865051/ambrosia_trifida_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p10_2_fwxvyx.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865052/ambrosia_trifida_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p10_3_xypf9a.png"
    ],
    "page_number": 10
  },
  {
    "guide_id": 1282,
    "species_id": "sp_23",
    "scientific_name": "Ambrosia artemisiifolia",
    "common_name": "Common Ragweed",
    "family": "Asteraceae",
    "photo_date": "9-27-20",
    "description": "Shattering. Common ragweed is a more diminutive sister, usually shin-tall. This species is also on the IL Noxious Weed List, thanks to its allergen abilities. Leaves are lobed & divided. Shows up most often in disturbed soils, and can be an ok ‘nurse crop’ while new prairies establish; this annual will give way to the stronger perennial natives.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "ambrosia_artemisiifolia_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p10_4.png",
      "ambrosia_artemisiifolia_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p10_5.png",
      "ambrosia_artemisiifolia_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p10_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865049/ambrosia_artemisiifolia_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p10_4_xzi9xv.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865050/ambrosia_artemisiifolia_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p10_5_gz3wpl.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865050/ambrosia_artemisiifolia_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p10_6_cpuwlf.png"
    ],
    "page_number": 10
  },
  {
    "guide_id": 1282,
    "species_id": "sp_24",
    "scientific_name": "Astragalus canadensis",
    "common_name": "Canadian Milkvetch",
    "family": "Fabaceae",
    "photo_date": "9-19-17",
    "description": "Beaks. This species was historically uncommon, but is the most easily Astragalus found from native nurseries and has been successfully seeded into restorations. Plants have few hairs, and they are connected in the middle rather than attached at the base of the hair. Snip clusters of black pods; the apex of the pod should be open. The creamy-white flowers are attractive to bees. Deer & weevils can be a problem.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "astragalus_canadensis_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p10_7.png",
      "astragalus_canadensis_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p10_8.png",
      "astragalus_canadensis_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p10_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865079/astragalus_canadensis_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p10_7_px34t9.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865083/astragalus_canadensis_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p10_8_jvlnsi.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865083/astragalus_canadensis_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p10_9_bp551v.png"
    ],
    "page_number": 10
  },
  {
    "guide_id": 1282,
    "species_id": "sp_25",
    "scientific_name": "Helianthus grosseserratus",
    "common_name": "Sawtooth Sunflower",
    "family": "Asteraceae",
    "photo_date": "9-19-20",
    "description": "Coneheads. If you spot a tall sunflower in a prairie, it’s probably this one. Generally not recommended for collection, this species spreads fine on its own, by seeds & rhizomes. Tall, often head-high or taller, with many serrated leaves. Leaves lay flat (not folded along the main vein). Soft hairs on the underside of the leaf. Sunflowers are notoriously frisky, with many natural hybrids and varieties to confuse the issue.",
    "seed_group_names": [
      "Coneheads"
    ],
    "seed_group_details": [
      {
        "name": "Coneheads",
        "images": [
          "Coneheads_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Coneheads are flowers with a cone-shaped center. Imagine these flowers without their colorful parts, and you know exactly what they look like when seeds are ripe."
      }
    ],
    "image_filenames": [
      "helianthus_grosseserratus_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p11_1.png",
      "helianthus_grosseserratus_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p11_2.png",
      "helianthus_grosseserratus_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p11_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865184/helianthus_grosseserratus_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p11_1_het1dr.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865184/helianthus_grosseserratus_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p11_2_fs7bco.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865185/helianthus_grosseserratus_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p11_3_ungfwk.png"
    ],
    "page_number": 11
  },
  {
    "guide_id": 1282,
    "species_id": "sp_26",
    "scientific_name": "Helianthus maximilianii",
    "common_name": "Maximilian Sunflower",
    "family": "Asteraceae",
    "photo_date": "10-16-20",
    "description": "Coneheads. Another tall sunflower, but this one has leaves folded along the keel of the main leaf vein (“conduplicate”). Introduced from further west, this sunflower starts blooming a little later than most species (August). Short hairs on the stems & leaves.",
    "seed_group_names": [
      "Coneheads"
    ],
    "seed_group_details": [
      {
        "name": "Coneheads",
        "images": [
          "Coneheads_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Coneheads are flowers with a cone-shaped center. Imagine these flowers without their colorful parts, and you know exactly what they look like when seeds are ripe."
      }
    ],
    "image_filenames": [
      "helianthus_maximilianii_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p11_4.png",
      "helianthus_maximilianii_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p11_5.png",
      "helianthus_maximilianii_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p11_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865185/helianthus_maximilianii_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p11_4_umqt5s.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865188/helianthus_maximilianii_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p11_5_eegmhf.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865192/helianthus_maximilianii_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p11_6_qz0mua.png"
    ],
    "page_number": 11
  },
  {
    "guide_id": 1282,
    "species_id": "sp_27",
    "scientific_name": "Helianthus occidentalis",
    "common_name": "Western Sunflower",
    "family": "Asteraceae",
    "photo_date": "9-21-20",
    "description": "Coneheads. This sunflower often has basal leaves at flowering & harvest time, although sometimes absent just to keep you guessing. A few pairs of smaller leaves on the stem (often only 3-4 pairs). Dry prairies and their associated savannas, especially sandy & rocky soils.",
    "seed_group_names": [
      "Coneheads"
    ],
    "seed_group_details": [
      {
        "name": "Coneheads",
        "images": [
          "Coneheads_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Coneheads are flowers with a cone-shaped center. Imagine these flowers without their colorful parts, and you know exactly what they look like when seeds are ripe."
      }
    ],
    "image_filenames": [
      "helianthus_occidentalis_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p11_7.png",
      "helianthus_occidentalis_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p11_8.png",
      "helianthus_occidentalis_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p11_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865200/helianthus_occidentalis_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p11_7_fqb35b.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865200/helianthus_occidentalis_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p11_8_yx85ay.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865201/helianthus_occidentalis_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p11_9_lgbloj.png"
    ],
    "page_number": 11
  },
  {
    "guide_id": 1282,
    "species_id": "sp_28",
    "scientific_name": "Helianthus mollis",
    "common_name": "Downy Sunflower",
    "family": "Asteraceae",
    "photo_date": "10-4-20",
    "description": "Coneheads. Well-named, this species is downy with hairs, giving a gray-green cast that is visible from a distance. The leaf shape also stands out: shorter and relatively plumper than most of our native sunflowers. Found most often in the southern part of the region, especially on drier, well-drained soils.",
    "seed_group_names": [
      "Coneheads"
    ],
    "seed_group_details": [
      {
        "name": "Coneheads",
        "images": [
          "Coneheads_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Coneheads are flowers with a cone-shaped center. Imagine these flowers without their colorful parts, and you know exactly what they look like when seeds are ripe."
      }
    ],
    "image_filenames": [
      "helianthus_mollis_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p12_1.png",
      "helianthus_mollis_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p12_2.png",
      "helianthus_mollis_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p12_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865193/helianthus_mollis_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p12_1_wyxieg.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865193/helianthus_mollis_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p12_2_uvfniv.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865193/helianthus_mollis_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p12_3_hdekrq.png"
    ],
    "page_number": 12
  },
  {
    "guide_id": 1282,
    "species_id": "sp_29",
    "scientific_name": "Helianthus pauciflorus",
    "common_name": "Prairie Sunflower",
    "family": "Asteraceae",
    "photo_date": "10-4-18",
    "description": "Coneheads. Slender seeds are contained within the conehead; snip dark heads. Rough leaves & reddish stems. Leaves are opposite and nearly stalkless, mostly at the bottom half of the stem. Phyllaries (greenery behind the flower) have tiny fringes but are otherwise hairless.",
    "seed_group_names": [
      "Coneheads"
    ],
    "seed_group_details": [
      {
        "name": "Coneheads",
        "images": [
          "Coneheads_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Coneheads are flowers with a cone-shaped center. Imagine these flowers without their colorful parts, and you know exactly what they look like when seeds are ripe."
      }
    ],
    "image_filenames": [
      "helianthus_pauciflorus_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p12_4.png",
      "helianthus_pauciflorus_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p12_5.png",
      "helianthus_pauciflorus_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p12_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865201/helianthus_pauciflorus_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p12_4_jr4ljw.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865202/helianthus_pauciflorus_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p12_5_wviiw5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865202/helianthus_pauciflorus_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p12_6_ti97ky.png"
    ],
    "page_number": 12
  },
  {
    "guide_id": 1282,
    "species_id": "sp_30",
    "scientific_name": "Heliopsis helianthoides",
    "common_name": "False Sunflower",
    "family": "Asteraceae",
    "photo_date": "10-13-17",
    "description": "Coneheads. Slender seeds are contained within the conehead; snip dark heads. “True” sunflowers have fertile disc florets (the sunflower “eye”). This species is named “False” because it has both fertile ray & disc florets. The ligules, or ray florets, hang on after the color fades.",
    "seed_group_names": [
      "Coneheads"
    ],
    "seed_group_details": [
      {
        "name": "Coneheads",
        "images": [
          "Coneheads_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Coneheads are flowers with a cone-shaped center. Imagine these flowers without their colorful parts, and you know exactly what they look like when seeds are ripe."
      }
    ],
    "image_filenames": [
      "heliopsis_helianthoides_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p12_7.png",
      "heliopsis_helianthoides_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p12_8.png",
      "heliopsis_helianthoides_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p12_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865211/heliopsis_helianthoides_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p12_7_xpysiy.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865211/heliopsis_helianthoides_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p12_8_tquw2a.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865211/heliopsis_helianthoides_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p12_9_tho1oh.png"
    ],
    "page_number": 12
  },
  {
    "guide_id": 1282,
    "species_id": "sp_31",
    "scientific_name": "Allium cernuum",
    "common_name": "Nodding Wild Onion",
    "family": "Alliaceae",
    "photo_date": "9-20-17",
    "description": "Beaks. Globes of Allium flowers are familiar to gardeners; this native one has little flowers that can be pale purple to white. The main stem has a bend right behind the head, inspiring the common name. Look for clusters to split open in 3s, revealing the black seeds inside.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "allium_cernuum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p13_1.png",
      "allium_cernuum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p13_2.png",
      "allium_cernuum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p13_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865047/allium_cernuum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p13_1_lzzct5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865047/allium_cernuum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p13_2_u7dvvt.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865048/allium_cernuum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p13_3_pkxxg4.png"
    ],
    "page_number": 13
  },
  {
    "guide_id": 1282,
    "species_id": "sp_32",
    "scientific_name": "Cirsium discolor",
    "common_name": "Pasture Thistle",
    "family": "Asteraceae",
    "photo_date": "9-23-19",
    "description": "Fluffy. Native thistles are just as attractive to pollinators and birds as the non-native species, but these are far less aggressive! Discolor refers to the 2-tone leaves (green above, white underneath). Lobed leaves. Tall like bull thistle, but without big spines on stem. Pale purple flowers. This species likes mesic to dry-mesic prairies, savannas, and old fields. Collect heads when fluffy. Biennial, collect 10%",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "cirsium_discolor_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p13_4.png",
      "cirsium_discolor_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p13_5.png",
      "cirsium_discolor_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p13_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865098/cirsium_discolor_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p13_4_swhk15.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865101/cirsium_discolor_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p13_5_xd9rzg.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865102/cirsium_discolor_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p13_6_u8gw3a.png"
    ],
    "page_number": 13
  },
  {
    "guide_id": 1282,
    "species_id": "sp_33",
    "scientific_name": "Cirsium vulgare",
    "common_name": "Bull Thistle",
    "family": "Asteraceae",
    "photo_date": "10-1-20",
    "description": "Fluffy. This non-native thistle is a beast! Spiny leaves, winged ridges on the stem with spines, and spines on the bracts underneath the flowers. Old fields and disturbed soils. Lake Co has the dubious distinction of the first historic collection for the region, found in 1889.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "cirsium_vulgare_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p13_7.png",
      "cirsium_vulgare_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p13_8.png",
      "cirsium_vulgare_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p13_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865102/cirsium_vulgare_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p13_7_lopx87.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865104/cirsium_vulgare_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p13_8_q4paad.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865107/cirsium_vulgare_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p13_9_bz45la.png"
    ],
    "page_number": 13
  },
  {
    "guide_id": 1282,
    "species_id": "sp_34",
    "scientific_name": "Lobelia spicata",
    "common_name": "Pale-spiked Lobelia",
    "family": "Lobeliaceae",
    "photo_date": "9-28-18",
    "description": "Beaks. This diminutive plant is a sister to blue lobelia, with miniature pale blue flowers. The beaks of Lobelias often open up to look like pig noses, with 2 channels within the beak. Seeds are tiny – 1 ounce contains 900,000 seeds! Snip stalks when beaks open.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "lobelia_spicata_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p14_1.png",
      "lobelia_spicata_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p14_2.png",
      "lobelia_spicata_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p14_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865245/lobelia_spicata_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p14_1_mkocrl.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865248/lobelia_spicata_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p14_2_moetk9.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865249/lobelia_spicata_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p14_3_d0saqq.png"
    ],
    "page_number": 14
  },
  {
    "guide_id": 1282,
    "species_id": "sp_35",
    "scientific_name": "Penstemon digitalis",
    "common_name": "Foxglove Beard Tongue",
    "family": "Scrophulariaceae",
    "photo_date": "9-28-18",
    "description": "Beaks. This species seeds successfully into prairie & savanna restorations. Look for rusty-brown pods that have split open. The pods are memorably stinky (don’t store in a closed container) and are unusually hard; best processed with a machine, strong rolling pins, or stomping.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "penstemon_digitalis_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p14_4.png",
      "penstemon_digitalis_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p14_5.png",
      "penstemon_digitalis_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p14_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865278/penstemon_digitalis_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p14_4_zasouk.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865278/penstemon_digitalis_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p14_5_rdgm5f.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865278/penstemon_digitalis_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p14_6_lu0oun.png"
    ],
    "page_number": 14
  },
  {
    "guide_id": 1282,
    "species_id": "sp_36",
    "scientific_name": "Scutellaria leonardii",
    "common_name": "Prairie Skullcap",
    "family": "Lamiaceae",
    "photo_date": "9-28-18",
    "description": "Shakers. Skullcaps hold their seeds on a little “scoop shovel” with a cap on top. The cap falls off, and the seed will fall to the ground with rain or a passing animal. Collect when caps are beige or loose. This diminutive species lives in prairies & open savannas. Formerly a variety of S. parvula. This species has revolute leaf margins (edges are rolled under) & glandless hairs; S. parvula has flat leaves and glandular hairs.",
    "seed_group_names": [
      "Shakers"
    ],
    "seed_group_details": [
      {
        "name": "Shakers",
        "images": [
          "Shakers_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Shakers drop seeds very close to the mother plant, when shaken loose by the wind or a passing critter. Usually a Mama’s Boy, unless strong weather occurs."
      }
    ],
    "image_filenames": [
      "scutellaria_leonardii_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p14_7.png",
      "scutellaria_leonardii_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p14_8.png",
      "scutellaria_leonardii_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p14_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865334/scutellaria_leonardii_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p14_7_xqnlbg.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865334/scutellaria_leonardii_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p14_8_j2jt6f.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865335/scutellaria_leonardii_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p14_9_dseojo.png"
    ],
    "page_number": 14
  },
  {
    "guide_id": 1282,
    "species_id": "sp_37",
    "scientific_name": "Vernonia missurica",
    "common_name": "Missouri Ironweed",
    "family": "Asteraceae",
    "photo_date": "10-2-20",
    "description": "Fluffy. Similar to the common ironweed, except the stems & leaf undersides are very hairy. Count the number of seeds (more than 31) to distinguish from V. gigantea. Seed fluff is typically rusty or straw-colored in this species. Vernonia species tend to hold the fluffy heads closed more than other fluffy species, which can make it tougher to process the seed.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "vernonia_missurica_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p15_1.png",
      "vernonia_missurica_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p15_2.png",
      "vernonia_missurica_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p15_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865374/vernonia_missurica_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p15_1_tgir06.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865377/vernonia_missurica_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p15_2_duiiux.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865386/vernonia_missurica_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p15_3_m7zlbq.png"
    ],
    "page_number": 15
  },
  {
    "guide_id": 1282,
    "species_id": "sp_38",
    "scientific_name": "Opuntia cespitosa",
    "common_name": "Eastern Prickly Pear",
    "family": "Cactaceae",
    "photo_date": "10-2-20",
    "description": "Berries. Yes, an IL native! Found in sandy soils. 0-2 spines per node. Sunny yellow flowers become plump fruits in shades of yellow, red or burgundy. Can also be propagated vegetatively. Remove a “paddle” and bury halfway into well-drained soil; cute little paddles grow out of the tops like Mickey growing his mouse ears. Handle with gloves, tiny, nearly invisible spines may become stuck in your skin.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "opuntia_cespitosa_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p15_4.png",
      "opuntia_cespitosa_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p15_5.png",
      "opuntia_cespitosa_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p15_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865260/opuntia_cespitosa_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p15_4_dovdk6.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865264/opuntia_cespitosa_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p15_5_j2v9lb.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865270/opuntia_cespitosa_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p15_6_nubsxx.png"
    ],
    "page_number": 15
  },
  {
    "guide_id": 1282,
    "species_id": "sp_39",
    "scientific_name": "Parthenium integrifolium",
    "common_name": "Wild Quinine",
    "family": "Asteraceae",
    "photo_date": "10-3-20",
    "description": "Coneheads. Pioneer medicine, with similar properties to Peruvian quinine. Little white flowers turn gray as they ripen, and the flower heads relax & open up to release the seeds. Like the prairie dock family, the seeds are found in the middle ring (sandwiched between the greenery & the center disc florets). Snip heads when gray. Seeds are rounded and smooth on one side, ribbed on the other.",
    "seed_group_names": [
      "Coneheads"
    ],
    "seed_group_details": [
      {
        "name": "Coneheads",
        "images": [
          "Coneheads_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Coneheads are flowers with a cone-shaped center. Imagine these flowers without their colorful parts, and you know exactly what they look like when seeds are ripe."
      }
    ],
    "image_filenames": [
      "parthenium_integrifolium_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p15_7.png",
      "parthenium_integrifolium_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p15_8.png",
      "parthenium_integrifolium_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p15_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865270/parthenium_integrifolium_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p15_7_vfkslb.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865271/parthenium_integrifolium_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p15_8_nfsivf.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865272/parthenium_integrifolium_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p15_9_a8wmuf.png"
    ],
    "page_number": 15
  },
  {
    "guide_id": 1282,
    "species_id": "sp_40",
    "scientific_name": "Lespedeza capitata",
    "common_name": "Round-headed Bush Clover",
    "family": "Fabaceae",
    "photo_date": "10-4-17",
    "description": "Shattering. Mama’s Boy. This legume is seeded extensively in prairie restorations. Showiest in fall, with chocolate brown heads contrasting against its green leaves. Snip dark heads. Almond-shaped hulls contain individual beans; de-hulling is not necessary with fall sowing.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "lespedeza_capitata_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p16_1.png",
      "lespedeza_capitata_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p16_2.png",
      "lespedeza_capitata_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p16_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865223/lespedeza_capitata_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p16_1_dekjqf.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865231/lespedeza_capitata_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p16_2_kjaoxl.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865231/lespedeza_capitata_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p16_3_kcvhfm.png"
    ],
    "page_number": 16
  },
  {
    "guide_id": 1282,
    "species_id": "sp_41",
    "scientific_name": "Physostegia praemorsa",
    "common_name": "Prairie Obedient Plant",
    "family": "Lamiaceae",
    "photo_date": "9-15-19, 10-6-19",
    "description": "Shakers. Mama’s Boy. Obedient plant species are fun to play with: the flowers can be nudged around the stem and they obediently stay put. P. praemorsa leaves are less than 1.5 cm wide. Flowers are more than 2.4 cm long. Often has multiple empty bracts that did not flower.",
    "seed_group_names": [
      "Shakers"
    ],
    "seed_group_details": [
      {
        "name": "Shakers",
        "images": [
          "Shakers_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Shakers drop seeds very close to the mother plant, when shaken loose by the wind or a passing critter. Usually a Mama’s Boy, unless strong weather occurs."
      }
    ],
    "image_filenames": [
      "physostegia_praemorsa_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p16_4.png",
      "physostegia_praemorsa_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p16_5.png",
      "physostegia_praemorsa_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p16_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865282/physostegia_praemorsa_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p16_4_qsontt.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865287/physostegia_praemorsa_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p16_5_ds00j5.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865287/physostegia_praemorsa_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p16_6_x7ez6o.png"
    ],
    "page_number": 16
  },
  {
    "guide_id": 1282,
    "species_id": "sp_42",
    "scientific_name": "Physostegia virginiana",
    "common_name": "Obedient Plant",
    "family": "Lamiaceae",
    "photo_date": "9-15-19, 10-6-19",
    "description": "Shakers. Mama’s Boy. Physostegia bloom from bottom to top; seeds ripen in the same sequence. Up to 4 seeds per cup (the calyx). Collect when seeds are fully brown; cup color is unimportant. Common to have mix of plump viable seed and wrinkly empty seed. P. virginiana leaves are less than 2.3 cm wide. Flowers less than 2.4 cm long. Most bracts have flowers (less than 3 empty bracts per stalk).",
    "seed_group_names": [
      "Shakers"
    ],
    "seed_group_details": [
      {
        "name": "Shakers",
        "images": [
          "Shakers_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Shakers drop seeds very close to the mother plant, when shaken loose by the wind or a passing critter. Usually a Mama’s Boy, unless strong weather occurs."
      }
    ],
    "image_filenames": [
      "physostegia_virginiana_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p16_7.png",
      "physostegia_virginiana_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p16_8.png",
      "physostegia_virginiana_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p16_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865288/physostegia_virginiana_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p16_7_dm6le2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865288/physostegia_virginiana_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p16_8_zjuwza.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865291/physostegia_virginiana_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p16_9_avm9qu.png"
    ],
    "page_number": 16
  },
  {
    "guide_id": 1282,
    "species_id": "sp_43",
    "scientific_name": "Eupatorium altissimum",
    "common_name": "Tall Boneset",
    "family": "Asteraceae",
    "photo_date": "10-8-18",
    "description": "Fluffy. Collect when poofy, easy to pluck off of the plant. Stems are hairy throughout. Leaves are stalkless or slight stalks attaching to the stem, but never perfoliate (growing completely around the stem). Leaf is usually serrated on the pointed half, but not the back half of the leaf.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "eupatorium_altissimum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p17_1.png",
      "eupatorium_altissimum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p17_2.png",
      "eupatorium_altissimum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p17_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865154/eupatorium_altissimum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p17_1_akll84.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865154/eupatorium_altissimum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p17_2_xyocqe.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865154/eupatorium_altissimum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p17_3_t8shd7.png"
    ],
    "page_number": 17
  },
  {
    "guide_id": 1282,
    "species_id": "sp_44",
    "scientific_name": "Eupatorium serotinum",
    "common_name": "Late Boneset",
    "family": "Asteraceae",
    "photo_date": "10-17-18",
    "description": "Fluffy. The only Eupatorium with petioles (leaf stems) longer than 5 mm. Nearly hairless lower stem. Dense coating of white hairs on the phyllaries (bracts behind the flower), and resinous glands (dots) on the leaf underside help distinguish this from the other Eupatorium species.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "eupatorium_serotinum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p17_4.png",
      "eupatorium_serotinum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p17_5.png",
      "eupatorium_serotinum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p17_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865156/eupatorium_serotinum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p17_4_qt3dwb.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865156/eupatorium_serotinum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p17_5_r04b1t.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865156/eupatorium_serotinum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p17_6_knloan.png"
    ],
    "page_number": 17
  },
  {
    "guide_id": 1282,
    "species_id": "sp_45",
    "scientific_name": "Brickellia eupatorioides var. corymbulosa",
    "common_name": "False Boneset",
    "family": "Asteraceae",
    "photo_date": "10-13-18",
    "description": "Fluffy. This species is quickly identified as False because the leaves are alternate, whereas true Eupatorium have opposite or whorled leaves. Flowers are similar to the other bonesets, except this species has creamy flowers instead of white. Phyllaries (greenery behind the flower) are strongly striped. Pappus (seed poof) is feathery; most species have straight-haired pappus. Pappus is bright white.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "brickellia_eupatorioides_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p17_7.png",
      "brickellia_eupatorioides_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p17_8.png",
      "brickellia_eupatorioides_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p17_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865090/brickellia_eupatorioides_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p17_7_d5ndqg.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865092/brickellia_eupatorioides_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p17_8_t2ryqe.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865091/brickellia_eupatorioides_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p17_9_fxb0wd.png"
    ],
    "page_number": 17
  },
  {
    "guide_id": 1282,
    "species_id": "sp_46",
    "scientific_name": "Apocynum cannabinum var. glaberrimum",
    "common_name": "Smooth Dogbane",
    "family": "Apocynaceae",
    "photo_date": "10-6-20",
    "description": "Fluffy. Completely smooth. Leaves are on short petioles (3-4mm long). Most of the leaves are ascending to the sky, and overtop the flowers & seeds. Silky seed hairs are more than 2cm long. Consult Flora for varieties. This is a common species that often spreads well on its own.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "apocynum_cannabinum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p18_1.png",
      "apocynum_cannabinum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p18_2.png",
      "apocynum_cannabinum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p18_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865054/apocynum_cannabinum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p18_1_sqwzlt.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865054/apocynum_cannabinum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p18_2_euso0e.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865055/apocynum_cannabinum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p18_3_ko1lpa.png"
    ],
    "page_number": 18
  },
  {
    "guide_id": 1282,
    "species_id": "sp_47",
    "scientific_name": "Apocynum sibiricum",
    "common_name": "Smooth Indian Hemp",
    "family": "Apocynaceae",
    "photo_date": "10-15-18",
    "description": "Fluffy. Not a milkweed but similar seed dispersal: pods split open and seeds fly away on their attached fluff. A locally aggressive lowquality native; this is rarely collected. Leaves are sessile (stalkless) or close to it; most Apocynum species have petioles of 3 mm or longer. Leaves are hairless on both sides; var. farwellii is hairy on the underside of the leaf. Prone to hybridizing with other Apocynum species.",
    "seed_group_names": [
      "Fluffy",
      "Milkweed"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      },
      {
        "name": "Milkweed",
        "images": [
          "Milkweed_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Milkweed seeds are ripe when pods are split open & seeds are brown."
      }
    ],
    "image_filenames": [
      "apocynum_sibiricum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p18_4.png",
      "apocynum_sibiricum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p18_5.png",
      "apocynum_sibiricum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p18_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865056/apocynum_sibiricum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p18_4_qkyb9q.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865058/apocynum_sibiricum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p18_5_wdqvgq.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865057/apocynum_sibiricum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p18_6_rb9shw.png"
    ],
    "page_number": 18
  },
  {
    "guide_id": 1282,
    "species_id": "sp_48",
    "scientific_name": "Pycnanthemum pilosum",
    "common_name": "Hairy Mountain Mint",
    "family": "Lamiaceae",
    "photo_date": "10-9-20",
    "description": "Shakers. Similar to the common mountain mint, but bigger and hairy. Flower heads are double in size, leaves are broader (2-3x) & longer. Downy hairs on the square stem angles & sides (P. virginianum hairy on angles only), hairy leaves, hairy bracts. Naturally rare in the region, but available in commercial nurseries and in some reconstructions. Snip gray heads and/or tip gray heads over to spill out the seeds.",
    "seed_group_names": [
      "Shakers"
    ],
    "seed_group_details": [
      {
        "name": "Shakers",
        "images": [
          "Shakers_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Shakers drop seeds very close to the mother plant, when shaken loose by the wind or a passing critter. Usually a Mama’s Boy, unless strong weather occurs."
      }
    ],
    "image_filenames": [
      "pycnanthemum_pilosum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p18_7.png",
      "pycnanthemum_pilosum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p18_8.png",
      "pycnanthemum_pilosum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p18_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865297/pycnanthemum_pilosum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p18_7_vzvkzh.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865297/pycnanthemum_pilosum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p18_8_uyhwzc.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865297/pycnanthemum_pilosum_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p18_9_pcybp9.png"
    ],
    "page_number": 18
  },
  {
    "guide_id": 1282,
    "species_id": "sp_49",
    "scientific_name": "Abutilon theophrasti",
    "common_name": "Velvetleaf",
    "family": "Malvaceae",
    "photo_date": "10-12-19",
    "description": "Shattering. This is a common agriculture weed and a sign that your soils were likely farmed. Heart-shaped leaves are velvety soft. This flower gives way to more competitive species; it’s not a top priority for eradication.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "abutilon_theophrasti_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p19_1.png",
      "abutilon_theophrasti_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p19_2.png",
      "abutilon_theophrasti_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p19_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865046/abutilon_theophrasti_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p19_1_w8icxw.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865046/abutilon_theophrasti_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p19_2_tnayio.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865046/abutilon_theophrasti_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p19_3_lcnfhi.png"
    ],
    "page_number": 19
  },
  {
    "guide_id": 1282,
    "species_id": "sp_50",
    "scientific_name": "Oenothera biennis",
    "common_name": "Common Evening Primrose",
    "family": "Onagraceae",
    "photo_date": "10-13-19",
    "description": "Beaks. Mama’s Boy. This sunny yellow primrose missed the memo about blooming in the evening. Loves disturbed soils; this is an early pioneering native species. Self-sows easily, rarely need to collect this one.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "oenothera_biennis_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p19_4.png",
      "oenothera_biennis_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p19_5.png",
      "oenothera_biennis_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p19_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865260/oenothera_biennis_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p19_4_ofg7ov.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865260/oenothera_biennis_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p19_5_rzbdi7.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865260/oenothera_biennis_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p19_6_f91tm6.png"
    ],
    "page_number": 19
  },
  {
    "guide_id": 1282,
    "species_id": "sp_51",
    "scientific_name": "Coreopsis tripteris",
    "common_name": "Tall Coreopsis",
    "family": "Asteraceae",
    "photo_date": "10-16-17",
    "description": "Coneheads. Mama’s Boy. One of 3 Coreopsis native to the area, and the other 2 are less than 2’ tall. Tripteris (3-winged) refers to the leaflets of 3. Look for dark heads. They will be easy to crumble up by hand when ripe.",
    "seed_group_names": [
      "Coneheads"
    ],
    "seed_group_details": [
      {
        "name": "Coneheads",
        "images": [
          "Coneheads_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Coneheads are flowers with a cone-shaped center. Imagine these flowers without their colorful parts, and you know exactly what they look like when seeds are ripe."
      }
    ],
    "image_filenames": [
      "coreopsis_tripteris_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p19_7.png",
      "coreopsis_tripteris_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p19_8.png",
      "coreopsis_tripteris_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p19_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865110/coreopsis_tripteris_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p19_7_f0gj9g.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865110/coreopsis_tripteris_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p19_8_opa9f2.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865113/coreopsis_tripteris_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p19_9_vaowa9.png"
    ],
    "page_number": 19
  },
  {
    "guide_id": 1282,
    "species_id": "sp_52",
    "scientific_name": "Gentiana alba",
    "common_name": "Yellowish Gentian",
    "family": "Gentianaceae",
    "photo_date": "10-24-19",
    "description": "Beaks. The closed cream flower fades to paper bag brown and a pair of plump duck bills emerges. Collect when the beak starts to open. Tiny papery seeds look like a beige fried egg. Hard to ID from G. andrewsii; if both species are present, easiest to flag while blooming. Leaf margins can be keyed with a 10x lens: smooth for G. alba and fringed hairs for G. andrewsii. Consult Flora for hybrids and varieties.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "gentiana_alba_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p20_1.png",
      "gentiana_alba_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p20_2.png",
      "gentiana_alba_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p20_3.png",
      "gentiana_alba_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p20_4.png",
      "gentiana_alba_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p20_5.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865168/gentiana_alba_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p20_1_bampgo.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865169/gentiana_alba_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p20_2_l2n9uf.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865170/gentiana_alba_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p20_3_shl4vb.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865172/gentiana_alba_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p20_4_wm7wpp.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865176/gentiana_alba_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p20_5_d0hefo.png"
    ],
    "page_number": 20
  },
  {
    "guide_id": 1282,
    "species_id": "sp_53",
    "scientific_name": "Gentianella quinquefolia subsp. occidentalis",
    "common_name": "Stiff Gentian",
    "family": "Gentianaceae",
    "photo_date": "11-8-19",
    "description": "Beaks. This petite annual/biennial has sweet little purple flowers and forms duck bills of seed, similar its Gentiana & Gentianopsis relations. Like many short-lived species, it packs a lot of blooms into its quick life. Collect 10%. Seeds are tiny beads, look for open beaks.",
    "seed_group_names": [
      "Beaks"
    ],
    "seed_group_details": [
      {
        "name": "Beaks",
        "images": [
          "Beaks_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Beaks are a subset of the shaker group, with seed capsules that split open like a beak when the seeds are ripe. Collect when beaks are open."
      }
    ],
    "image_filenames": [
      "gentianella_quinquefolia_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p20_6.png",
      "gentianella_quinquefolia_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p20_7.png",
      "gentianella_quinquefolia_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p20_8.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865177/gentianella_quinquefolia_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p20_6_teda0l.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865177/gentianella_quinquefolia_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p20_7_by1zpr.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865177/gentianella_quinquefolia_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p20_8_n8tsmc.png"
    ],
    "page_number": 20
  },
  {
    "guide_id": 1282,
    "species_id": "sp_54",
    "scientific_name": "Artemisia campestris subsp. caudata",
    "common_name": "Beach Wormwood",
    "family": "Asteraceae",
    "photo_date": "10-24-19",
    "description": "Shattering. This short-lived species loves sandy soils. Less hairy than many of its sisters, and leaves are slender and divided. Look for downward facing heads; seeds are enveloped by the bracts. May need to process against a screen to release the seeds from the bracts. Plump seeds are preferred over wrinkly ones.",
    "seed_group_names": [
      "Shattering"
    ],
    "seed_group_details": [
      {
        "name": "Shattering",
        "images": [
          "Shattering_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Shattering seeds can be tough to visually judge for ripeness. Use a *gentle* touch test to see if the seeds easily loosen."
      }
    ],
    "image_filenames": [
      "artemisia_campestris_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p21_1.png",
      "artemisia_campestris_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p21_2.png",
      "artemisia_campestris_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p21_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865060/artemisia_campestris_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p21_1_w8an38.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865061/artemisia_campestris_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p21_2_ljrgle.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865061/artemisia_campestris_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p21_3_mjrg7e.png"
    ],
    "page_number": 21
  },
  {
    "guide_id": 1282,
    "species_id": "sp_55",
    "scientific_name": "Liatris cylindracea",
    "common_name": "Cylindrical Blazing Star",
    "family": "Asteraceae",
    "photo_date": "10-24-17",
    "description": "Fluffy. The shortest of our native Liatris and found in gravelly & sandy soils. Flower heads usually on short pedicels (stalks) but can be sessile (stalkless). Most Liatris pappus (seed fluff) is unbranched or barbed hairs; this species has a pappus that looks like a feather duster.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "liatris_cylindracea_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p21_4.png",
      "liatris_cylindracea_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p21_5.png",
      "liatris_cylindracea_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p21_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865240/liatris_cylindracea_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p21_4_oe3lyk.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865240/liatris_cylindracea_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p21_5_vg9dqa.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865241/liatris_cylindracea_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p21_6_w2j90l.png"
    ],
    "page_number": 21
  },
  {
    "guide_id": 1282,
    "species_id": "sp_56",
    "scientific_name": "Liatris aspera",
    "common_name": "Rough Blazing Star",
    "family": "Asteraceae",
    "photo_date": "10-25-17",
    "description": "Fluffy. This dry-mesic species can be found in the same location as L. cylindracea, but this species is usually taller with sessile (stalkless) flowerheads. The green floral bracts at the base of the flowerhead are rounded (hard to see once fully poofed. Wildflower guide books illustrate this feature). Straight soft pappus on seed. Tiny hairs on leaves; a new variety (var. intermedia) has hairless leaves.",
    "seed_group_names": [
      "Fluffy"
    ],
    "seed_group_details": [
      {
        "name": "Fluffy",
        "images": [
          "Fluffy_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Fluffy seeds are quite common, allowing for wind to efficiently move seeds over long distances. Collect when fluffy."
      }
    ],
    "image_filenames": [
      "liatris_aspera_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p21_7.png",
      "liatris_aspera_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p21_8.png",
      "liatris_aspera_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p21_9.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865231/liatris_aspera_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p21_7_a7ou45.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865232/liatris_aspera_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p21_8_chh93h.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865234/liatris_aspera_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p21_9_nokcmn.png"
    ],
    "page_number": 21
  },
  {
    "guide_id": 1282,
    "species_id": "sp_57",
    "scientific_name": "Rudbeckia hirta var. pulcherrima",
    "common_name": "Narrow-leaved Black-eyed Susan",
    "family": "Asteraceae",
    "photo_date": "10-25-17",
    "description": "Coneheads. Mama’s Boy. This beauty blooms quickly after seeding, yet gives way to conservative species, making it a restoration favorite. Hirta (“hairy”) describes the leaves, stems, and even the greenery under the flower. Seeds look like graphite from a mechanical pencil. This variety has stem leaves less than 3 cm wide; the straight species has some wider leaves and is present in fewer counties, according to Flora.",
    "seed_group_names": [
      "Coneheads"
    ],
    "seed_group_details": [
      {
        "name": "Coneheads",
        "images": [
          "Coneheads_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Coneheads are flowers with a cone-shaped center. Imagine these flowers without their colorful parts, and you know exactly what they look like when seeds are ripe."
      }
    ],
    "image_filenames": [
      "rudbeckia_hirta_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p22_1.png",
      "rudbeckia_hirta_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p22_2.png",
      "rudbeckia_hirta_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p22_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865309/rudbeckia_hirta_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p22_1_pl0grz.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865309/rudbeckia_hirta_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p22_2_ufrzl6.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865312/rudbeckia_hirta_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p22_3_zklpzl.png"
    ],
    "page_number": 22
  },
  {
    "guide_id": 1282,
    "species_id": "sp_58",
    "scientific_name": "Rudbeckia subtomentosa",
    "common_name": "Sweet Black-eyed Susan",
    "family": "Asteraceae",
    "photo_date": "10-25-17",
    "description": "Coneheads. Mama’s Boy. Similar seed & head to regular black-eyed Susan, but this is a taller plant & leaves are primarily 3-lobed. Sweet odor (similar to sweet grass & the obnoxious sweet clover). A showy flower suitable for savannas & prairies. Snip dark heads.",
    "seed_group_names": [
      "Coneheads"
    ],
    "seed_group_details": [
      {
        "name": "Coneheads",
        "images": [
          "Coneheads_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Coneheads are flowers with a cone-shaped center. Imagine these flowers without their colorful parts, and you know exactly what they look like when seeds are ripe."
      }
    ],
    "image_filenames": [
      "rudbeckia_subtomentosa_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p22_4.png",
      "rudbeckia_subtomentosa_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p22_5.png",
      "rudbeckia_subtomentosa_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p22_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865323/rudbeckia_subtomentosa_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p22_4_csvutb.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865324/rudbeckia_subtomentosa_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p22_5_svsqbv.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865324/rudbeckia_subtomentosa_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p22_6_tfx8iy.png"
    ],
    "page_number": 22
  },
  {
    "guide_id": 1282,
    "species_id": "sp_59",
    "scientific_name": "Rudbeckia spp.",
    "common_name": "The Susans",
    "family": "Asteraceae",
    "photo_date": "11-16-19",
    "description": "Here are four common “Susan” seed heads and seeds side-by-side. They are: 1) Black-eyed Susan (R. hirta), 2) Wild Golden Glow (R. laciniata), 3) Sweet Black-eyed Susan (R. subtomentosa), and 4) Brown-eyed Susan (R. triloba). The seed shots show two seeds and two bracts from each species.",
    "seed_group_names": [],
    "seed_group_details": [],
    "image_filenames": [
      "rudbeckia_spp_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p22_7.png",
      "rudbeckia_spp_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p22_8.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865316/rudbeckia_spp_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p22_7_ibvqnb.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865317/rudbeckia_spp_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p22_8_ep03sa.png"
    ],
    "page_number": 22
  },
  {
    "guide_id": 1282,
    "species_id": "sp_60",
    "scientific_name": "Ruellia humilis",
    "common_name": "Prairie Petunia",
    "family": "Acanthaceae",
    "photo_date": "11-8-18",
    "description": "Ballistic. This sweet perennial has lavender flowers at the top of the stem and also in the leaf axils. Individual flowers open intermittently on the stalk; pods form in the same sequence. Pods turn from green to brown, then snap open to catapult seed away. Collect brown unopened pods (green pods will not ripen once picked). Seeds are flat silver dollars, in shades of brown and gray.",
    "seed_group_names": [
      "Ballistic"
    ],
    "seed_group_details": [
      {
        "name": "Ballistic",
        "images": [
          "Ballistic_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Ballistic capsules catapult their babies away, up to 30 feet! Search YouTube for “exploding seeds” to see these in action. To harvest: learn the ripening sequence & harvest just before explosion; store in a *sealed* paper bag or mesh bag for a day or two."
      }
    ],
    "image_filenames": [
      "ruellia_humilis_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p23_1.png",
      "ruellia_humilis_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p23_2.png",
      "ruellia_humilis_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p23_3.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865325/ruellia_humilis_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p23_1_euam0v.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865326/ruellia_humilis_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p23_2_osew8m.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865334/ruellia_humilis_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p23_3_gd9krc.png"
    ],
    "page_number": 23
  },
  {
    "guide_id": 1282,
    "species_id": "sp_61",
    "scientific_name": "Solanum carolinense",
    "common_name": "Horse Nettle",
    "family": "Solanaceae",
    "photo_date": "11-19-20",
    "description": "Berries. This species is a toxic relative of the tomato; although it may look tasty, don’t eat it! Introduced from further south, favors disturbed soils. Unfriendly prickles on the stems and the main leaf vein, on the underside of the leaf. White-lavender flowers become sunny yellow fruits.",
    "seed_group_names": [
      "Berries"
    ],
    "seed_group_details": [
      {
        "name": "Berries",
        "images": [
          "Berries_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_page1_img1.png"
        ],
        "description": "Berries turn a vibrant color when ripe, as an advertisement to the wildlife to EAT ME and disperse the seed. Collection window is small for some of these seeds."
      }
    ],
    "image_filenames": [
      "solanum_carolinense_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p23_4.png",
      "solanum_carolinense_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p23_5.png",
      "solanum_carolinense_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p23_6.png"
    ],
    "image_urls": [
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865373/solanum_carolinense_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p23_4_kstjju.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865374/solanum_carolinense_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p23_5_m4ipbt.png",
      "https://res.cloudinary.com/dqe2vv0fo/image/upload/v1766865374/solanum_carolinense_1282_usa_illinois_lakecounty_fallprairieforbsv2_0_p23_6_hgcnwl.png"
    ],
    "page_number": 23
  }
];
