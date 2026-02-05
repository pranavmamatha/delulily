import { create } from "zustand"

type Template = {
  templateId: string | null,
  setTemplateId: (templateId: string) => void,
}

export const useTemplateStore = create<Template>((set) => ({
  templateId: null,
  setTemplateId: (templateId) => {
    set(() => ({
      templateId: templateId
    }))
  }
}))
