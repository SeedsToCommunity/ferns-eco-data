import { useState, useEffect, useRef } from "react";

interface ApiGetState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApiGet<T>(url: string | null): ApiGetState<T> {
  const [state, setState] = useState<ApiGetState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!url) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    fetch(url, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => res.statusText);
          throw new Error(`${res.status}: ${text}`);
        }
        return res.json() as Promise<T>;
      })
      .then((data) => {
        if (!controller.signal.aborted) {
          setState({ data, loading: false, error: null });
        }
      })
      .catch((err: Error) => {
        if (err.name !== "AbortError") {
          setState({ data: null, loading: false, error: err.message });
        }
      });

    return () => {
      controller.abort();
    };
  }, [url]);

  return state;
}
