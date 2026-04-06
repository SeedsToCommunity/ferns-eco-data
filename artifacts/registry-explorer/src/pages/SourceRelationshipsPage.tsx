import {
  useGetSourceRelationships,
  getGetSourceRelationshipsQueryKey,
  type SourceRelationship,
} from "@workspace/api-client-react";
import { Layout } from "@/components/Layout";
import { Loader2, ServerCrash, ArrowLeftRight, AlertTriangle, Info, Ban } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const SEVERITY_CONFIG: Record<
  string,
  { label: string; className: string; icon: React.ReactNode }
> = {
  blocking: {
    label: "Blocking",
    className: "bg-destructive/10 text-destructive border-destructive/20",
    icon: <Ban className="w-3.5 h-3.5" />,
  },
  cautionary: {
    label: "Cautionary",
    className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
  },
  informational: {
    label: "Informational",
    className: "bg-muted text-muted-foreground border-border",
    icon: <Info className="w-3.5 h-3.5" />,
  },
};

const TYPE_CONFIG: Record<string, { label: string; className: string; description: string }> = {
  overlap: {
    label: "Overlap",
    className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800",
    description: "Two sources cover the same data domain.",
  },
  conflict: {
    label: "Conflict",
    className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800",
    description: "Sources may return contradictory values for the same query.",
  },
  complements: {
    label: "Complements",
    className: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800",
    description: "Sources are designed to be used together.",
  },
  supersedes: {
    label: "Supersedes",
    className: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/30 dark:text-violet-400 dark:border-violet-800",
    description: "One source is preferred over another for a given scope.",
  },
};

const TYPE_ORDER = ["conflict", "overlap", "supersedes", "complements"];

const SEVERITY_ORDER: Record<string, number> = {
  blocking: 0,
  cautionary: 1,
  informational: 2,
};

function SeverityBadge({ severity }: { severity: string }) {
  const config = SEVERITY_CONFIG[severity] ?? SEVERITY_CONFIG["informational"];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${config.className}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  const config = TYPE_CONFIG[type] ?? {
    label: type,
    className: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}

function SourceIdChip({ id }: { id: string }) {
  return (
    <code className="text-xs font-mono bg-muted border border-border rounded px-1.5 py-0.5 text-foreground">
      {id}
    </code>
  );
}

function RelationshipCard({ rel, index }: { rel: SourceRelationship; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
      className="rounded-xl border border-border bg-card p-5 space-y-3"
    >
      <div className="flex flex-wrap items-center gap-2">
        <SourceIdChip id={rel.source_id_a} />
        <ArrowLeftRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
        <SourceIdChip id={rel.source_id_b} />
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <SeverityBadge severity={rel.severity} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
          Scope:
        </span>
        <code className="text-xs font-mono text-foreground">{rel.scope}</code>
      </div>

      <p className="text-sm text-foreground leading-relaxed">{rel.description}</p>

      {rel.technical_note && (
        <div>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-xs text-primary hover:underline focus:outline-none"
          >
            {expanded ? "Hide technical note" : "Show technical note"}
          </button>
          {expanded && (
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed font-mono bg-muted/50 rounded p-3 border border-border">
              {rel.technical_note}
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}

function TypeSection({
  type,
  relationships,
  baseIndex,
}: {
  type: string;
  relationships: SourceRelationship[];
  baseIndex: number;
}) {
  const config = TYPE_CONFIG[type] ?? {
    label: type,
    className: "bg-muted text-muted-foreground border-border",
    description: "",
  };

  const sorted = [...relationships].sort(
    (a, b) =>
      (SEVERITY_ORDER[a.severity] ?? 99) - (SEVERITY_ORDER[b.severity] ?? 99),
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: baseIndex * 0.05 }}
      className="space-y-3"
    >
      <div className="flex items-center gap-3 pb-1 border-b border-border">
        <TypeBadge type={type} />
        <span className="text-sm text-muted-foreground">{config.description}</span>
        <span className="ml-auto text-xs text-muted-foreground">
          {sorted.length} {sorted.length === 1 ? "relationship" : "relationships"}
        </span>
      </div>
      <div className="space-y-3">
        {sorted.map((rel, i) => (
          <RelationshipCard key={rel.id} rel={rel} index={i} />
        ))}
      </div>
    </motion.section>
  );
}

export default function SourceRelationshipsPage() {
  const [filterInput, setFilterInput] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | undefined>(undefined);

  const { data, isLoading, isError } = useGetSourceRelationships(
    activeFilter ? { source_id: activeFilter } : undefined,
    {
      query: {
        queryKey: getGetSourceRelationshipsQueryKey(
          activeFilter ? { source_id: activeFilter } : undefined,
        ),
      },
    },
  );

  const relationships = data?.data?.relationships ?? [];

  const grouped = TYPE_ORDER.reduce<Record<string, SourceRelationship[]>>((acc, type) => {
    const matching = relationships.filter((r) => r.relationship_type === type);
    if (matching.length > 0) acc[type] = matching;
    return acc;
  }, {});

  const unknownTypes = relationships
    .filter((r) => !TYPE_ORDER.includes(r.relationship_type))
    .reduce<Record<string, SourceRelationship[]>>((acc, r) => {
      acc[r.relationship_type] = acc[r.relationship_type] ?? [];
      acc[r.relationship_type].push(r);
      return acc;
    }, {});

  const allGroups = { ...grouped, ...unknownTypes };
  const groupKeys = Object.keys(allGroups);

  function applyFilter() {
    const trimmed = filterInput.trim();
    setActiveFilter(trimmed || undefined);
  }

  function clearFilter() {
    setFilterInput("");
    setActiveFilter(undefined);
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-tight"
          >
            Source Relationships
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-muted-foreground text-base leading-relaxed"
          >
            Documented cross-source overlaps, conflicts, and complementary pairings.
            This is the canonical location for all inter-source guidance in FERNS.
            Individual source metadata does not repeat this information.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center gap-3"
        >
          <input
            type="text"
            value={filterInput}
            onChange={(e) => setFilterInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilter()}
            placeholder="Filter by source ID (e.g. gbif)"
            className="flex-1 min-w-52 px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            onClick={applyFilter}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Filter
          </button>
          {activeFilter && (
            <button
              onClick={clearFilter}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-border bg-background text-muted-foreground hover:bg-muted transition-colors"
            >
              Clear
            </button>
          )}
          {activeFilter && (
            <span className="text-sm text-muted-foreground">
              Showing relationships for{" "}
              <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded border border-border">
                {activeFilter}
              </code>
            </span>
          )}
        </motion.div>

        {isLoading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ServerCrash className="w-10 h-10 text-destructive mb-4" />
            <p className="text-destructive font-medium">Failed to load source relationships</p>
          </div>
        )}

        {!isLoading && !isError && relationships.length === 0 && (
          <div className="text-center py-24 text-muted-foreground">
            No relationships found{activeFilter ? ` for source "${activeFilter}"` : ""}.
          </div>
        )}

        {!isLoading && !isError && relationships.length > 0 && (
          <div className="space-y-8">
            <p className="text-sm text-muted-foreground">
              {relationships.length} relationship{relationships.length !== 1 ? "s" : ""}
              {activeFilter ? ` involving ${activeFilter}` : " total"}, grouped by type
            </p>
            {groupKeys.map((type, i) => (
              <TypeSection
                key={type}
                type={type}
                relationships={allGroups[type]}
                baseIndex={i}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
