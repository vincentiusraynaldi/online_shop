// import { useSearchParams } from "react-router-dom";
// import { 
//     Box,
//     HStack,
//     Select,
//     Text
// } from "@chakra-ui/react";

// const ProductSort = () =>{
//     const [searchParams, setSearchParams]= useSearchParams();

//     const handleSelect = (value: string) => {
//         const params = new URLSearchParams(searchParams);

//         console.log("select")

//         if(value === "featured"){
//             const sortBy = params.get("sortBy");
//             const sortOrder = params.get("sortOrder");

//             if(sortBy) params.delete("sortBy", sortBy);
//             if(sortOrder) params.delete("sortOrder", sortOrder);
//         }else if(value === "price asc"){
//             params.set("sortBy", 'itemPrice')
//             params.set("sortOrder", 'ASC')
//         }else if (value === "price desc"){
//             params.set("sortBy", 'itemPrice')
//             params.set("sortOrder", 'DESC')
//         }

//         setSearchParams(params);
//     }

//     return (
//         <HStack>
//             <Box>
//                 <Text>test</Text>
//             </Box>
//             <Box w={200}>
//                 <Select placeholder='Select option' onChange={(e)=> handleSelect(e.target.value)}>
//                 <option value= "featured">Featured</option>
//                 <option value= "price asc" >Price: Low to high</option>
//                 <option value= "price desc" >Price: High to low</option>
//                 {/* <option value='option3'></option> */}
//                 </Select>
//             </Box>
//         </HStack>
//     )
// }

// export default ProductSort;



import { useSearchParams } from "react-router-dom";
import { Box, HStack, Spacer, Select, Tag, TagLabel, TagCloseButton, Wrap, WrapItem } from "@chakra-ui/react";

const ProductSort = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Read all active filters from URL
    const sortBy    = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder");
    const categories  = searchParams.getAll("categories");
    const minPrice  = searchParams.get("minPrice");
    const maxPrice  = searchParams.get("maxPrice");
    const brand  = searchParams.get("brand");

    const removeParam = (...keys: string[]) => {
        const params = new URLSearchParams(searchParams);
        keys.forEach((k) => params.delete(k));
        setSearchParams(params);
    };

    const handleSelect = (value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value === "featured") {
            params.delete("sortBy");
            params.delete("sortOrder");
        } else if (value === "price asc") {
            params.set("sortBy", "itemPrice");
            params.set("sortOrder", "ASC");
        } else if (value === "price desc") {
            params.set("sortBy", "itemPrice");
            params.set("sortOrder", "DESC");
        }
        setSearchParams(params);
    };

    const activeSort = sortBy && sortOrder
        ? sortOrder === "ASC" ? "price asc" : "price desc"
        : "featured";

    return (
        <HStack w="full" align="center">

            {/* All active filter tags on the left */}
            <Wrap flex={1}>

                {/* Sort tag */}
                {sortBy && sortOrder && (
                    <WrapItem>
                        <Tag colorScheme="blue" borderRadius="full">
                            <TagLabel>
                                {sortOrder === "ASC" ? "Price: Low to High" : "Price: High to Low"}
                            </TagLabel>
                            <TagCloseButton onClick={() => removeParam("sortBy", "sortOrder")} />
                        </Tag>
                    </WrapItem>
                )}

                {/* Category tag */}
                {categories && categories.map(cat =>
                    <WrapItem>
                        <Tag colorScheme="blue" borderRadius="full">
                            <TagLabel>Category: {cat}</TagLabel>
                            <TagCloseButton onClick={() => removeParam("categories")} />
                        </Tag>
                    </WrapItem>
                )}

                {/* Min price tag */}
                {minPrice && (
                    <WrapItem>
                        <Tag colorScheme="blue" borderRadius="full">
                            <TagLabel>Min: ${minPrice}</TagLabel>
                            <TagCloseButton onClick={() => removeParam("minPrice")} />
                        </Tag>
                    </WrapItem>
                )}

                {/* Max price tag */}
                {maxPrice && (
                    <WrapItem>
                        <Tag colorScheme="blue" borderRadius="full">
                            <TagLabel>Max: ${maxPrice}</TagLabel>
                            <TagCloseButton onClick={() => removeParam("maxPrice")} />
                        </Tag>
                    </WrapItem>
                )}

                {/* Max price tag */}
                {brand && (
                    <WrapItem>
                        <Tag colorScheme="blue" borderRadius="full">
                            <TagLabel>Brand: {brand}</TagLabel>
                            <TagCloseButton onClick={() => removeParam("brand")} />
                        </Tag>
                    </WrapItem>
                )}

            </Wrap>

            {/* Select pinned to the right */}
            <Box w={200} flexShrink={0}>
                <Select value={activeSort} onChange={(e) => handleSelect(e.target.value)}>
                    <option value="featured">Featured</option>
                    <option value="price asc">Price: Low to High</option>
                    <option value="price desc">Price: High to Low</option>
                </Select>
            </Box>

        </HStack>
    );
};

export default ProductSort;