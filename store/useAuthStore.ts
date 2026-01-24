import { Session } from "@supabase/supabase-js"
import { create } from "zustand"

type AuthType = {
  session?: Session | null;
  isLoading: boolean;
  isLoggedIn: boolean;

  setSession: (session: Session | null) => void;
  setIsLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthType>((set) => ({
  session: undefined,
  isLoading: true,
  isLoggedIn: false,
  setSession: (session) => {
    set(() => ({
      session,
      isLoggedIn: !!session
    }))
  },
  setIsLoading: (isLoading) => {
    set(() => ({
      isLoading
    }))
  },
  reset: () => {
    set(() => ({
      session: null,
      isloading: false,
      isLoggedIn: false
    }))
  }
}))


