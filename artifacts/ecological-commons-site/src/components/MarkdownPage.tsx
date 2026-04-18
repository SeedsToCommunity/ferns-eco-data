import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLocation } from "wouter";
import type { Components } from "react-markdown";

interface MarkdownPageProps {
  content: string;
  worksheetStyle?: boolean;
}

const linkStyle = {
  color: "var(--color-link)",
  textDecoration: "underline",
  textUnderlineOffset: "2px",
};

export default function MarkdownPage({ content, worksheetStyle = false }: MarkdownPageProps) {
  const [, navigate] = useLocation();
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  const components: Components = {
    a({ href, children }) {
      if (!href) return <span>{children}</span>;

      if (href.startsWith("mailto:")) {
        return <a href={href} style={linkStyle}>{children}</a>;
      }

      if (href.startsWith("/") && !href.startsWith("//")) {
        return (
          <a
            href={base + href}
            onClick={(e) => {
              e.preventDefault();
              navigate(href);
            }}
            style={linkStyle}
          >
            {children}
          </a>
        );
      }

      return (
        <a href={href} target="_blank" rel="noopener noreferrer" style={linkStyle}>
          {children}
        </a>
      );
    },

    h1({ children }) {
      return (
        <h1 style={{
          fontSize: "1.875rem",
          fontWeight: 600,
          lineHeight: 1.25,
          color: "var(--color-text)",
          marginTop: 0,
          marginBottom: "1.5rem",
        }}>
          {children}
        </h1>
      );
    },

    h2({ children }) {
      return (
        <h2 style={{
          fontSize: "1.25rem",
          fontWeight: 600,
          lineHeight: 1.35,
          color: "var(--color-text)",
          marginTop: "2.5rem",
          marginBottom: "1rem",
          paddingBottom: "0.5rem",
          borderBottom: "1px solid var(--color-border)",
        }}>
          {children}
        </h2>
      );
    },

    h3({ children }) {
      return (
        <h3 style={{
          fontSize: "1.1rem",
          fontWeight: 600,
          color: "var(--color-text)",
          marginTop: "2rem",
          marginBottom: "0.75rem",
        }}>
          {children}
        </h3>
      );
    },

    p({ children }) {
      return (
        <p style={{
          marginBottom: "1.25rem",
          lineHeight: 1.7,
          color: "var(--color-text)",
        }}>
          {children}
        </p>
      );
    },

    ul({ children }) {
      return (
        <ul style={{
          listStyleType: "disc",
          paddingLeft: "1.5rem",
          marginBottom: "1.25rem",
          ...(worksheetStyle ? { lineHeight: 1.55 } : {}),
        }}>
          {children}
        </ul>
      );
    },

    ol({ children }) {
      return (
        <ol style={{
          listStyleType: "decimal",
          paddingLeft: "1.5rem",
          marginBottom: "1.25rem",
        }}>
          {children}
        </ol>
      );
    },

    li({ children }) {
      return (
        <li style={{
          lineHeight: worksheetStyle ? 1.55 : 1.7,
          color: "var(--color-text)",
          marginBottom: worksheetStyle ? "0.2rem" : "0.25rem",
        }}>
          {children}
        </li>
      );
    },

    blockquote({ children }) {
      return (
        <blockquote style={{
          borderLeft: "4px solid var(--color-border)",
          paddingLeft: "1rem",
          fontStyle: "italic",
          color: "var(--color-text-muted)",
          margin: "1.25rem 0",
        }}>
          {children}
        </blockquote>
      );
    },

    hr() {
      return <hr style={{ border: "none", borderTop: "1px solid var(--color-border)", margin: "2rem 0" }} />;
    },

    strong({ children }) {
      return <strong style={{ fontWeight: 600, color: "var(--color-text)" }}>{children}</strong>;
    },

    em({ children }) {
      return <em style={{ fontStyle: "italic" }}>{children}</em>;
    },

    code({ children }) {
      return (
        <code style={{
          backgroundColor: "var(--color-border)",
          color: "var(--color-text)",
          padding: "0.1em 0.3em",
          borderRadius: "3px",
          fontSize: "0.875em",
          fontFamily: "Menlo, Monaco, monospace",
        }}>
          {children}
        </code>
      );
    },
  };

  return (
    <main style={{ maxWidth: "720px", margin: "0 auto", padding: "3rem 1.5rem" }}>
      <article>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {content}
        </ReactMarkdown>
      </article>
    </main>
  );
}
