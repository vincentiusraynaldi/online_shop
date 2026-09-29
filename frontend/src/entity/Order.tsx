import { Address } from "./Address";
import { Product } from "./Product";

export interface Order{
    id: string,
    totalPrice: string,
    user: string,
    address: Address,
    orderStatus: string,
    paymentMethod: string,
    createdAt: string,
    updatedAt: string,
    items: OrderItem[]
}

interface OrderItem{
    id: string;
    item: Product;
    quantity: number; 
}