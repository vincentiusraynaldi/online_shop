//consists of product cards
import { SimpleGrid } from "@chakra-ui/react";
import ProductCard from "./ProductCard";
import { mockProducts } from "../../models/Products";

const ProductGrid = () => {
    // console.log("grid masuk");
    // console.log(mockProducts[0]);

    return (
        // <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6} maxWidth="6xl">
        <SimpleGrid
        minChildWidth="220px"
        columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
        spacing={6}
        // maxW="6xl"
        // w="full"
        mx="auto"
        // px={{ base: 4, md: 6 }}
        >
            {mockProducts.map((mockProduct) => (
                <ProductCard key={mockProduct.id} product={mockProduct} />
            ))}
        </SimpleGrid>
    )
}

export default ProductGrid;