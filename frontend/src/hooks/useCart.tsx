import { useState, useEffect } from "react";
import { Product } from "../entity/Product";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { ResetButton } from "formik-chakra-ui";
import { Cart } from "../entity/Cart";
import { data } from "framer-motion/client";

export function useCart(){
// export function useCart(cartId: string){
    // const [cart, setCart] = useState<Product[]>([]); //todo check whether the product[] is necesarry because it is a cart and theres are some products within
    const [cart, setCart] = useState<Cart>();
    const [token, setToken] = useLocalStorage<string | null>("token", null);
    const [isLoading, setIsLoading] = useState(true);

    // get data
    const fetchCart = async () => {
        console.log("token ", token);
        const response = await fetch("http://localhost:4000/users/carts", {
            method: 'GET',
            headers: {"Authorization" : `Bearer ${token}`}
        });
        // const text = await response.text();
        // console.log(text);
        
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

        // console.log("raw item:", data.items[0]); 
        // console.log("raw item1:", data.items); 
        // console.log("raw item2:", data); 

        const mappedCart: Cart = {
        ...data,
        items: data.items
            .map((item: any) => ({
                cartItemId: item.id,
                item: item.item,
                quantity: item.quantity,
                createdAt: item.createdAt,
            }))
            .sort((a: any, b: any) =>     
                a.cartItemId.localeCompare(b.cartItemId)
            )
        };
        
        setCart(mappedCart);
    }

    useEffect(()=>{
        const load = async () => {
            try {
                await fetchCart();
            } catch(error) {
                console.error("Network error: ", error);
            } finally {
                setIsLoading(false);
            }
        };
        load();
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
            console.error("Network error: ", error);
        }

    }

    //todo check whether update item is necessary(like check if additem only is alr enough or not for special case)

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

    const checkout = async (addressId : string) => {
        try {
            const response = await fetch("http://localhost:4000/users/carts/checkout", {
                method: 'POST',
                headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`},
                body: JSON.stringify({addressId}),
            })
            if (!response.json){
                console.error("Failed to checkout")
                return null;
            }

            const data =  await response.json();
            return data;
        } catch (error) {
            console.error("Network error: ", error)
            return null;
        }
    }

    return {cart, isLoading, addItem, removeItem, checkout, fetchCart}
}
