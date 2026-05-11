import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2, ServerCrash, ChevronLeft, Lock, Pencil, Trash2,
  Plus, ChevronUp, ChevronDown, X, Check, AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TrustGroup {
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

interface Tier {
  tier_id: string;
  position: number;
  name: string;
  created_at: string;
}

interface SourceSummary {
  source_id: string;
  name: string;
  knowledge_type: string;
  status: string;
  description: string;
}

interface TierWithSources extends Tier {
  sources: SourceSummary[];
}

// ─── API helpers ──────────────────────────────────────────────────────────────

async function apiJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
  return json;
}

function getGroupKey(slug: string) { return ["trust-group", slug]; }
function getSourcesKey(slug: string) { return ["trust-group-sources", slug]; }
const ALL_SOURCES_KEY = ["all-sources"];

async function fetchGroupDetail(slug: string): Promise<{ group: TrustGroup; tiers: Tier[] }> {
  const json = await apiJson<{ data: { group: TrustGroup; tiers: Tier[] } }>(`/api/v1/trust-groups/${slug}`);
  return json.data;
}

async function fetchGroupSources(slug: string): Promise<TierWithSources[]> {
  const json = await apiJson<{ data: { tiers: TierWithSources[] } }>(`/api/v1/trust-groups/${slug}/sources`);
  return json.data.tiers;
}

async function fetchAllSources(): Promise<SourceSummary[]> {
  const json = await apiJson<{ data: { sources: SourceSummary[] } }>("/api/v1/sources");
  return json.data.sources;
}

// ─── Small components ─────────────────────────────────────────────────────────

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
      {message}
    </div>
  );
}

// ─── Inline text editor ───────────────────────────────────────────────────────

function InlineEdit({
  value,
  onSave,
  disabled,
  className,
}: {
  value: string;
  onSave: (v: string) => Promise<void>;
  disabled?: boolean;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (draft.trim() === value) { setEditing(false); return; }
    setSaving(true);
    setError(null);
    try {
      await onSave(draft.trim());
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (!editing) {
    return (
      <button
        className={`group flex items-center gap-1.5 text-left ${disabled ? "cursor-default" : "hover:text-primary transition-colors"} ${className ?? ""}`}
        onClick={() => { if (!disabled) { setDraft(value); setEditing(true); } }}
        disabled={disabled}
        title={disabled ? undefined : "Click to edit"}
      >
        {value}
        {!disabled && <Pencil className="w-3 h-3 opacity-0 group-hover:opacity-60 flex-shrink-0" />}
      </button>
    );
  }

  return (
    <span className="flex items-center gap-1.5">
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
          if (e.key === "Escape") setEditing(false);
        }}
        autoFocus
        className="h-7 text-sm py-0 w-48"
        disabled={saving}
      />
      <button onClick={handleSave} disabled={saving} className="text-primary hover:text-primary/80 disabled:opacity-50">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
      </button>
      <button onClick={() => setEditing(false)} className="text-muted-foreground hover:text-foreground">
        <X className="w-4 h-4" />
      </button>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </span>
  );
}

// ─── Group metadata editor ────────────────────────────────────────────────────

function GroupMetadataSection({
  group,
  isDefault,
  slug,
}: {
  group: TrustGroup;
  isDefault: boolean;
  slug: string;
}) {
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const updateMutation = useMutation({
    mutationFn: async (updates: Record<string, unknown>) =>
      apiJson(`/api/v1/trust-groups/${slug}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: getGroupKey(slug) }),
  });

  async function handleFieldSave(field: string, value: string) {
    await updateMutation.mutateAsync({ [field]: value || null });
  }

  async function handleDelete() {
    setDeleting(true);
    setDeleteError(null);
    try {
      await apiJson(`/api/v1/trust-groups/${slug}`, { method: "DELETE" });
      queryClient.invalidateQueries({ queryKey: ["trust-groups"] });
      navigate("/trust-groups");
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : "Delete failed");
      setDeleting(false);
      setDeleteConfirm(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Group Details</h2>
        {isDefault && (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border">
            <Lock className="w-3 h-3" />
            System group — read only
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
        <div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1">Name</span>
          <InlineEdit
            value={group.name}
            onSave={(v) => handleFieldSave("name", v)}
            disabled={isDefault}
            className="font-medium text-foreground"
          />
        </div>
        <div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1">Slug</span>
          <code className="font-mono text-foreground">{group.slug}</code>
        </div>
        <div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1">Owner Email</span>
          <InlineEdit
            value={group.owner_email ?? "—"}
            onSave={(v) => handleFieldSave("owner_email", v === "—" ? "" : v)}
            disabled={isDefault}
            className="text-foreground"
          />
        </div>
        <div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1">Geographic Region</span>
          <InlineEdit
            value={group.geographic_region ?? "—"}
            onSave={(v) => handleFieldSave("geographic_region", v === "—" ? "" : v)}
            disabled={isDefault}
            className="text-foreground"
          />
        </div>
        <div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1">Domain</span>
          <InlineEdit
            value={group.domain ?? "—"}
            onSave={(v) => handleFieldSave("domain", v === "—" ? "" : v)}
            disabled={isDefault}
            className="text-foreground"
          />
        </div>
        <div className="sm:col-span-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1">Description</span>
          <InlineEdit
            value={group.description ?? "—"}
            onSave={(v) => handleFieldSave("description", v === "—" ? "" : v)}
            disabled={isDefault}
            className="text-foreground"
          />
        </div>
      </div>

      {!isDefault && (
        <div className="pt-3 border-t border-border/60">
          {!deleteConfirm ? (
            <Button variant="destructive" size="sm" onClick={() => setDeleteConfirm(true)}>
              <Trash2 />
              Delete Group
            </Button>
          ) : (
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-foreground font-medium">Delete this group and all its tiers?</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting && <Loader2 className="animate-spin" />}
                Yes, delete
              </Button>
              <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(false)}>
                Cancel
              </Button>
              {deleteError && <ErrorBox message={deleteError} />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Source picker ────────────────────────────────────────────────────────────

function SourcePicker({
  tierId,
  slug,
  usedSourceIds,
  allSources,
  onClose,
}: {
  tierId: string;
  slug: string;
  usedSourceIds: Set<string>;
  allSources: SourceSummary[];
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("");
  const [adding, setAdding] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const available = allSources.filter(
    (s) =>
      !usedSourceIds.has(s.source_id) &&
      (s.source_id.includes(filter.toLowerCase()) ||
        s.name.toLowerCase().includes(filter.toLowerCase()))
  );

  async function handleAdd(sourceId: string) {
    setAdding(sourceId);
    setError(null);
    try {
      await apiJson(`/api/v1/trust-groups/${slug}/tiers/${tierId}/members`, {
        method: "POST",
        body: JSON.stringify({ source_id: sourceId }),
      });
      queryClient.invalidateQueries({ queryKey: getSourcesKey(slug) });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add source");
      setAdding(null);
    }
  }

  return (
    <div className="mt-3 rounded-xl border border-border bg-background p-4 space-y-3 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Add a source</span>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>
      <Input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter sources…"
        autoFocus
      />
      {error && <ErrorBox message={error} />}
      {available.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-3">
          {filter ? "No matching sources." : "All sources are already in this group."}
        </p>
      )}
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {available.map((s) => (
          <button
            key={s.source_id}
            onClick={() => handleAdd(s.source_id)}
            disabled={adding === s.source_id}
            className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-muted text-left transition-colors text-sm disabled:opacity-50"
          >
            <span>
              <span className="font-medium text-foreground">{s.name}</span>
              <code className="ml-2 text-xs text-muted-foreground font-mono">{s.source_id}</code>
            </span>
            {adding === s.source_id ? (
              <Loader2 className="w-4 h-4 animate-spin text-primary flex-shrink-0" />
            ) : (
              <Plus className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Tier card ────────────────────────────────────────────────────────────────

function TierCard({
  tier,
  slug,
  isDefault,
  isFirst,
  isLast,
  totalTiers,
  allSources,
  usedInGroup,
}: {
  tier: TierWithSources;
  slug: string;
  isDefault: boolean;
  isFirst: boolean;
  isLast: boolean;
  totalTiers: number;
  allSources: SourceSummary[];
  usedInGroup: Set<string>;
}) {
  const queryClient = useQueryClient();
  const [showPicker, setShowPicker] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const renameMutation = useMutation({
    mutationFn: async (name: string) =>
      apiJson(`/api/v1/trust-groups/${slug}/tiers/${tier.tier_id}`, {
        method: "PUT",
        body: JSON.stringify({ name }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGroupKey(slug) });
      queryClient.invalidateQueries({ queryKey: getSourcesKey(slug) });
    },
  });

  const moveMutation = useMutation({
    mutationFn: async (newPosition: number) =>
      apiJson(`/api/v1/trust-groups/${slug}/tiers/${tier.tier_id}`, {
        method: "PUT",
        body: JSON.stringify({ position: newPosition }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGroupKey(slug) });
      queryClient.invalidateQueries({ queryKey: getSourcesKey(slug) });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (sourceId: string) =>
      apiJson(`/api/v1/trust-groups/${slug}/tiers/${tier.tier_id}/members/${sourceId}`, {
        method: "DELETE",
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: getSourcesKey(slug) }),
  });

  const deleteTierMutation = useMutation({
    mutationFn: async () =>
      apiJson(`/api/v1/trust-groups/${slug}/tiers/${tier.tier_id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGroupKey(slug) });
      queryClient.invalidateQueries({ queryKey: getSourcesKey(slug) });
    },
    onError: (e: Error) => {
      setDeleteError(e.message);
      setDeleteConfirm(false);
    },
  });

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      {/* Tier header */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border min-w-[2rem] text-center flex-shrink-0">
          #{tier.position}
        </span>

        <div className="flex-1 min-w-0">
          {isDefault ? (
            <span className="font-semibold text-foreground">{tier.name}</span>
          ) : (
            <InlineEdit
              value={tier.name}
              onSave={(name) => renameMutation.mutateAsync(name).then(() => {})}
              className="font-semibold text-foreground text-base"
            />
          )}
        </div>

        {/* Move up/down */}
        {!isDefault && totalTiers > 1 && (
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => moveMutation.mutate(tier.position - 1)}
              disabled={isFirst || moveMutation.isPending}
              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
              title="Move up"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => moveMutation.mutate(tier.position + 1)}
              disabled={isLast || moveMutation.isPending}
              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
              title="Move down"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Delete tier */}
        {!isDefault && (
          <div className="flex items-center gap-1.5">
            {!deleteConfirm ? (
              <button
                onClick={() => setDeleteConfirm(true)}
                disabled={tier.sources.length > 0}
                className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive disabled:opacity-30 transition-colors"
                title={tier.sources.length > 0 ? "Remove all sources before deleting" : "Delete tier"}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            ) : (
              <span className="flex items-center gap-1.5 text-xs">
                <button
                  onClick={() => deleteTierMutation.mutate()}
                  disabled={deleteTierMutation.isPending}
                  className="text-destructive hover:underline font-medium"
                >
                  {deleteTierMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin inline" /> : "Delete?"}
                </button>
                <button onClick={() => setDeleteConfirm(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {deleteError && <ErrorBox message={deleteError} />}

      {/* Sources */}
      <div className="flex flex-wrap gap-2">
        {tier.sources.map((s) => (
          <span
            key={s.source_id}
            className="inline-flex items-center gap-1.5 bg-muted border border-border rounded-full px-3 py-1 text-xs font-medium text-foreground"
          >
            {s.name}
            {!isDefault && (
              <button
                onClick={() => removeMutation.mutate(s.source_id)}
                disabled={removeMutation.isPending && removeMutation.variables === s.source_id}
                className="text-muted-foreground hover:text-destructive transition-colors ml-0.5"
                title={`Remove ${s.name}`}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </span>
        ))}
        {tier.sources.length === 0 && (
          <span className="text-xs text-muted-foreground italic">No sources assigned</span>
        )}
      </div>

      {/* Add source */}
      {!isDefault && !showPicker && (
        <button
          onClick={() => setShowPicker(true)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add source
        </button>
      )}

      {showPicker && (
        <SourcePicker
          tierId={tier.tier_id}
          slug={slug}
          usedSourceIds={usedInGroup}
          allSources={allSources}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}

// ─── Add tier form ────────────────────────────────────────────────────────────

function AddTierForm({ slug, onDone }: { slug: string; onDone: () => void }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () =>
      apiJson(`/api/v1/trust-groups/${slug}/tiers`, {
        method: "POST",
        body: JSON.stringify({ name: name.trim() }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGroupKey(slug) });
      queryClient.invalidateQueries({ queryKey: getSourcesKey(slug) });
      onDone();
    },
    onError: (e: Error) => setError(e.message),
  });

  return (
    <div className="rounded-xl border border-dashed border-border bg-card/50 p-4 flex items-center gap-3">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") mutation.mutate(); if (e.key === "Escape") onDone(); }}
        placeholder="New tier name…"
        autoFocus
        className="h-8 text-sm"
      />
      <Button size="sm" onClick={() => mutation.mutate()} disabled={!name.trim() || mutation.isPending}>
        {mutation.isPending ? <Loader2 className="animate-spin" /> : "Add"}
      </Button>
      <Button size="sm" variant="outline" onClick={onDone}>Cancel</Button>
      {error && <ErrorBox message={error} />}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function TrustGroupDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";
  const isDefault = slug === "default";
  const [showAddTier, setShowAddTier] = useState(false);

  const groupQuery = useQuery({
    queryKey: getGroupKey(slug),
    queryFn: () => fetchGroupDetail(slug),
    enabled: !!slug,
  });

  const sourcesQuery = useQuery({
    queryKey: getSourcesKey(slug),
    queryFn: () => fetchGroupSources(slug),
    enabled: !!slug,
  });

  const allSourcesQuery = useQuery({
    queryKey: ALL_SOURCES_KEY,
    queryFn: fetchAllSources,
    staleTime: 1000 * 60 * 10,
  });

  const isLoading = groupQuery.isLoading || sourcesQuery.isLoading;
  const isError = groupQuery.isError || sourcesQuery.isError;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (isError || !groupQuery.data) {
    const msg =
      groupQuery.error instanceof Error ? groupQuery.error.message :
      sourcesQuery.error instanceof Error ? sourcesQuery.error.message :
      "Unknown error";
    return (
      <Layout>
        <div className="max-w-3xl mx-auto">
          <Link href="/trust-groups" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Trust Groups
          </Link>
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ServerCrash className="w-10 h-10 text-destructive mb-3" />
            <p className="text-destructive font-medium">Failed to load trust group</p>
            <p className="text-sm text-muted-foreground mt-1">{msg}</p>
          </div>
        </div>
      </Layout>
    );
  }

  const { group, tiers } = groupQuery.data;
  // Merge tier metadata with source data — tiers from groupQuery, sources from sourcesQuery.
  const tiersWithSources: TierWithSources[] = tiers.map((t) => ({
    ...t,
    sources: sourcesQuery.data?.find((ts) => ts.tier_id === t.tier_id)?.sources ?? [],
  }));
  const allSources = allSourcesQuery.data ?? [];
  // All source IDs already assigned anywhere in this group (across all tiers).
  // Passed to each TierCard so the picker filters them out group-wide.
  const usedInGroup = new Set(tiersWithSources.flatMap((t) => t.sources.map((s) => s.source_id)));

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <Link href="/trust-groups" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Trust Groups
        </Link>

        {/* Page title */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-foreground tracking-tight flex items-center gap-3"
          >
            {isDefault && <Lock className="w-6 h-6 text-muted-foreground flex-shrink-0" />}
            {group.name}
          </motion.h2>
          <p className="text-muted-foreground mt-1">
            <code className="font-mono text-sm">{group.slug}</code>
            {" · "}
            {tiersWithSources.length} {tiersWithSources.length === 1 ? "tier" : "tiers"}
            {" · "}
            {tiersWithSources.reduce((acc, t) => acc + t.sources.length, 0)} sources
          </p>
        </div>

        {/* Metadata */}
        <GroupMetadataSection group={group} isDefault={isDefault} slug={slug} />

        {/* Tiers */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Tiers</h3>
            {!isDefault && !showAddTier && (
              <Button size="sm" variant="outline" onClick={() => setShowAddTier(true)}>
                <Plus />
                Add Tier
              </Button>
            )}
          </div>

          {tiersWithSources.length === 0 && !showAddTier && (
            <p className="text-sm text-muted-foreground italic py-4 text-center">
              No tiers yet. Add one to get started.
            </p>
          )}

          <div className="space-y-3">
            {tiersWithSources.map((tier, i) => (
              <TierCard
                key={tier.tier_id}
                tier={tier}
                slug={slug}
                isDefault={isDefault}
                isFirst={i === 0}
                isLast={i === tiersWithSources.length - 1}
                totalTiers={tiersWithSources.length}
                allSources={allSources}
                usedInGroup={usedInGroup}
              />
            ))}

            {showAddTier && (
              <AddTierForm slug={slug} onDone={() => setShowAddTier(false)} />
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
