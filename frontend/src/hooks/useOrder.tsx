import { useState, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Order } from "../entity/Order";

export function useOrder(){
// export function useCart(cartId: string){
    const [orders, setOrders] = useState<Order[]>([]);
    const [order, setOrder] = useState<Order | null>(null);
    const [token, setToken] = useLocalStorage<string | null>("token", null);
    const [isLoading, setIsLoading] = useState(true);

    // get data
    const fetchOrders = async () => {
        console.log("token ", token);
        const response = await fetch("http://localhost:4000/users/orders", {
            method: 'GET',
            headers: {"Authorization" : `Bearer ${token}`}
        });
        
        if (!response.ok) {
            console.error('Status:', response.status);
            console.error('URL hit:', response.url);
            const text = await response.text(); // read as text to see the HTML error
            console.error('Response body:', text);
            return;
        }

        const data = await response.json();

        setOrders(data);
    }

    useEffect(()=>{
        const load = async () => {
            try {
                await fetchOrders();
            } catch(error) {
                console.error("Network error: ", error);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [])

    const fetchOrderById = async (orderId: string) => {
        try {
            console.log("token ", token);
            const response = await fetch(`http://localhost:4000/users/orders/${orderId}`, {
                method: 'GET',
                headers: {"Authorization" : `Bearer ${token}`}
            });
            
            if (!response.ok) {
                console.error('Status:', response.status);
                console.error('URL hit:', response.url);
                const text = await response.text(); // read as text to see the HTML error
                console.error('Response body:', text);
                return;
            }

            const data = await response.json();

            setOrder(data);
            return order;
        } catch (error) {
            console.error("Network error: ", error);
        } finally {
            setIsLoading(false);
        }   
    }

    return {orders, order, isLoading, fetchOrders, fetchOrderById}
}
