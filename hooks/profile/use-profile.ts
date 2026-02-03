import { useProfileStore } from "@/store/useProfileStore";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

export function useProfile() {
  const { setProfile } = useProfileStore()
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("profiles").select("*")
      if (error) {
        console.debug("Error while fetching user Profile", error)
        return
      }
      if (!data) {
        console.debug("Error while fetching user Profile", error)
        return
      }
      setProfile(data[0].full_name, data[0].avatar_url)

    }
    fetchData();
  }, [])
} 
