import { createContext, useContext } from "react";
import { useCart } from "../hooks/useCart";
import { Cart } from "../entity/Cart";

interface CartContextType {
    cart: Cart | undefined;
    isLoading: boolean;
    addItem: (itemId: string, quantity: string) => Promise<void>;
    removeItem: (itemId: string, quantity: string) => Promise<void>;
    checkout: (addressId: string) => Promise<any>;
    fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCartContext = () =>{
    const context = useContext(CartContext);
    if (context === undefined){
        throw new Error("useCartContext must be used within a CartProvider");
    }
    return context;
} 

export type CartProviderProps = {
    children: React.ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
    const cart = useCart();

    return (
        <CartContext.Provider value={cart}>
            {children}
        </CartContext.Provider>
    )
}