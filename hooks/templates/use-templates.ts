import { supabase } from "@/lib/supabase";
import { TemplateType, useTemplateStore } from "@/store/useTemplateStore";
import { useCallback, useEffect, useRef } from "react";

const PAGE_SIZE = 6;

export function useTemplates() {
  const store = useTemplateStore;
  const isFetchingRef = useRef(false);

  const fetchTemplates = useCallback(async (pageToFetch: number) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    const { setIsLoading, setHasMore, setTemplates, appendTemplates, setPage } = store.getState();

    try {
      setIsLoading(true);

      const start = pageToFetch * PAGE_SIZE;
      const end = start + PAGE_SIZE - 1;

      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .order("created_at", { ascending: false })
        .range(start, end);

      if (error) {
        console.error("Error fetching templates:", error);
        setIsLoading(false);
        isFetchingRef.current = false;
        return;
      }

      if (!data || data.length === 0) {
        setHasMore(false);
        setIsLoading(false);
        isFetchingRef.current = false;
        return;
      }

      setHasMore(data.length >= PAGE_SIZE);

      // Build templates without preview URLs first
      const skeletonTemplates: TemplateType[] = data.map((t) => ({
        id: t.id,
        name: t.name ?? "Untitled",
        previewUrl: null,
      }));

      if (pageToFetch === 0) {
        setTemplates(skeletonTemplates);
      } else {
        appendTemplates(skeletonTemplates);
      }

      setIsLoading(false);
      setPage(pageToFetch);

      // Resolve preview URLs in parallel
      const paths = data.map((t) => `${t.id}/preview.png`);
      const { data: urlData, error: urlError } = await supabase.storage
        .from("templates")
        .createSignedUrls(paths, 3600);

      if (urlError) {
        console.error("Error fetching template preview URLs:", urlError);
        isFetchingRef.current = false;
        return;
      }

      // Update each template with its preview URL
      if (urlData) {
        const { templates: currentTemplates } = store.getState();
        const updated = currentTemplates.map((t) => {
          const dataIndex = data.findIndex((d) => d.id === t.id);
          if (dataIndex !== -1 && urlData[dataIndex]?.signedUrl) {
            return { ...t, previewUrl: urlData[dataIndex].signedUrl };
          }
          return t;
        });
        setTemplates(updated);
      }
    } catch (e) {
      console.error("Error in fetchTemplates:", e);
      const { setIsLoading } = store.getState();
      setIsLoading(false);
    } finally {
      isFetchingRef.current = false;
    }
  }, []);

  const loadMore = useCallback(() => {
    const { hasMore, isLoading, page } = store.getState();
    if (!hasMore || isLoading) return;
    fetchTemplates(page + 1);
  }, [fetchTemplates]);

  const refresh = useCallback(() => {
    const s = store.getState();
    s.setTemplates([]);
    s.setPage(0);
    s.setHasMore(true);
    s.setIsLoading(true);
    fetchTemplates(0);
  }, [fetchTemplates]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isLoading = useTemplateStore((s) => s.isLoading);
  const hasMore = useTemplateStore((s) => s.hasMore);

  return { loadMore, refresh, isLoading, hasMore };
}
