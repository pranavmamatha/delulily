import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from "@/lib/supabase";

export function useAuthListener() {
  const { setSession, setIsLoading } = useAuthStore();
  useEffect(() => {
    const loadSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.debug("Error while fetching session:", error)
      }
      setSession(session)
      setIsLoading(false)
    }
    loadSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe();
  }
    , [])
}
