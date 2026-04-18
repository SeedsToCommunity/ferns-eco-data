import { Link, useLocation } from "wouter";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "The Idea", href: "/idea" },
  { label: "What's Built", href: "/built" },
  { label: "Worksheet", href: "/worksheet" },
];

export default function Nav() {
  const [location] = useLocation();

  return (
    <header style={{ borderBottom: "1px solid var(--color-border)", backgroundColor: "var(--color-bg-nav)" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "1rem 1.5rem" }}>
        <nav style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem 1.5rem", alignItems: "center" }}>
          {NAV_LINKS.map(({ label, href }) => {
            const isActive =
              href === "/"
                ? location === "/" || location === ""
                : location === href || location.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                  textDecoration: isActive ? "underline" : "none",
                  textUnderlineOffset: "4px",
                  color: isActive ? "var(--color-link)" : "var(--color-text-muted)",
                  transition: "color 0.15s",
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
