// hook for fetching the products while filtering the paramether and the searchquery
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Product } from "../entity/Product";
import { Category } from "../entity/Category";

export function useProduct(){
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<string[]>([]);
    const [searchParams, setSearchParams] =  useSearchParams();
    // const [loading, setLoading] = useState(true); //!! for telling the client that the data is being fetched
    // const [pagination, setPagination] = useState<Pagination>({
    //     page: 1,
    //     limit: 20,
    //     offset: 0,
    //     totalPages: 0
    // });

    useEffect(()=>{
        const fetchProducts = async () => {
            const params = new URLSearchParams();

            const name = searchParams.get('name');
            const categories = searchParams.getAll('categories');
            const minPrice = searchParams.get('minPrice');
            const maxPrice = searchParams.get('maxPrice');
            const inStock = searchParams.get('inStock');
            const brand = searchParams.get('brand');
            const sortBy = searchParams.get('sortBy');
            const sortOrder = searchParams.get('sortOrder');

            if (name) params.set('name', name);
            if (categories) categories.forEach(c => params.append('categories', c));
            if (minPrice) params.set('minPrice', minPrice);
            if (maxPrice) params.set('maxPrice', maxPrice);
            if (inStock) params.set('inStock', inStock);
            if (brand) params.set('brand', brand);
            if (sortBy) params.set('sortBy', sortBy);
            if (sortOrder) params.set('sortOrder', sortOrder);  
            
            const url = `/items?${params}`;
            
            const response = await fetch(url);

            console.log("fetch url: ", url);

            if (!response.ok) {
                console.error('Status:', response.status);
                console.error('URL hit:', response.url);
                const text = await response.text(); // read as text to see the HTML error
                console.error('Response body:', text);
                return;
            }

            const productResponse = await response.json();

            const freshProducts: Product[] =  productResponse.data;

            const categoriesMap = new Map<string, Category>();
            const brandSet = new Set<string>();

            freshProducts.forEach(p=> {
                const productCategory = p.categories;
                productCategory.forEach(c => categoriesMap.set(c.id, c));
                brandSet.add(p.itemBrand);
            })

            setProducts(freshProducts);
            setCategories([...categoriesMap.values()]);
            setBrands([...brandSet]);

            setSearchParams(params);

            // console.log("categories set: ", categoriesMap);
            // console.log("categories set value: ", categoriesMap.values());
            // console.log("categories products: ", categories);
        }

        fetchProducts();
    }, [searchParams]);

    // useEffect(() =>
    // {
    //     console.log("categories : ", categories);
    // },[categories])

    return {products, categories, brands};
}
// butuh filter
// butuh pagination