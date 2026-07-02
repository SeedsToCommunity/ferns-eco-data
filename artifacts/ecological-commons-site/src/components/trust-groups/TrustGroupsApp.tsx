import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TrustGroupsPage from "./TrustGroupsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

export default function TrustGroupsApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <TrustGroupsPage />
    </QueryClientProvider>
  );
}
