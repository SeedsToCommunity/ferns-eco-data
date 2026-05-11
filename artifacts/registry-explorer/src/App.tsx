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
import UniversalFqaPage from "@/pages/UniversalFqaPage";
import LcscgPage from "@/pages/LcscgPage";
import MnfiPage from "@/pages/MnfiPage";
import { NatureservePage } from "@/pages/NatureservePage";
import BotanicalRefSourcePage from "@/pages/BotanicalRefSourcePage";
import LbjPage from "@/pages/LbjPage";
import UsdaPlantsPage from "@/pages/UsdaPlantsPage";
import GenericSourcePage from "@/pages/GenericSourcePage";
import SourceRelationshipsPage from "@/pages/SourceRelationshipsPage";
import TrustGroupsPage from "@/pages/TrustGroupsPage";
import TrustGroupDetailPage from "@/pages/TrustGroupDetailPage";
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
      <Route path="/source/universal-fqa" component={UniversalFqaPage} />
      <Route path="/source/lcscg" component={LcscgPage} />
      <Route path="/source/mnfi" component={MnfiPage} />
      <Route path="/source/natureserve" component={NatureservePage} />
      {/* Botanical web reference sources — shared explorer with species lookup */}
      <Route path="/source/gobotany" component={BotanicalRefSourcePage} />
      <Route path="/source/google-images" component={BotanicalRefSourcePage} />
      <Route path="/source/illinois-wildflowers" component={BotanicalRefSourcePage} />
      <Route path="/source/lady-bird-johnson" component={LbjPage} />
      <Route path="/source/minnesota-wildflowers" component={BotanicalRefSourcePage} />
      <Route path="/source/missouri-plants" component={BotanicalRefSourcePage} />
      <Route path="/source/prairie-moon" component={BotanicalRefSourcePage} />
      <Route path="/source/usda-plants" component={UsdaPlantsPage} />
      <Route path="/source-relationships" component={SourceRelationshipsPage} />
      <Route path="/trust-groups" component={TrustGroupsPage} />
      <Route path="/trust-groups/:slug" component={TrustGroupDetailPage} />
      <Route path="/source/:sourceId/metadata" component={MetadataPage} />
      {/* Generic fallback: any source not matched above gets the metadata page */}
      <Route path="/source/:sourceId" component={GenericSourcePage} />
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
