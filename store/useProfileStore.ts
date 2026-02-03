import { create } from "zustand"

type profile = {
  fullName: string | null
  avatarUrl: string | null

  setProfile: (fullName: string, avatarUrl: string) => void
  reset: () => void
}

export const useProfileStore = create<profile>((set) => ({
  fullName: null,
  avatarUrl: null,
  setProfile: (fullName: string, avatarUrl: string) => {
    set(() => ({
      fullName,
      avatarUrl
    }))
  },
  reset: () => {
    set(() => ({
      fullName: null,
      avatarUrl: null
    }))
  }
}))
