import create from "zustand";

const useGlobalStore = create((set) => ({
  editor: null,
  setEditor: (editor) => set({ editor }),
}));

export { useGlobalStore };
