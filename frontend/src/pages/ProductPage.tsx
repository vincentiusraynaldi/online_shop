//this is the main product page where all of the components of products combined
import ProductFilter from "../components/product/ProductFilter";
import ProductGrid from "../components/product/ProductGrid";
import { useProduct } from "../hooks/useProducts";
import { Box, Flex } from "@chakra-ui/react";

const ProductPage = () => {
    //get data from the hook useproducts
    // const {products, loading} = useProduct();
    return (
        <Box maxW="1400px" mx="auto" px={4} py={6}>
            <Flex
                direction={{ base: 'column', md: 'row' }}
                align="flex-start"
                gap={6}
            >
                <Box
                    as="aside"
                    w={{ base: '100%', md: '250px' }}
                    flexShrink={0}
                >
                    <ProductFilter />
                </Box>
                
                <Box as="main" flex="1" w="100%">
                    <ProductGrid />
                </Box>
            </Flex>
        </Box>
    )
}

export default ProductPage;