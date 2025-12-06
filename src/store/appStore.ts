import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language } from '@/lib/i18n';

interface SaleEntry {
  id: string;
  date: string;
  item: string;
  quantity: number;
  price: number;
  profit: number;
}

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  lowStockThreshold: number;
  expiryDate?: string;
}

interface AppState {
  // Onboarding
  isOnboarded: boolean;
  setOnboarded: (value: boolean) => void;
  
  // Language
  language: Language;
  setLanguage: (lang: Language) => void;
  
  // Business
  businessType: string;
  setBusinessType: (type: string) => void;
  businessName: string;
  setBusinessName: (name: string) => void;
  
  // Sales
  sales: SaleEntry[];
  addSale: (sale: Omit<SaleEntry, 'id'>) => void;
  removeSale: (id: string) => void;
  
  // Inventory
  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => void;
  removeInventoryItem: (id: string) => void;
  
  // Marketing Projects
  savedCaptions: { id: string; text: string; createdAt: string }[];
  addCaption: (text: string) => void;
  removeCaption: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Onboarding
      isOnboarded: false,
      setOnboarded: (value) => set({ isOnboarded: value }),
      
      // Language
      language: 'am',
      setLanguage: (lang) => set({ language: lang }),
      
      // Business
      businessType: '',
      setBusinessType: (type) => set({ businessType: type }),
      businessName: '',
      setBusinessName: (name) => set({ businessName: name }),
      
      // Sales
      sales: [],
      addSale: (sale) =>
        set((state) => ({
          sales: [{ ...sale, id: crypto.randomUUID() }, ...state.sales],
        })),
      removeSale: (id) =>
        set((state) => ({
          sales: state.sales.filter((s) => s.id !== id),
        })),
      
      // Inventory
      inventory: [],
      addInventoryItem: (item) =>
        set((state) => ({
          inventory: [...state.inventory, { ...item, id: crypto.randomUUID() }],
        })),
      updateInventoryItem: (id, item) =>
        set((state) => ({
          inventory: state.inventory.map((i) =>
            i.id === id ? { ...i, ...item } : i
          ),
        })),
      removeInventoryItem: (id) =>
        set((state) => ({
          inventory: state.inventory.filter((i) => i.id !== id),
        })),
      
      // Marketing
      savedCaptions: [],
      addCaption: (text) =>
        set((state) => ({
          savedCaptions: [
            { id: crypto.randomUUID(), text, createdAt: new Date().toISOString() },
            ...state.savedCaptions,
          ],
        })),
      removeCaption: (id) =>
        set((state) => ({
          savedCaptions: state.savedCaptions.filter((c) => c.id !== id),
        })),
    }),
    {
      name: 'tenabiz-storage',
    }
  )
);
