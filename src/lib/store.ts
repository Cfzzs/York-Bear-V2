import { create } from "zustand";

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  setItems: (items: CartItem[]) => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, qty: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  setItems: (items) => set({ items }),
  toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  addItem: (item) =>
    set((state) => {
      const existing = state.items.find(
        (i) =>
          i.productId === item.productId &&
          i.size === item.size &&
          i.color === item.color
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === item.productId &&
            i.size === item.size &&
            i.color === item.color
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, item] };
    }),
  removeItem: (productId, size, color) =>
    set((state) => ({
      items: state.items.filter(
        (i) =>
          !(i.productId === productId && i.size === size && i.color === color)
      ),
    })),
  updateQuantity: (productId, size, color, qty) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.productId === productId && i.size === size && i.color === color
          ? { ...i, quantity: qty }
          : i
      ),
    })),
  clearCart: () => set({ items: [] }),
  getTotal: () => {
    const items = get().items;
    return items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  },
  getItemCount: () => {
    return get().items.reduce((acc, i) => acc + i.quantity, 0);
  },
}));
