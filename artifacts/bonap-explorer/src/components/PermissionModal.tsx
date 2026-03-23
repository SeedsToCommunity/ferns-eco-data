import { ShieldAlert, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface PermissionModalProps {
  permissionGranted: boolean;
  permissionStatus: string;
}

export function PermissionModal({ permissionGranted, permissionStatus }: PermissionModalProps) {
  // Local state to track acknowledgment per session
  const [acknowledged, setAcknowledged] = useState(false);

  // Re-evaluate on mount (ensures it appears on every page load unless permission is globally granted)
  useEffect(() => {
    setAcknowledged(false);
  }, []);

  // Only show if not globally granted AND not acknowledged in this session
  const shouldShow = !permissionGranted && !acknowledged;

  return (
    <AnimatePresence>
      {shouldShow && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-foreground/30 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl bg-card border-2 border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="h-2 w-full bg-destructive" />
            <div className="p-8">
              <div className="w-16 h-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-6">
                <ShieldAlert className="w-8 h-8" />
              </div>
              
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4 tracking-tight">
                Permission Acknowledgment Required
              </h2>
              
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">BONAP (Biota of North America Program)</strong> requires advance written permission for reproduction or use of any materials on their website. 
                </p>
                <p>
                  FERNS has not yet received written permission from BONAP. You may use this Explorer for review and development purposes, but data from this source must not be displayed in any public-facing application until permission is obtained.
                </p>
                <div className="bg-secondary/50 p-4 rounded-xl border border-secondary text-sm flex gap-3 items-start mt-6">
                  <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-secondary-foreground font-medium">
                    Status: <span className="text-muted-foreground font-normal">{permissionStatus}</span>
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t flex justify-end">
                <Button 
                  onClick={() => setAcknowledged(true)} 
                  size="lg"
                  className="w-full sm:w-auto font-medium"
                >
                  I Understand and Agree
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
