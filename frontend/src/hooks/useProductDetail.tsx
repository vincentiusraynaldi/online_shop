import { Product } from "../entity/Product";
import { useState, useEffect } from "react";

export function useProductDetail(id : string) {
    const [product, setProduct] = useState<Product>();
    // const [isLoading, setIsLoading] = useState(true);
    // const [error, setError] = useState<string | null>(null);

    useEffect(()=> {
        const fetchProductDetail = async () => {
            // setIsLoading(true);
            // setError(null);
            
            const response = await fetch (`/items/${id}`);

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

            const productResponse = await response.json();
            // setProduct(productResponse);
            // setIsLoading(false);

            setProduct(productResponse);
        }

        fetchProductDetail();
    }, [id]);

    // return {product, isLoading, error};
    return {product};
}
