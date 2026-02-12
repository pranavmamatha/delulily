import { create } from "zustand";

export type TemplateType = {
  id: string;
  name: string;
  previewUrl: string | null;
}

type TemplateStore = {
  templates: TemplateType[];
  isLoading: boolean;
  page: number;
  hasMore: boolean;
  setTemplates: (templates: TemplateType[]) => void;
  appendTemplates: (templates: TemplateType[]) => void;
  setIsLoading: (loading: boolean) => void;
  setPage: (page: number) => void;
  setHasMore: (hasMore: boolean) => void;
  selectedTemplateId: string | null;
  setSelectedTemplateId: (templateId: string | null) => void;
}

export const useTemplateStore = create<TemplateStore>((set) => ({
  templates: [],
  isLoading: true,
  page: 0,
  hasMore: true,
  setTemplates: (templates) => set({ templates }),
  appendTemplates: (newTemplates) => {
    set((state) => {
      const existingIds = new Set(state.templates.map((t) => t.id));
      const unique = newTemplates.filter((t) => !existingIds.has(t.id));
      return { templates: [...state.templates, ...unique] };
    });
  },
  setIsLoading: (loading) => set({ isLoading: loading }),
  setPage: (page) => set({ page }),
  setHasMore: (hasMore) => set({ hasMore }),
  selectedTemplateId: null,
  setSelectedTemplateId: (templateId) => set({ selectedTemplateId: templateId }),
}))
