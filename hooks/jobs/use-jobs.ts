import { supabase } from "@/lib/supabase";
import { useJobStore } from "@/store/useJobStore";
import { useEffect } from "react";


export function useJobs() {
  const { insertJobs } = useJobStore();
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("jobs").select("*")
      if (error) {
        console.debug("Error fetching user jobs:", error)
      }
      data?.map((j) => {
        const job = { createdAt: j.created_at, jobId: j.id, templateId: j.template_id, jobStatus: j.status }
        insertJobs(job)
      })
    })();
  }, [])
}
