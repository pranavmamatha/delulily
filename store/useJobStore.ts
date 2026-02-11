import { create } from "zustand"

type JobType = {
  jobId: string | null;
  jobStatus: "created" | "uploading" | "processing" | "completed" | "failed" | null;
  templateId: string | null;
  createdAt: any;
  generatedImageUrl: string | null;
}

type Jobs = {
  jobs: JobType[];
  insertJobs: (job: JobType) => void;
  setJobStatus: (jobId: string, jobStatus: JobType["jobStatus"]) => void;
  insertGeneratedImageUrl: (jobId: string, url: string) => void;
  reset: () => void;
}

export const useJobStore = create<Jobs>((set) => ({
  jobs: [],
  insertJobs: (job) => {
    set((state) => ({
      jobs: [...state.jobs, job]
    }))
  },
  setJobStatus: (jobId, jobStatus) => {
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.jobId == jobId ? { ...job, jobStatus: jobStatus } : job
      )
    }))
  },
  insertGeneratedImageUrl: (jobId: string, url: string) => {
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.jobId === jobId ? { ...job, generatedImageUrl: url } : job
      )
    }))
  },
  reset: (() => {
    set(() => ({
      jobs: []
    }))
  })
}))


