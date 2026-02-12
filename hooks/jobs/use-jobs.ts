import { supabase } from "@/lib/supabase";
import { useJobStore } from "@/store/useJobStore";
import { useEffect } from "react";


export function useJobs() {
  const { insertJobs, jobs, reset } = useJobStore();
  useEffect(() => {
    (async () => {
      // Reset jobs to avoid duplicates
      reset();

      const { data, error } = await supabase.from("jobs").select("*")
      if (error) {
        console.debug("Error fetching user jobs:", error)
        return;
      }

      if (!data || data.length === 0) {
        return;
      }

      // Fetch all jobs in parallel
      const jobPromises = data.map(async (j) => {
        const outputUrl = `${j.user_id}/${j.id}/output.png`
        const inputUrl = `${j.user_id}/${j.id}/input.png`
        const { data: urlData } = await supabase.storage.from("jobs").createSignedUrls([outputUrl, inputUrl], 120);
        if (!urlData) {
          return null;
        }
        const generatedImageUrl = urlData[0].signedUrl;
        const inputImageUrl = urlData[1].signedUrl;
        return {
          createdAt: j.created_at,
          jobId: j.id,
          templateId: j.template_id,
          jobStatus: j.status,
          generatedImageUrl,
          inputImageUrl
        }
      });

      const allJobs = await Promise.all(jobPromises);
      const validJobs = allJobs.filter(job => job !== null);

      // Insert all jobs at once
      validJobs.forEach(job => {
        if (job) insertJobs(job);
      });
    })();
  }, [])
}
