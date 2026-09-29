import { Product } from "./Product";

interface CartItem {
    cartItemId: string;
    item: Product;
    quantity: string;
    createdAt: string;
}

export interface Cart {
    totalPrice: string;
    items: CartItem[];
    id: string;
    user: string;
}