import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "@/pages/Home";
import MetadataPage from "@/pages/MetadataPage";
import VocabularyPage from "@/pages/VocabularyPage";
import BonapPage from "@/pages/BonapPage";
import GbifPage from "@/pages/GbifPage";
import InatPage from "@/pages/InatPage";
import MifloraPage from "@/pages/MifloraPage";
import S2CPage from "@/pages/S2CPage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
      retry: 1,
    }
  }
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/source/bonap-napa" component={BonapPage} />
      <Route path="/source/gbif" component={GbifPage} />
      <Route path="/source/inaturalist" component={InatPage} />
      <Route path="/source/michigan-flora" component={MifloraPage} />
      <Route path="/source/seeds-to-community-washtenaw" component={S2CPage} />
      <Route path="/source/:sourceId/metadata" component={MetadataPage} />
      <Route path="/vocabulary/:vocabulary" component={VocabularyPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
