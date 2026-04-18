import { Router, Route, Switch } from "wouter";
import Nav from "./components/Nav";
import MarkdownPage from "./components/MarkdownPage";

import indexContent from "./content/index.md?raw";
import builtContent from "./content/built.md?raw";
import ideaContent from "./content/idea.md?raw";
import informationFrontierContent from "./content/information-frontier.md?raw";
import computingFrontierContent from "./content/computing-frontier.md?raw";
import worksheetContent from "./content/worksheet.md?raw";

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  return (
    <Router base={base}>
      <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
        <Nav />
        <Switch>
          <Route path="/" component={() => <MarkdownPage content={indexContent} />} />
          <Route path="/built" component={() => <MarkdownPage content={builtContent} />} />
          <Route path="/idea" component={() => <MarkdownPage content={ideaContent} />} />
          <Route path="/idea/information-frontier" component={() => <MarkdownPage content={informationFrontierContent} />} />
          <Route path="/idea/computing-frontier" component={() => <MarkdownPage content={computingFrontierContent} />} />
          <Route path="/worksheet" component={() => <MarkdownPage content={worksheetContent} worksheetStyle />} />
          <Route>
            <main className="mx-auto max-w-[720px] px-6 py-12">
              <h1 style={{ fontSize: "1.75rem", fontWeight: 600, marginBottom: "1rem" }}>Page not found</h1>
              <p style={{ color: "var(--color-text-muted)" }}>
                The page you're looking for doesn't exist.{" "}
                <a href={base + "/"} style={{ color: "var(--color-link)", textDecoration: "underline" }}>
                  Return home →
                </a>
              </p>
            </main>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
