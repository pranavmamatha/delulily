import { supabase } from "@/lib/supabase";
import { TemplateType, useTemplateStore } from "@/store/useTemplateStore";
import { useCallback, useEffect, useRef } from "react";

const PAGE_SIZE = 6;

export function useTemplates() {
  const store = useTemplateStore;
  const isFetchingRef = useRef(false);

  const fetchTemplates = useCallback(async (pageToFetch: number, search?: string) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    const { setIsLoading, setHasMore, setTemplates, appendTemplates, setPage } = store.getState();

    try {
      setIsLoading(true);

      const start = pageToFetch * PAGE_SIZE;
      const end = start + PAGE_SIZE - 1;

      let query = supabase
        .from("templates")
        .select("*")
        .order("created_at", { ascending: false })
        .range(start, end);

      // Apply search filter if provided
      if (search && search.trim().length > 0) {
        query = query.ilike("name", `%${search.trim()}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching templates:", error);
        setIsLoading(false);
        isFetchingRef.current = false;
        return;
      }

      if (!data || data.length === 0) {
        if (pageToFetch === 0) {
          setTemplates([]);
        }
        setHasMore(false);
        setIsLoading(false);
        isFetchingRef.current = false;
        return;
      }

      setHasMore(data.length >= PAGE_SIZE);

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
    const { hasMore, isLoading, page, searchQuery } = store.getState();
    if (!hasMore || isLoading) return;
    fetchTemplates(page + 1, searchQuery);
  }, [fetchTemplates]);

  const refresh = useCallback(() => {
    const s = store.getState();
    s.setTemplates([]);
    s.setPage(0);
    s.setHasMore(true);
    s.setIsLoading(true);
    fetchTemplates(0, s.searchQuery);
  }, [fetchTemplates]);

  const pullToRefresh = useCallback(async () => {
    const s = store.getState();
    s.setIsRefreshing(true);
    s.setSearchQuery("");
    s.setTemplates([]);
    s.setPage(0);
    s.setHasMore(true);
    // Force reset fetching ref so it can proceed
    isFetchingRef.current = false;
    await fetchTemplates(0, "");
    store.getState().setIsRefreshing(false);
  }, [fetchTemplates]);

  const search = useCallback((query: string) => {
    const s = store.getState();
    s.setSearchQuery(query);
    s.setTemplates([]);
    s.setPage(0);
    s.setHasMore(true);
    // Force reset fetching ref
    isFetchingRef.current = false;
    fetchTemplates(0, query);
  }, [fetchTemplates]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isLoading = useTemplateStore((s) => s.isLoading);
  const isRefreshing = useTemplateStore((s) => s.isRefreshing);
  const hasMore = useTemplateStore((s) => s.hasMore);

  return { loadMore, refresh, pullToRefresh, search, isLoading, isRefreshing, hasMore };
}
