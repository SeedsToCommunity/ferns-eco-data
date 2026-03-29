import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, ChevronDown, ChevronUp } from "lucide-react";

interface RawJsonPanelProps {
  title: string;
  data: unknown;
}

export function RawJsonPanel({ title, data }: RawJsonPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!data) return null;

  return (
    <div className="mt-8 border border-border/50 rounded-xl overflow-hidden bg-muted/30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Code className="w-4 h-4 text-muted-foreground" />
          Raw JSON Response: {title}
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 pt-0 border-t border-border/50">
              <pre className="text-[11px] font-mono leading-relaxed bg-[#1e1e1e] text-[#d4d4d4] p-4 rounded-lg overflow-x-auto max-h-[500px] overflow-y-auto mt-4 shadow-inner">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
