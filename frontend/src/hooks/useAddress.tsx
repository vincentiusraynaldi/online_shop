import { useState, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Address, CreateAddressPayload } from "../entity/Address";

export function useAddress(){
// export function useCart(cartId: string){
    // const [cart, setCart] = useState<Product[]>([]); //todo check whether the product[] is necesarry because it is a cart and theres are some products within
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [token, setToken] = useLocalStorage<string | null>("token", null);
    const [isLoading, setIsLoading] = useState(true);

    // get data
    const fetchAddress = async () => {
        try {
            console.log("token ", token);
            const response = await fetch("http://localhost:4000/users/addresses", {
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
            // console.log("addresses data : ", data);

            
            setAddresses(data);

            console.log("addresses: ", addresses);
        } catch(error) {
            console.error("Network error: ", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(()=>{
        const load = async () => {
                await fetchAddress(); // ← now properly awaited
        };
        load();
    }, [])

    useEffect(() => {
        console.log("total addresses:", addresses.length);
        addresses.forEach((address, index) => {
            console.log(`address ${index}:`, address);
        });
    }, [addresses]);

    async function createAddress(payload: CreateAddressPayload) {
        console.log("add masuk");
        try {
            const response = await fetch("http://localhost:4000/users/addresses", {
                method: 'POST',
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            console.log("response add: ", data);
            console.log("stringify: ", JSON.stringify(payload));
            if (!response.ok) {
                console.error("Failed to add item");
            }
            await fetchAddress();
            return data as Address;
        } catch (error) {
            // throw new Error("Failed to add item");
            console.error("Network error: ", error);
        }

    }

    //todo check whether update item is necessary(like check if additem only is alr enough or not for special case)

    const removeAddress = async (addressId: string) => {
        try {
            const response = await fetch(`http://localhost:4000/users/addresses/${addressId}`, {
                method: 'DELETE',
                headers: {"Authorization": `Bearer ${token}`}
            });
            if (!response.json) {
                console.error("Failed to add item");
            }
            await fetchAddress();
        } catch (error) {
            console.error("Network error: ", error)
        }
    }
    return {addresses, isLoading, createAddress, removeAddress, fetchAddress}
}
