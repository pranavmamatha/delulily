import { supabase } from "@/lib/supabase";
import { JobType, useJobStore } from "@/store/useJobStore";
import { useCallback, useEffect, useRef } from "react";

const PAGE_SIZE = 6;
const POLL_INTERVAL = 5000;

export function useJobs() {
  const store = useJobStore;
  const isFetchingRef = useRef(false);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchJobs = useCallback(async (pageToFetch: number) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    const { setIsLoading, setHasMore, appendJobs, setJobs, setPage } = store.getState();

    try {
      setIsLoading(true);

      const start = pageToFetch * PAGE_SIZE;
      const end = start + PAGE_SIZE - 1;

      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order('created_at', { ascending: false })
        .range(start, end);

      if (error) {
        console.error("Error fetching user jobs:", error);
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

      // Build skeleton jobs (no image URLs yet)
      const skeletonJobs: JobType[] = data.map((j) => ({
        createdAt: j.created_at,
        jobId: j.id,
        templateId: j.template_id,
        jobStatus: j.status,
        generatedImageUrl: null,
        inputImageUrl: null,
      }));

      // For page 0 (refresh), replace all jobs; otherwise append
      if (pageToFetch === 0) {
        setJobs(skeletonJobs);
      } else {
        appendJobs(skeletonJobs);
      }

      // Mark loading done so skeletons are visible
      setIsLoading(false);
      setPage(pageToFetch);

      // Resolve signed URLs in parallel and update each job
      const { updateJobUrls } = store.getState();
      data.forEach(async (j) => {
        try {
          const outputUrl = `${j.user_id}/${j.id}/output.png`;
          const inputUrl = `${j.user_id}/${j.id}/input.png`;
          const { data: urlData } = await supabase.storage
            .from("jobs")
            .createSignedUrls([outputUrl, inputUrl], 3600);

          if (urlData) {
            updateJobUrls(
              j.id,
              urlData[0].signedUrl,
              urlData[1].signedUrl
            );
          }
        } catch (e) {
          console.error("Error fetching signed URLs for job:", j.id, e);
        }
      });
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    } finally {
      isFetchingRef.current = false;
    }
  }, []);

  // Poll for processing/uploading/created jobs
  const pollProcessingJobs = useCallback(async () => {
    const { jobs, setJobStatus, updateJobUrls } = store.getState();

    const pendingJobs = jobs.filter(
      (j) => j.jobStatus === "processing" || j.jobStatus === "uploading" || j.jobStatus === "created"
    );

    if (pendingJobs.length === 0) return;

    for (const job of pendingJobs) {
      if (!job.jobId) continue;
      try {
        const { data, error } = await supabase
          .from("jobs")
          .select("*")
          .eq("id", job.jobId)
          .single();

        if (error || !data) continue;

        // Update status if changed
        if (data.status !== job.jobStatus) {
          setJobStatus(job.jobId, data.status);

          // If completed, fetch signed URLs
          if (data.status === "completed") {
            const outputUrl = `${data.user_id}/${data.id}/output.png`;
            const inputUrl = `${data.user_id}/${data.id}/input.png`;
            const { data: urlData } = await supabase.storage
              .from("jobs")
              .createSignedUrls([outputUrl, inputUrl], 3600);

            if (urlData) {
              updateJobUrls(
                data.id,
                urlData[0].signedUrl,
                urlData[1].signedUrl
              );
            }
          }
        }
      } catch (e) {
        console.error("Error polling job:", job.jobId, e);
      }
    }
  }, []);

  const startPolling = useCallback(() => {
    if (pollTimerRef.current) return;
    pollTimerRef.current = setInterval(() => {
      pollProcessingJobs();
    }, POLL_INTERVAL);
  }, [pollProcessingJobs]);

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  const loadMore = useCallback(() => {
    const { hasMore, isLoading, page } = store.getState();
    if (!hasMore || isLoading) return;
    fetchJobs(page + 1);
  }, [fetchJobs]);

  const refresh = useCallback(() => {
    const { reset } = store.getState();
    reset();
    fetchJobs(0);
  }, [fetchJobs]);

  useEffect(() => {
    refresh();
    startPolling();

    return () => {
      stopPolling();
    };
  }, [refresh, startPolling, stopPolling]);

  // Subscribe to store values for the component
  const isLoading = useJobStore((s) => s.isLoading);
  const hasMore = useJobStore((s) => s.hasMore);

  return { loadMore, refresh, isLoading, hasMore };
}
