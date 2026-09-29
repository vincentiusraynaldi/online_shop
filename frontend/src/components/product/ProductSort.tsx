import { useSearchParams } from "react-router-dom";
import { Box, HStack, Spacer, Select, Tag, TagLabel, TagCloseButton, Wrap, WrapItem, Text } from "@chakra-ui/react";

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

    // return (
    //     <HStack w="full" align="center">

    //         {/* All active filter tags on the left */}
    //         <Wrap flex={1}>

    //             {/* Sort tag */}
    //             {sortBy && sortOrder && (
    //                 <WrapItem>
    //                     <Tag colorScheme="blue" borderRadius="full">
    //                         <TagLabel>
    //                             {sortOrder === "ASC" ? "Price: Low to High" : "Price: High to Low"}
    //                         </TagLabel>
    //                         <TagCloseButton onClick={() => removeParam("sortBy", "sortOrder")} />
    //                     </Tag>
    //                 </WrapItem>
    //             )}

    //             {/* Category tag */}
    //             {categories && categories.map(cat =>
    //                 <WrapItem>
    //                     <Tag colorScheme="blue" borderRadius="full">
    //                         <TagLabel>Category: {cat}</TagLabel>
    //                         <TagCloseButton onClick={() => removeParam("categories")} />
    //                     </Tag>
    //                 </WrapItem>
    //             )}

    //             {/* Min price tag */}
    //             {minPrice && (
    //                 <WrapItem>
    //                     <Tag colorScheme="blue" borderRadius="full">
    //                         <TagLabel>Min: ${minPrice}</TagLabel>
    //                         <TagCloseButton onClick={() => removeParam("minPrice")} />
    //                     </Tag>
    //                 </WrapItem>
    //             )}

    //             {/* Max price tag */}
    //             {maxPrice && (
    //                 <WrapItem>
    //                     <Tag colorScheme="blue" borderRadius="full">
    //                         <TagLabel>Max: ${maxPrice}</TagLabel>
    //                         <TagCloseButton onClick={() => removeParam("maxPrice")} />
    //                     </Tag>
    //                 </WrapItem>
    //             )}

    //             {/* Max price tag */}
    //             {brand && (
    //                 <WrapItem>
    //                     <Tag colorScheme="blue" borderRadius="full">
    //                         <TagLabel>Brand: {brand}</TagLabel>
    //                         <TagCloseButton onClick={() => removeParam("brand")} />
    //                     </Tag>
    //                 </WrapItem>
    //             )}

    //         </Wrap>

    //         {/* Select pinned to the right */}
    //         <Box w={200} flexShrink={0}>
    //             <Select value={activeSort} onChange={(e) => handleSelect(e.target.value)}>
    //                 <option value="featured">Featured</option>
    //                 <option value="price asc">Price: Low to High</option>
    //                 <option value="price desc">Price: High to Low</option>
    //             </Select>
    //         </Box>

    //     </HStack>
    // );

    const hasActiveFilters = Boolean((sortBy && sortOrder) || categories.length || minPrice || maxPrice || brand);

    return (
        <HStack
            w="full"
            align="center"
            mb={5}
            pb={4}
            borderBottom="1px solid"
            borderColor="gray.100"
            spacing={4}
        >
            {/* All active filter tags on the left */}
            <Wrap flex={1} spacing={2} align="center">
 
                {!hasActiveFilters && (
                    <Text fontSize="sm" color="gray.400">
                        No filters applied
                    </Text>
                )}
 
                {/* Sort tag */}
                {sortBy && sortOrder && (
                    <WrapItem>
                        <Tag colorScheme="blue" borderRadius="full" size="md" py={1.5} px={3}>
                            <TagLabel fontWeight={500}>
                                {sortOrder === "ASC" ? "Price: Low to High" : "Price: High to Low"}
                            </TagLabel>
                            <TagCloseButton onClick={() => removeParam("sortBy", "sortOrder")} />
                        </Tag>
                    </WrapItem>
                )}
 
                {/* Category tag */}
                {categories && categories.map(cat =>
                    <WrapItem key={cat}>
                        <Tag colorScheme="purple" borderRadius="full" size="md" py={1.5} px={3}>
                            <TagLabel fontWeight={500}>{cat}</TagLabel>
                            <TagCloseButton onClick={() => removeParam("categories")} />
                        </Tag>
                    </WrapItem>
                )}
 
                {/* Min price tag */}
                {minPrice && (
                    <WrapItem>
                        <Tag colorScheme="green" borderRadius="full" size="md" py={1.5} px={3}>
                            <TagLabel fontWeight={500}>Min: €{minPrice}</TagLabel>
                            <TagCloseButton onClick={() => removeParam("minPrice")} />
                        </Tag>
                    </WrapItem>
                )}
 
                {/* Max price tag */}
                {maxPrice && (
                    <WrapItem>
                        <Tag colorScheme="green" borderRadius="full" size="md" py={1.5} px={3}>
                            <TagLabel fontWeight={500}>Max: €{maxPrice}</TagLabel>
                            <TagCloseButton onClick={() => removeParam("maxPrice")} />
                        </Tag>
                    </WrapItem>
                )}
 
                {/* Brand tag */}
                {brand && (
                    <WrapItem>
                        <Tag colorScheme="orange" borderRadius="full" size="md" py={1.5} px={3}>
                            <TagLabel fontWeight={500}>Brand: {brand}</TagLabel>
                            <TagCloseButton onClick={() => removeParam("brand")} />
                        </Tag>
                    </WrapItem>
                )}
 
            </Wrap>
 
            {/* Select pinned to the right */}
            <Box w={220} flexShrink={0}>
                <Select
                    value={activeSort}
                    onChange={(e) => handleSelect(e.target.value)}
                    size="sm"
                    borderRadius="md"
                    fontWeight={500}
                    bg="white"
                >
                    <option value="featured">Featured</option>
                    <option value="price asc">Price: Low to High</option>
                    <option value="price desc">Price: High to Low</option>
                </Select>
            </Box>
 
        </HStack>
    );
};

export default ProductSort;