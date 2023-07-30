import { create } from 'zustand';

interface useStoreModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useStoreModal = create<useStoreModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));


// create state for userdatafetched

interface useStoreUserDataFetchedStore {
  userDataFetched: boolean;
  setUserDataFetched: (value:boolean) => void;
  
}

export const useStoreUserDataFetched = create<useStoreUserDataFetchedStore>((set) => ({
  userDataFetched: false,
  setUserDataFetched: (value) => set(() =>({ userDataFetched: value })),
}));