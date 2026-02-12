import { create } from "zustand";

export type JobType = {
  jobId: string | null;
  jobStatus: "created" | "uploading" | "processing" | "completed" | "failed" | null;
  templateId: string | null;
  createdAt: any;
  generatedImageUrl: string | null;
  inputImageUrl: string | null;
}

type Jobs = {
  jobs: JobType[];
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  page: number;
  setPage: (page: number) => void;
  hasMore: boolean;
  setHasMore: (hasMore: boolean) => void;
  setJobs: (jobs: JobType[]) => void;
  appendJobs: (jobs: JobType[]) => void;
  updateJobUrls: (jobId: string, generatedImageUrl: string, inputImageUrl: string) => void;
  setJobStatus: (jobId: string, jobStatus: JobType["jobStatus"]) => void;
  reset: () => void;
}

export const useJobStore = create<Jobs>((set) => ({
  jobs: [],
  isLoading: true,
  setIsLoading: (loading) => set({ isLoading: loading }),
  page: 0,
  hasMore: true,
  setPage: (page) => set({ page }),
  setHasMore: (hasMore) => set({ hasMore }),
  setJobs: (jobs) => set({ jobs }),
  appendJobs: (newJobs) => {
    set((state) => {
      // Filter out duplicates by jobId
      const existingIds = new Set(state.jobs.map((j) => j.jobId));
      const unique = newJobs.filter((j) => !existingIds.has(j.jobId));
      return { jobs: [...state.jobs, ...unique] };
    });
  },
  updateJobUrls: (jobId, generatedImageUrl, inputImageUrl) => {
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.jobId === jobId ? { ...job, generatedImageUrl, inputImageUrl } : job
      )
    }))
  },
  setJobStatus: (jobId, jobStatus) => {
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.jobId === jobId ? { ...job, jobStatus: jobStatus } : job
      )
    }))
  },
  reset: () => {
    set(() => ({
      jobs: [],
      page: 0,
      hasMore: true,
      isLoading: true
    }))
  }
}))
