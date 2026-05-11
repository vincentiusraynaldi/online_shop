import { useState, useEffect } from "react";
import { Product } from "../entity/Product";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface cartItem {
    itemId : string;
    quantity: string;
}


export function useCart(){
// export function useCart(cartId: string){
    const [cart, setCart] = useState<Product[]>([]);
    const [token, setToken] = useLocalStorage<string | null>("token", null);

    // get data
    const fetchCart = async () => {
        const response = await fetch("/users/carts");
        
        if (!response.ok) {
            // setError("Failed to fetch product");
            // setIsLoading(false);
            // return;
            console.error('Status:', response.status);
            console.error('URL hit:', response.url);
            const text = await response.text(); // read as text to see the HTML error
            console.error('Response body:', text);
            return;
        }

        const data = await response.json();
        setCart(data);
    }

    useEffect(()=>{
        fetchCart();
    }, [])

    const addItem = async (itemId: string, quantity: string) => {
        console.log("add masuk")
        //todo convert cartItem into json, body for post request
        try {
            const response = await fetch("http://localhost:4000/users/carts/items", {
                method: 'POST',
                headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`},
                body: JSON.stringify({itemId, quantity}),
            });
            const data = await response.json();
            console.log("response add: ", data); 
            console.log("stringify: ", JSON.stringify({ itemId, quantity }));
            if(!response.ok){
                console.error("Failed to add item");
            }
            await fetchCart();
        } catch (error) {
            // throw new Error("Failed to add item");
            // console.error("Network error: ", error);
        }

    }

    //todo check whether update item is necessary(like check if additem only is alr enough or not for special case)
    // const updateItem =  async (cartItem: cartItem){
    //     cosnt response = await fetch("")
    //     await fetchCart();
    // }

    const removeItem = async (itemId: string, quantity: string) => {
        try {
            const response = await fetch("http://localhost:4000/users/carts/items/", {
                method: 'DELETE',
                headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`},
                body: JSON.stringify({itemId, quantity}),
            });
            if (!response.json) {
                console.error("Failed to add item");
            }
            await fetchCart();
        } catch (error) {
            console.error("Network error: ", error)
        }
    }
    return {cart, addItem, removeItem}
}
