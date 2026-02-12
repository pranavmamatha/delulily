import { create } from "zustand";

export type TemplateType = {
  id: string;
  name: string;
  previewUrl: string | null;
}

type TemplateStore = {
  templates: TemplateType[];
  isLoading: boolean;
  isRefreshing: boolean;
  page: number;
  hasMore: boolean;
  searchQuery: string;
  setTemplates: (templates: TemplateType[]) => void;
  appendTemplates: (templates: TemplateType[]) => void;
  setIsLoading: (loading: boolean) => void;
  setIsRefreshing: (refreshing: boolean) => void;
  setPage: (page: number) => void;
  setHasMore: (hasMore: boolean) => void;
  setSearchQuery: (query: string) => void;
  selectedTemplateId: string | null;
  setSelectedTemplateId: (templateId: string | null) => void;
  reset: () => void;
}

export const useTemplateStore = create<TemplateStore>((set) => ({
  templates: [],
  isLoading: true,
  isRefreshing: false,
  page: 0,
  hasMore: true,
  searchQuery: "",
  setTemplates: (templates) => set({ templates }),
  appendTemplates: (newTemplates) => {
    set((state) => {
      const existingIds = new Set(state.templates.map((t) => t.id));
      const unique = newTemplates.filter((t) => !existingIds.has(t.id));
      return { templates: [...state.templates, ...unique] };
    });
  },
  setIsLoading: (loading) => set({ isLoading: loading }),
  setIsRefreshing: (refreshing) => set({ isRefreshing: refreshing }),
  setPage: (page) => set({ page }),
  setHasMore: (hasMore) => set({ hasMore }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  selectedTemplateId: null,
  setSelectedTemplateId: (templateId) => set({ selectedTemplateId: templateId }),
  reset: () => set({
    templates: [],
    page: 0,
    hasMore: true,
    isLoading: true,
    isRefreshing: false,
    searchQuery: "",
  }),
}))
