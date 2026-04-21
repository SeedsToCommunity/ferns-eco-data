import React from "react";
import { Link, useLocation } from "wouter";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  return (
    <div className="min-h-screen flex flex-col bg-background relative selection:bg-primary/20 selection:text-primary">
      {/* Decorative Background Pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.02] mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}images/hero-pattern.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      />
      
      {/* Header */}
      <header className="relative z-10 border-b border-border bg-card/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-foreground">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground leading-tight tracking-tight">Ecological Commons Data Layer</h1>
              </div>
            </div>
            
            <nav className="flex items-center gap-6">
              <Link
                href="/source-relationships"
                className={`text-sm font-medium transition-colors ${
                  location === "/source-relationships"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                Relationships
              </Link>
              <a href="/api/v1/sources" target="_blank" rel="noreferrer" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Raw API
              </a>
              <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <span className="hidden sm:inline">OpenAPI</span>
                <a href="/api/openapi.json" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors px-1">
                  JSON
                </a>
                <span className="text-border">·</span>
                <a href="/api/openapi.yaml" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors px-1">
                  YAML
                </a>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border bg-card/50 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div>
            <p className="text-sm font-medium text-foreground">Ecological Commons Data Layer</p>
            <p className="text-xs text-muted-foreground mt-1">Seeds to Community / Washtenaw County</p>
          </div>
          <div className="text-xs text-muted-foreground bg-muted/50 px-4 py-2 rounded-lg border border-border/50">
            Data licensed <strong>CC BY 4.0</strong> where applicable.
          </div>
        </div>
      </footer>
    </div>
  );
}
