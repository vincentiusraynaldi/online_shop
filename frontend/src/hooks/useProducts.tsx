// hook for fetching the products while filtering the paramether and the searchquery
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { URLSearchParams } from "url";

// interface ProductFilter {
    // name?: string;
    // categories?: string;
    // minPrice?: number;
    // maxPrice?: number;
    // inStock?: boolean;
    // brand?: string;
    // sortBy?: string;
    // sortOrder?: 'ASC' | 'DESC';
// }

// interface Pagination {
//     page: number;
//     limit: number;
//     offset: number;
//     totalPages: number;
// }

export async function useProduct(){
    const [products, setProducts] = useState();
    const [searchParams, setSearchParams] =  useSearchParams();
    // const [loading, setLoading] = useState(true); //!! for telling the client that the data is being fetched
    // const [pagination, setPagination] = useState<Pagination>({
    //     page: 1,
    //     limit: 20,
    //     offset: 0,
    //     totalPages: 0
    // });

    //todo buat filters, butuh urlbuildparameter
    

    const [filters, setFilters] = useState({
        name: '',
        categories: '',
        minPrice: undefined,
        maxPrice: undefined,
        inStock: false,
        brand: '',
        sortBy: 'itemName',
        sortOrder: 'DESC' as 'ASC' | 'DESC', 
        page: 1,
        limit: 20
    })

    // const handleNameChange = (name: string) => {
    //     ...filter,
    //     name: name,
    //     page: 1;
    // }

    useEffect(()=>{
        //fetch backend to get all items
        // const response =  await fetch(`/items?${filters}`);
        const fetchProducts = async () => {
            const params = new URLSearchParams();
            const name = params.get('name');
            const categories = params.get('categories');
            const minPrice = params.get('minPrice');
            const maxPrice = params.get('maxPrice');
            const inStock = params.get('inStock');
            const brand = params.get('brand');
            const sortBy = params.get('sortBy');
            const sortOrder = params.get('sortOrder');
            
            const response = await fetch(`/items?${params}`);

            setSearchParams(params);
        }
    })
}
// butuh filter
// butuh pagination