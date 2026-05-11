import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2, Plus, Lock, ChevronRight, Globe, Mail, Tag, ServerCrash, Users
} from "lucide-react";
import { motion } from "framer-motion";

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

interface CreateGroupBody {
  slug: string;
  name: string;
  owner_email?: string;
  geographic_region?: string;
  domain?: string;
  description?: string;
}

async function fetchTrustGroups(): Promise<TrustGroup[]> {
  const res = await fetch("/api/v1/trust-groups");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return json.data.groups as TrustGroup[];
}

async function createTrustGroup(body: CreateGroupBody): Promise<TrustGroup> {
  const res = await fetch("/api/v1/trust-groups", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
  return json.data.group as TrustGroup;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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
    mutationFn: createTrustGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trust-groups"] });
      onCancel();
    },
    onError: (err: Error) => setError(err.message),
  });

  function handleNameChange(name: string) {
    setForm((f) => ({
      ...f,
      name,
      slug: slugManual ? f.slug : slugify(name),
    }));
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
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-foreground mb-5">New Trust Group</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="tg-name">Name <span className="text-destructive">*</span></Label>
            <Input
              id="tg-name"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Research Partners"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tg-slug">Slug <span className="text-destructive">*</span></Label>
            <Input
              id="tg-slug"
              value={form.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="research-partners"
              pattern="[a-z0-9][a-z0-9\-]*"
              required
            />
            <p className="text-xs text-muted-foreground">Lowercase letters, numbers, hyphens only</p>
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
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          />
        </div>
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        <div className="flex items-center gap-3 pt-1">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="animate-spin" />}
            Create Group
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </motion.div>
  );
}

function GroupCard({ group, index }: { group: TrustGroup; index: number }) {
  const isDefault = group.slug === "default";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Link href={`/trust-groups/${group.slug}`}>
        <div className="rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              {isDefault ? (
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-primary" />
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {group.name}
                  </h3>
                  {isDefault && (
                    <span className="text-xs font-mono bg-muted text-muted-foreground px-2 py-0.5 rounded-full border border-border">
                      system
                    </span>
                  )}
                </div>
                <code className="text-xs text-muted-foreground font-mono">{group.slug}</code>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1 group-hover:text-primary transition-colors" />
          </div>

          {(group.geographic_region || group.domain || group.owner_email || group.description) && (
            <div className="mt-3 pt-3 border-t border-border/60 flex flex-wrap gap-x-4 gap-y-1.5">
              {group.geographic_region && (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Globe className="w-3 h-3" />
                  {group.geographic_region}
                </span>
              )}
              {group.domain && (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Tag className="w-3 h-3" />
                  {group.domain}
                </span>
              )}
              {group.owner_email && (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Mail className="w-3 h-3" />
                  {group.owner_email}
                </span>
              )}
              {group.description && (
                <span className="text-xs text-muted-foreground truncate max-w-xs">
                  {group.description}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

export default function TrustGroupsPage() {
  const [showForm, setShowForm] = useState(false);

  const { data: groups, isLoading, isError, error } = useQuery({
    queryKey: ["trust-groups"],
    queryFn: fetchTrustGroups,
  });

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-2"
            >
              Trust Groups
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-muted-foreground text-base leading-relaxed"
            >
              Named perspectives over the source registry. Each group defines an ordered set of tiers
              for context-specific queries.
            </motion.p>
          </div>
          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              className="flex-shrink-0"
            >
              <Plus />
              New Group
            </Button>
          )}
        </div>

        {showForm && (
          <CreateGroupForm onCancel={() => setShowForm(false)} />
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ServerCrash className="w-10 h-10 text-destructive mb-3" />
            <p className="text-destructive font-medium">Failed to load trust groups</p>
            <p className="text-sm text-muted-foreground mt-1">
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
          </div>
        )}

        {groups && groups.length === 0 && !isLoading && (
          <div className="text-center py-24 text-muted-foreground">
            No trust groups found. Create one above.
          </div>
        )}

        {groups && groups.length > 0 && (
          <div className="space-y-3">
            {groups.map((g, i) => (
              <GroupCard key={g.group_id} group={g} index={i} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
