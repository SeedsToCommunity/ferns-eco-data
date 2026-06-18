export type GoogleImagesResult = {
  species: string;
  url: string;
};

export function getGoogleImagesUrl(species: string): GoogleImagesResult {
  const url = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(species)}`;
  return { species, url };
}
