import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Pet } from 'db/schema';

interface CartItem extends Pet {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  total: number;
  addToCart: (pet: Pet) => void;
  removeFromCart: (petId: number) => void;
  updateQuantity: (petId: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      total: 0,
      addToCart: (pet) =>
        set((state) => {
          const existingItem = state.items.find((item) => item.id === pet.id);
          if (existingItem) {
            return {
              ...state,
              items: state.items.map((item) =>
                item.id === pet.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
              total: state.total + Number(pet.price),
            };
          }
          return {
            ...state,
            items: [...state.items, { ...pet, quantity: 1 }],
            total: state.total + Number(pet.price),
          };
        }),
      removeFromCart: (petId) =>
        set((state) => ({
          ...state,
          items: state.items.filter((item) => item.id !== petId),
          total: state.total -
            Number(state.items.find((item) => item.id === petId)?.price ?? 0) *
            (state.items.find((item) => item.id === petId)?.quantity ?? 0),
        })),
      updateQuantity: (petId, quantity) =>
        set((state) => {
          const item = state.items.find((item) => item.id === petId);
          if (!item) return state;
          
          const oldTotal = Number(item.price) * item.quantity;
          const newTotal = Number(item.price) * quantity;
          
          return {
            ...state,
            items: state.items.map((item) =>
              item.id === petId ? { ...item, quantity } : item
            ),
            total: state.total - oldTotal + newTotal,
          };
        }),
      clearCart: () => set({ items: [], total: 0 }),
    }),
    {
      name: 'cart-storage',
    }
  )
);
