import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TrustGroupDetailPage from "./TrustGroupDetailPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

export default function TrustGroupDetailApp({ slug }: { slug: string }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TrustGroupDetailPage slug={slug} />
    </QueryClientProvider>
  );
}
