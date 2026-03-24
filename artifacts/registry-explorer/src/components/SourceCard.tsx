import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Database, Activity, AlertCircle, Calendar, Braces } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { SourceSummary } from "@workspace/api-client-react";

interface SourceCardProps {
  source: SourceSummary;
  index: number;
}

export function SourceCard({ source, index }: SourceCardProps) {
  const isLive = source.status === "live";
  const isPartial = source.status === "partial";

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
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded-md">
                {source.source_id}
              </span>
              <Badge
                variant={isLive ? "success" : isPartial ? "warning" : "secondary"}
                className="capitalize"
              >
                {source.status}
              </Badge>
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
            Explorer
            <ExternalLink className="w-4 h-4" />
          </a>
          
          <a
            href={source.metadata_url || "#"}
            className={cn(
              "flex-1 inline-flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200",
              source.metadata_url
                ? "border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/30"
                : "border-border text-muted-foreground opacity-50 cursor-not-allowed pointer-events-none"
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            API Metadata
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
