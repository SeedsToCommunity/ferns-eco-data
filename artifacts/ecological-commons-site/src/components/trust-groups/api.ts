export interface TrustGroup {
  group_id: string;
  slug: string;
  name: string;
  owner_email: string | null;
  geographic_region: string | null;
  domain: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tier {
  tier_id: string;
  position: number;
  name: string;
  created_at: string;
}

export interface SourceSummary {
  source_id: string;
  name: string;
  knowledge_type: string;
  status: string;
  description: string;
}

export interface TierWithSources extends Tier {
  sources: SourceSummary[];
}

export interface CreateGroupBody {
  slug: string;
  name: string;
  owner_email?: string;
  geographic_region?: string;
  domain?: string;
  description?: string;
}

async function apiJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
  return json;
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function fetchTrustGroups(): Promise<TrustGroup[]> {
  const json = await apiJson<{ data: { groups: TrustGroup[] } }>("/api/v1/trust-groups");
  return json.data.groups;
}

export async function createTrustGroup(body: CreateGroupBody): Promise<TrustGroup> {
  const json = await apiJson<{ data: { group: TrustGroup } }>("/api/v1/trust-groups", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return json.data.group;
}

export function getGroupKey(slug: string) {
  return ["trust-group", slug];
}
export function getSourcesKey(slug: string) {
  return ["trust-group-sources", slug];
}
export const ALL_SOURCES_KEY = ["all-sources"];

export async function fetchGroupDetail(slug: string): Promise<{ group: TrustGroup; tiers: Tier[] }> {
  const json = await apiJson<{ data: { group: TrustGroup; tiers: Tier[] } }>(`/api/v1/trust-groups/${slug}`);
  return json.data;
}

export async function fetchGroupSources(slug: string): Promise<TierWithSources[]> {
  const json = await apiJson<{ data: { tiers: TierWithSources[] } }>(`/api/v1/trust-groups/${slug}/sources`);
  return json.data.tiers;
}

export async function fetchAllSources(): Promise<SourceSummary[]> {
  const json = await apiJson<{ data: { sources: SourceSummary[] } }>("/api/v1/sources");
  return json.data.sources;
}

export async function updateTrustGroup(slug: string, updates: Record<string, unknown>): Promise<void> {
  await apiJson(`/api/v1/trust-groups/${slug}`, { method: "PUT", body: JSON.stringify(updates) });
}

export async function deleteTrustGroup(slug: string): Promise<void> {
  await apiJson(`/api/v1/trust-groups/${slug}`, { method: "DELETE" });
}

export async function createTier(slug: string, name: string): Promise<void> {
  await apiJson(`/api/v1/trust-groups/${slug}/tiers`, {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function renameTier(slug: string, tierId: string, name: string): Promise<void> {
  await apiJson(`/api/v1/trust-groups/${slug}/tiers/${tierId}`, {
    method: "PUT",
    body: JSON.stringify({ name }),
  });
}

export async function moveTier(slug: string, tierId: string, position: number): Promise<void> {
  await apiJson(`/api/v1/trust-groups/${slug}/tiers/${tierId}`, {
    method: "PUT",
    body: JSON.stringify({ position }),
  });
}

export async function deleteTier(slug: string, tierId: string): Promise<void> {
  await apiJson(`/api/v1/trust-groups/${slug}/tiers/${tierId}`, { method: "DELETE" });
}

export async function addTierMember(slug: string, tierId: string, sourceId: string): Promise<void> {
  await apiJson(`/api/v1/trust-groups/${slug}/tiers/${tierId}/members`, {
    method: "POST",
    body: JSON.stringify({ source_id: sourceId }),
  });
}

export async function removeTierMember(slug: string, tierId: string, sourceId: string): Promise<void> {
  await apiJson(`/api/v1/trust-groups/${slug}/tiers/${tierId}/members/${sourceId}`, {
    method: "DELETE",
  });
}
