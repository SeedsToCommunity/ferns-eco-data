import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Map, Plug, Database, Activity, AlertCircle, Calendar, Braces, Copy, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { SourceSummary } from "@workspace/api-client-react";

interface SourceCardProps {
  source: SourceSummary;
  index: number;
}

type CopyState = "idle" | "copied" | "error";

function CopyableUrl({ url, label, icon }: { url: string; label: string; icon: React.ReactNode }) {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  function handleCopy() {
    const absolute = url.startsWith("/") ? window.location.origin + url : url;

    function onSuccess() {
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 1500);
    }

    function onFailure() {
      setCopyState("error");
      setTimeout(() => setCopyState("idle"), 1500);
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(absolute).then(onSuccess).catch(() => {
        legacyCopy(absolute) ? onSuccess() : onFailure();
      });
    } else {
      legacyCopy(absolute) ? onSuccess() : onFailure();
    }
  }

  function legacyCopy(text: string): boolean {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.top = "0";
    ta.style.left = "0";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground shrink-0">{icon}</span>
      <span className="text-xs text-muted-foreground w-20 shrink-0">{label}</span>
      <span
        className="text-xs font-mono text-foreground/80 truncate flex-1 min-w-0"
        title={url}
      >
        {url}
      </span>
      <button
        onClick={handleCopy}
        title={copyState === "error" ? "Copy failed — check browser permissions" : "Copy URL"}
        className="shrink-0 p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        {copyState === "copied" && <Check className="w-3 h-3 text-green-600" />}
        {copyState === "error" && <X className="w-3 h-3 text-red-500" />}
        {copyState === "idle" && <Copy className="w-3 h-3" />}
      </button>
    </div>
  );
}

export function SourceCard({ source, index }: SourceCardProps) {
  const isLive = source.status === "live";
  const isPartial = source.status === "partial";

  const hasEndpoints = source.explorer_url || source.metadata_url;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
      className="group relative flex flex-col bg-card rounded-2xl border border-card-border shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Decorative gradient header line */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/40 via-primary to-accent opacity-80" />

      <div className="p-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-4 gap-4">
          <div>
            <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
              {source.name}
            </h3>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded-md">
                {source.source_id}
              </span>
              <Badge variant="outline" className="text-xs capitalize">
                {source.knowledge_type.replace(/_/g, " ")}
              </Badge>
              {!isLive && (
                <Badge
                  variant={isPartial ? "warning" : "secondary"}
                  className="capitalize"
                >
                  {source.status}
                </Badge>
              )}
            </div>
          </div>
          <div className="p-2 bg-primary/5 rounded-xl text-primary shrink-0">
            <Database className="w-6 h-6" />
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
          {source.description || "No description provided."}
        </p>

        {/* Details Grid */}
        <div className="grid grid-cols-1 gap-y-3 mb-6 bg-muted/30 rounded-xl p-4 border border-border/50">
          {source.output_summary && (
            <div className="flex gap-3">
              <Braces className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-0.5">Provides</span>
                <span className="text-sm text-muted-foreground">{source.output_summary}</span>
              </div>
            </div>
          )}

          {source.update_frequency && (
            <div className="flex gap-3">
              <Calendar className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-0.5">Update Frequency</span>
                <span className="text-sm text-muted-foreground">{source.update_frequency}</span>
              </div>
            </div>
          )}

          {source.known_limitations && (
            <div className="flex gap-3">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-0.5">Known Limitations</span>
                <span className="text-sm text-muted-foreground">{source.known_limitations}</span>
              </div>
            </div>
          )}
        </div>

        {/* Dependencies */}
        {source.dependencies && source.dependencies.length > 0 && (
          <div className="mb-6">
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 block">Dependencies</span>
            <div className="flex flex-wrap gap-2">
              {source.dependencies.map((dep) => (
                <span key={dep} className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-md border border-border/50 flex items-center gap-1.5">
                  <Activity className="w-3 h-3 opacity-70" />
                  {dep}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Endpoints */}
        {hasEndpoints && (
          <div className="mb-5 bg-muted/20 rounded-xl px-4 py-3 border border-border/40 space-y-2">
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1">Endpoints</span>
            {source.explorer_url && (
              <CopyableUrl
                url={source.explorer_url}
                label="Explorer"
                icon={<Map className="w-3.5 h-3.5" />}
              />
            )}
            {source.metadata_url && (
              <CopyableUrl
                url={source.metadata_url}
                label="API Metadata"
                icon={<Plug className="w-3.5 h-3.5" />}
              />
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto pt-4 border-t border-border flex flex-wrap gap-3">
          <a
            href={source.explorer_url || "#"}
            className={cn(
              "flex-1 inline-flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
              source.explorer_url
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 hover:-translate-y-0.5"
                : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed pointer-events-none"
            )}
            target={source.explorer_url?.startsWith('http') ? "_blank" : "_self"}
            rel={source.explorer_url?.startsWith('http') ? "noopener noreferrer" : undefined}
          >
            <Map className="w-4 h-4" />
            Explorer
          </a>

          {source.metadata_url ? (
            <Link
              href={`/source/${source.source_id}/metadata`}
              className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/30"
            >
              <Plug className="w-4 h-4" />
              API Metadata
            </Link>
          ) : (
            <span className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-border text-muted-foreground opacity-50 cursor-not-allowed">
              <Plug className="w-4 h-4" />
              API Metadata
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
