//consists of product cards
import { SimpleGrid, Box } from "@chakra-ui/react";
import ProductCard from "./ProductCard";
import { mockProducts } from "../../models/Products";
import { Product } from "../../entity/Product";
import { Link } from "react-router-dom";


interface ProductGridProps {
    products: Product[]
}

const ProductGrid = ({products} : ProductGridProps ) => {
// const ProductGrid = () => {

    // return (
    //     // <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6} maxWidth="6xl">
    //     <SimpleGrid
    //     minChildWidth="220px"
    //     columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
    //     spacing={6}
    //     // maxW="6xl"
    //     // w="full"
    //     mx="auto"
    //     // px={{ base: 4, md: 6 }}
    //     >
    //         {/* {mockProducts.map((mockProduct) => (
    //             <ProductCard key={mockProduct.id} product={mockProduct} />
    //         ))} */}
    //         {products.map((product) => (
    //             // <ProductCard 
    //             // key={product.id} 
    //             // product={product} 
    //             // />
    //             <Link key={product.id} to={`/productpage/${product.id}`}>
    //                 <ProductCard product={product} />
    //             </Link>
    //         ))}
    //     </SimpleGrid>
    // )

    return (
        // <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6} maxWidth="6xl">
        <SimpleGrid
        templateColumns="repeat(auto-fill, minmax(220px, 220px))"
        columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
        spacing={{ base: 4, md: 6 }}
        // maxW="6xl"
        w="full"
        mx="auto"
        justifyContent="start"
        // px={{ base: 4, md: 6 }}
        >
            {/* {mockProducts.map((mockProduct) => (
                <ProductCard key={mockProduct.id} product={mockProduct} />
            ))} */}
            {products.map((product) => (
                // <ProductCard 
                // key={product.id} 
                // product={product} 
                // />
                <Box
                    key={product.id}
                    as={Link}
                    to={`/productpage/${product.id}`}
                    display="block"
                    h="full"
                    _hover={{ textDecoration: "none" }}
                >
                    <ProductCard product={product} />
                </Box>
            ))}
        </SimpleGrid>
    )
}

export default ProductGrid;