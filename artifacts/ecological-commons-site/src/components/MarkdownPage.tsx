import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLocation } from "wouter";
import type { Components } from "react-markdown";

interface MarkdownPageProps {
  content: string;
  worksheetStyle?: boolean;
}

export default function MarkdownPage({ content, worksheetStyle = false }: MarkdownPageProps) {
  const [, navigate] = useLocation();
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  const components: Components = {
    a({ href, children }) {
      if (!href) return <span>{children}</span>;

      if (href.startsWith("mailto:")) {
        return <a href={href}>{children}</a>;
      }

      if (href.startsWith("/") && !href.startsWith("//")) {
        return (
          <a
            href={base + href}
            onClick={(e) => {
              e.preventDefault();
              navigate(href);
            }}
          >
            {children}
          </a>
        );
      }

      return (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    },
  };

  return (
    <main className="mx-auto max-w-[720px] px-6 py-12">
      <article className={["prose max-w-none", worksheetStyle ? "prose-worksheet" : ""].join(" ")}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {content}
        </ReactMarkdown>
      </article>
    </main>
  );
}
