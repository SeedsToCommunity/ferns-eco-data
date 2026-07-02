import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Loader2, ServerCrash, ChevronLeft, Lock, Pencil, Trash2,
  Plus, ChevronUp, ChevronDown, X, Check,
} from "lucide-react";
import { Button, Input, Card, ErrorBox } from "./ui";
import {
  type SourceSummary,
  type TierWithSources,
  getGroupKey,
  getSourcesKey,
  ALL_SOURCES_KEY,
  fetchGroupDetail,
  fetchGroupSources,
  fetchAllSources,
  updateTrustGroup,
  deleteTrustGroup,
  createTier,
  renameTier,
  moveTier,
  deleteTier,
  addTierMember,
  removeTierMember,
} from "./api";

const FONT = { fontFamily: "'Inter', sans-serif" };

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
    if (draft.trim() === value) {
      setEditing(false);
      return;
    }
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
        style={FONT}
        className={`group flex items-center gap-1.5 text-left ${disabled ? "cursor-default" : "hover:text-[var(--color-link)] transition-colors"} ${className ?? ""}`}
        onClick={() => {
          if (!disabled) {
            setDraft(value);
            setEditing(true);
          }
        }}
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
      <button onClick={handleSave} disabled={saving} className="text-[var(--color-link)] hover:opacity-80 disabled:opacity-50">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
      </button>
      <button onClick={() => setEditing(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
        <X className="w-4 h-4" />
      </button>
      {error && <span className="text-xs text-[#b3261e]">{error}</span>}
    </span>
  );
}

function GroupMetadataSection({
  group,
  isDefault,
  slug,
}: {
  group: { name: string; slug: string; owner_email: string | null; geographic_region: string | null; domain: string | null; description: string | null };
  isDefault: boolean;
  slug: string;
}) {
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const updateMutation = useMutation({
    mutationFn: (updates: Record<string, unknown>) => updateTrustGroup(slug, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGroupKey(slug) });
      queryClient.invalidateQueries({ queryKey: ["trust-groups"] });
    },
  });

  async function handleFieldSave(field: string, value: string) {
    await updateMutation.mutateAsync({ [field]: value || null });
  }

  async function handleDelete() {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteTrustGroup(slug);
      queryClient.invalidateQueries({ queryKey: ["trust-groups"] });
      window.location.href = "/trust-groups";
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : "Delete failed");
      setDeleting(false);
      setDeleteConfirm(false);
    }
  }

  return (
    <Card className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--color-text)]" style={FONT}>
          Group Details
        </h2>
        {isDefault && (
          <span className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] bg-[var(--color-bg-nav)] px-2.5 py-1 rounded-full border border-[var(--color-border)]">
            <Lock className="w-3 h-3" />
            System group — read only
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm" style={FONT}>
        <div>
          <span className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide block mb-1">Name</span>
          <InlineEdit value={group.name} onSave={(v) => handleFieldSave("name", v)} disabled={isDefault} className="font-medium text-[var(--color-text)]" />
        </div>
        <div>
          <span className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide block mb-1">Slug</span>
          <code className="font-mono text-[var(--color-text)]">{group.slug}</code>
        </div>
        <div>
          <span className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide block mb-1">Owner Email</span>
          <InlineEdit
            value={group.owner_email ?? "—"}
            onSave={(v) => handleFieldSave("owner_email", v === "—" ? "" : v)}
            disabled={isDefault}
            className="text-[var(--color-text)]"
          />
        </div>
        <div>
          <span className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide block mb-1">Geographic Region</span>
          <InlineEdit
            value={group.geographic_region ?? "—"}
            onSave={(v) => handleFieldSave("geographic_region", v === "—" ? "" : v)}
            disabled={isDefault}
            className="text-[var(--color-text)]"
          />
        </div>
        <div>
          <span className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide block mb-1">Domain</span>
          <InlineEdit
            value={group.domain ?? "—"}
            onSave={(v) => handleFieldSave("domain", v === "—" ? "" : v)}
            disabled={isDefault}
            className="text-[var(--color-text)]"
          />
        </div>
        <div className="sm:col-span-2">
          <span className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide block mb-1">Description</span>
          <InlineEdit
            value={group.description ?? "—"}
            onSave={(v) => handleFieldSave("description", v === "—" ? "" : v)}
            disabled={isDefault}
            className="text-[var(--color-text)]"
          />
        </div>
      </div>

      {!isDefault && (
        <div className="pt-3 border-t border-[var(--color-border)]/60">
          {!deleteConfirm ? (
            <Button variant="destructive" size="sm" onClick={() => setDeleteConfirm(true)}>
              <Trash2 className="w-3.5 h-3.5" />
              Delete Group
            </Button>
          ) : (
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-[var(--color-text)] font-medium">Delete this group and all its tiers?</span>
              <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
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
    </Card>
  );
}

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
      (s.source_id.includes(filter.toLowerCase()) || s.name.toLowerCase().includes(filter.toLowerCase())),
  );

  async function handleAdd(sourceId: string) {
    setAdding(sourceId);
    setError(null);
    try {
      await addTierMember(slug, tierId, sourceId);
      queryClient.invalidateQueries({ queryKey: getSourcesKey(slug) });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add source");
      setAdding(null);
    }
  }

  return (
    <div className="mt-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 space-y-3 shadow-sm" style={FONT}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--color-text)]">Add a source</span>
        <button onClick={onClose} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
          <X className="w-4 h-4" />
        </button>
      </div>
      <Input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter sources…" autoFocus />
      {error && <ErrorBox message={error} />}
      {available.length === 0 && (
        <p className="text-sm text-[var(--color-text-muted)] text-center py-3">
          {filter ? "No matching sources." : "All sources are already in this group."}
        </p>
      )}
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {available.map((s) => (
          <button
            key={s.source_id}
            onClick={() => handleAdd(s.source_id)}
            disabled={adding === s.source_id}
            className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-[var(--color-bg-nav)] text-left transition-colors text-sm disabled:opacity-50"
          >
            <span>
              <span className="font-medium text-[var(--color-text)]">{s.name}</span>
              <code className="ml-2 text-xs text-[var(--color-text-muted)] font-mono">{s.source_id}</code>
            </span>
            {adding === s.source_id ? (
              <Loader2 className="w-4 h-4 animate-spin text-[var(--color-link)] flex-shrink-0" />
            ) : (
              <Plus className="w-4 h-4 text-[var(--color-text-muted)] flex-shrink-0" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

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

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getGroupKey(slug) });
    queryClient.invalidateQueries({ queryKey: getSourcesKey(slug) });
  };

  const renameMutation = useMutation({
    mutationFn: (name: string) => renameTier(slug, tier.tier_id, name),
    onSuccess: invalidate,
  });

  const moveMutation = useMutation({
    mutationFn: (newPosition: number) => moveTier(slug, tier.tier_id, newPosition),
    onSuccess: invalidate,
  });

  const removeMutation = useMutation({
    mutationFn: (sourceId: string) => removeTierMember(slug, tier.tier_id, sourceId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: getSourcesKey(slug) }),
  });

  const deleteTierMutation = useMutation({
    mutationFn: () => deleteTier(slug, tier.tier_id),
    onSuccess: invalidate,
    onError: (e: Error) => {
      setDeleteError(e.message);
      setDeleteConfirm(false);
    },
  });

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-white p-5 space-y-4" style={FONT}>
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono font-medium text-[var(--color-text-muted)] bg-[var(--color-bg-nav)] px-2 py-0.5 rounded border border-[var(--color-border)] min-w-[2rem] text-center flex-shrink-0">
          #{tier.position}
        </span>

        <div className="flex-1 min-w-0">
          {isDefault ? (
            <span className="font-semibold text-[var(--color-text)]">{tier.name}</span>
          ) : (
            <InlineEdit
              value={tier.name}
              onSave={(name) => renameMutation.mutateAsync(name).then(() => {})}
              className="font-semibold text-[var(--color-text)] text-base"
            />
          )}
        </div>

        {!isDefault && totalTiers > 1 && (
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => moveMutation.mutate(tier.position - 1)}
              disabled={isFirst || moveMutation.isPending}
              className="p-1 rounded hover:bg-[var(--color-bg-nav)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-30 transition-colors"
              title="Move up"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => moveMutation.mutate(tier.position + 1)}
              disabled={isLast || moveMutation.isPending}
              className="p-1 rounded hover:bg-[var(--color-bg-nav)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-30 transition-colors"
              title="Move down"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}

        {!isDefault && (
          <div className="flex items-center gap-1.5">
            {!deleteConfirm ? (
              <button
                onClick={() => setDeleteConfirm(true)}
                disabled={tier.sources.length > 0}
                className="p-1 rounded hover:bg-[#b3261e]/10 text-[var(--color-text-muted)] hover:text-[#b3261e] disabled:opacity-30 transition-colors"
                title={tier.sources.length > 0 ? "Remove all sources before deleting" : "Delete tier"}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            ) : (
              <span className="flex items-center gap-1.5 text-xs">
                <button
                  onClick={() => deleteTierMutation.mutate()}
                  disabled={deleteTierMutation.isPending}
                  className="text-[#b3261e] hover:underline font-medium"
                >
                  {deleteTierMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin inline" /> : "Delete?"}
                </button>
                <button onClick={() => setDeleteConfirm(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {deleteError && <ErrorBox message={deleteError} />}

      <div className="flex flex-wrap gap-2">
        {tier.sources.map((s) => (
          <span
            key={s.source_id}
            className="inline-flex items-center gap-1.5 bg-[var(--color-bg-nav)] border border-[var(--color-border)] rounded-full px-3 py-1 text-xs font-medium text-[var(--color-text)]"
          >
            {s.name}
            {!isDefault && (
              <button
                onClick={() => removeMutation.mutate(s.source_id)}
                disabled={removeMutation.isPending && removeMutation.variables === s.source_id}
                className="text-[var(--color-text-muted)] hover:text-[#b3261e] transition-colors ml-0.5"
                title={`Remove ${s.name}`}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </span>
        ))}
        {tier.sources.length === 0 && (
          <span className="text-xs text-[var(--color-text-muted)] italic">No sources assigned</span>
        )}
      </div>

      {!isDefault && !showPicker && (
        <button
          onClick={() => setShowPicker(true)}
          className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-link)] transition-colors"
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

function AddTierForm({ slug, onDone }: { slug: string; onDone: () => void }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () => createTier(slug, name.trim()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGroupKey(slug) });
      queryClient.invalidateQueries({ queryKey: getSourcesKey(slug) });
      onDone();
    },
    onError: (e: Error) => setError(e.message),
  });

  return (
    <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-white/50 p-4 flex items-center gap-3" style={FONT}>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") mutation.mutate();
          if (e.key === "Escape") onDone();
        }}
        placeholder="New tier name…"
        autoFocus
        className="h-8 text-sm"
      />
      <Button size="sm" onClick={() => mutation.mutate()} disabled={!name.trim() || mutation.isPending}>
        {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}
      </Button>
      <Button size="sm" variant="outline" onClick={onDone}>
        Cancel
      </Button>
      {error && <ErrorBox message={error} />}
    </div>
  );
}

export default function TrustGroupDetailPage({ slug }: { slug: string }) {
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
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-link)]" />
      </div>
    );
  }

  if (isError || !groupQuery.data) {
    const msg =
      groupQuery.error instanceof Error
        ? groupQuery.error.message
        : sourcesQuery.error instanceof Error
          ? sourcesQuery.error.message
          : "Unknown error";
    return (
      <div className="max-w-3xl mx-auto" style={FONT}>
        <a href="/trust-groups" className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-link)] mb-8 transition-colors no-underline">
          <ChevronLeft className="w-4 h-4" />
          Trust Groups
        </a>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ServerCrash className="w-10 h-10 text-[#b3261e] mb-3" />
          <p className="text-[#b3261e] font-medium">Failed to load trust group</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">{msg}</p>
        </div>
      </div>
    );
  }

  const { group, tiers } = groupQuery.data;
  const tiersWithSources: TierWithSources[] = tiers.map((t) => ({
    ...t,
    sources: sourcesQuery.data?.find((ts) => ts.tier_id === t.tier_id)?.sources ?? [],
  }));
  const allSources = allSourcesQuery.data ?? [];
  const usedInGroup = new Set(tiersWithSources.flatMap((t) => t.sources.map((s) => s.source_id)));

  return (
    <div className="max-w-3xl mx-auto space-y-8" style={FONT}>
      <a href="/trust-groups" className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-link)] transition-colors no-underline">
        <ChevronLeft className="w-4 h-4" />
        Trust Groups
      </a>

      <div>
        <h2 className="text-3xl font-bold text-[var(--color-text)] tracking-tight flex items-center gap-3">
          {isDefault && <Lock className="w-6 h-6 text-[var(--color-text-muted)] flex-shrink-0" />}
          {group.name}
        </h2>
        <p className="text-[var(--color-text-muted)] mt-1">
          <code className="font-mono text-sm">{group.slug}</code>
          {" · "}
          {tiersWithSources.length} {tiersWithSources.length === 1 ? "tier" : "tiers"}
          {" · "}
          {tiersWithSources.reduce((acc, t) => acc + t.sources.length, 0)} sources
        </p>
      </div>

      <GroupMetadataSection group={group} isDefault={isDefault} slug={slug} />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[var(--color-text)]">Tiers</h3>
          {!isDefault && !showAddTier && (
            <Button size="sm" variant="outline" onClick={() => setShowAddTier(true)}>
              <Plus className="w-3.5 h-3.5" />
              Add Tier
            </Button>
          )}
        </div>

        {tiersWithSources.length === 0 && !showAddTier && (
          <p className="text-sm text-[var(--color-text-muted)] italic py-4 text-center">
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

          {showAddTier && <AddTierForm slug={slug} onDone={() => setShowAddTier(false)} />}
        </div>
      </section>
    </div>
  );
}
