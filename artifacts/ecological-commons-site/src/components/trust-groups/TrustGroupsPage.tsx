import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Lock, ChevronRight, Globe, Mail, Tag, ServerCrash, Users } from "lucide-react";
import { Button, Input, Label, Card, ErrorBox } from "./ui";
import {
  type TrustGroup,
  type CreateGroupBody,
  fetchTrustGroups,
  createTrustGroup,
  slugify,
} from "./api";

const EMPTY_FORM = {
  name: "",
  slug: "",
  owner_email: "",
  geographic_region: "",
  domain: "",
  description: "",
};

function CreateGroupForm({ onCancel }: { onCancel: () => void }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(EMPTY_FORM);
  const [slugManual, setSlugManual] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (body: CreateGroupBody) => createTrustGroup(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trust-groups"] });
      onCancel();
    },
    onError: (err: Error) => setError(err.message),
  });

  function handleNameChange(name: string) {
    setForm((f) => ({ ...f, name, slug: slugManual ? f.slug : slugify(name) }));
  }

  function handleSlugChange(slug: string) {
    setSlugManual(true);
    setForm((f) => ({ ...f, slug }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.name.trim() || !form.slug.trim()) {
      setError("Name and slug are required.");
      return;
    }
    if (!/^[a-z0-9][a-z0-9-]*$/.test(form.slug.trim())) {
      setError("Slug may only contain lowercase letters, numbers, and hyphens, and must start with a letter or number.");
      return;
    }
    mutation.mutate({
      name: form.name.trim(),
      slug: form.slug.trim(),
      owner_email: form.owner_email || undefined,
      geographic_region: form.geographic_region || undefined,
      domain: form.domain || undefined,
      description: form.description || undefined,
    });
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-[var(--color-text)] mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>
        New Trust Group
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="tg-name">Name *</Label>
            <Input
              id="tg-name"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Research Partners"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tg-slug">Slug *</Label>
            <Input
              id="tg-slug"
              value={form.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="research-partners"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              required
            />
            <p className="text-xs text-[var(--color-text-muted)]">Lowercase letters, numbers, hyphens only</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tg-email">Owner Email</Label>
            <Input
              id="tg-email"
              type="email"
              value={form.owner_email}
              onChange={(e) => setForm((f) => ({ ...f, owner_email: e.target.value }))}
              placeholder="user@example.org"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tg-region">Geographic Region</Label>
            <Input
              id="tg-region"
              value={form.geographic_region}
              onChange={(e) => setForm((f) => ({ ...f, geographic_region: e.target.value }))}
              placeholder="Great Lakes"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tg-domain">Domain</Label>
            <Input
              id="tg-domain"
              value={form.domain}
              onChange={(e) => setForm((f) => ({ ...f, domain: e.target.value }))}
              placeholder="native-plants"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tg-desc">Description</Label>
          <textarea
            id="tg-desc"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="A short description of this trust perspective..."
            rows={2}
            style={{ fontFamily: "'Inter', sans-serif" }}
            className="flex w-full rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text)] shadow-sm placeholder:text-[var(--color-text-muted)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-link)] resize-none"
          />
        </div>
        {error && <ErrorBox message={error} />}
        <div className="flex items-center gap-3 pt-1">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Create Group
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}

function GroupCard({ group }: { group: TrustGroup }) {
  const isDefault = group.slug === "default";

  return (
    <a href={`/trust-groups/${group.slug}`} className="block no-underline">
      <div className="rounded-xl border border-[var(--color-border)] bg-white p-5 hover:border-[var(--color-link)]/40 hover:shadow-md transition-all cursor-pointer group">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {isDefault ? (
              <div className="w-8 h-8 rounded-lg bg-[var(--color-bg-nav)] flex items-center justify-center flex-shrink-0">
                <Lock className="w-4 h-4 text-[var(--color-text-muted)]" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-[var(--color-link)]/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-[var(--color-link)]" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3
                  className="font-semibold text-[var(--color-text)] group-hover:text-[var(--color-link)] transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {group.name}
                </h3>
                {isDefault && (
                  <span className="text-xs font-mono bg-[var(--color-bg-nav)] text-[var(--color-text-muted)] px-2 py-0.5 rounded-full border border-[var(--color-border)]">
                    system
                  </span>
                )}
              </div>
              <code className="text-xs text-[var(--color-text-muted)] font-mono">{group.slug}</code>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)] flex-shrink-0 mt-1 group-hover:text-[var(--color-link)] transition-colors" />
        </div>

        {(group.geographic_region || group.domain || group.owner_email || group.description) && (
          <div className="mt-3 pt-3 border-t border-[var(--color-border)]/60 flex flex-wrap gap-x-4 gap-y-1.5">
            {group.geographic_region && (
              <span className="inline-flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                <Globe className="w-3 h-3" />
                {group.geographic_region}
              </span>
            )}
            {group.domain && (
              <span className="inline-flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                <Tag className="w-3 h-3" />
                {group.domain}
              </span>
            )}
            {group.owner_email && (
              <span className="inline-flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                <Mail className="w-3 h-3" />
                {group.owner_email}
              </span>
            )}
            {group.description && (
              <span className="text-xs text-[var(--color-text-muted)] truncate max-w-xs">
                {group.description}
              </span>
            )}
          </div>
        )}
      </div>
    </a>
  );
}

export default function TrustGroupsPage() {
  const [showForm, setShowForm] = useState(false);

  const { data: groups, isLoading, isError, error } = useQuery({
    queryKey: ["trust-groups"],
    queryFn: fetchTrustGroups,
  });

  return (
    <div className="max-w-3xl mx-auto space-y-8" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] tracking-tight mb-2">
            Trust Groups
          </h2>
          <p className="text-[var(--color-text-muted)] text-base leading-relaxed">
            Named perspectives over the source registry. Each group defines an ordered set of tiers
            for context-specific queries.
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="flex-shrink-0">
            <Plus className="w-4 h-4" />
            New Group
          </Button>
        )}
      </div>

      {showForm && <CreateGroupForm onCancel={() => setShowForm(false)} />}

      {isLoading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-link)]" />
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ServerCrash className="w-10 h-10 text-[#b3261e] mb-3" />
          <p className="text-[#b3261e] font-medium">Failed to load trust groups</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      )}

      {groups && groups.length === 0 && !isLoading && (
        <div className="text-center py-24 text-[var(--color-text-muted)]">
          No trust groups found. Create one above.
        </div>
      )}

      {groups && groups.length > 0 && (
        <div className="space-y-3">
          {groups.map((g) => (
            <GroupCard key={g.group_id} group={g} />
          ))}
        </div>
      )}
    </div>
  );
}
