import { supabase } from "@/lib/supabase"
import { useTemplateStore } from "@/store/useTemplateStore"
import { useEffect } from "react"

export function useTemplates() {
  useEffect(() => {
    const { setTemplateId } = useTemplateStore();
    (async () => {
      const { data, error } = await supabase.from("templates").select("*")
      if (error) {
        console.debug("Error while fetching templates: ", error)
      }
      data?.map((template) => {
        setTemplateId(template.id)
      })
    })()
  }, [])
}





















