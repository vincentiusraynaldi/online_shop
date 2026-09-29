// try to replicate tokopedia product page
// todo make that the user can add not just 1 quantity of item
// add multiple like 2 or 3 or more 

//todo fetch the product using the id then pass it to the component

import { 
    Box, 
    Button, 
    HStack, 
    Flex, 
    Text, 
    Card,
    CardBody,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberDecrementStepper,
    NumberIncrementStepper,
    VStack,
    Heading,
    Divider,
    Badge,
    AspectRatio,
    Image,
    SimpleGrid,
    Stack
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useProductDetail } from "../hooks/useProductDetail";
import { useState } from "react";
import { useCart } from "../hooks/useCart";

const ProductDetailPage = () => {
    const {id} = useParams();
    // const {product: Product, isLoading, error} = useProductDetail(id as string);
    const {product} = useProductDetail(id as string);
    const {addItem} = useCart();

    const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);

    const changeQuantity = async (value: string) => {
        // console.log("masuk quantity")
        setQuantity(Number(value));
        console.log("quantity ", quantity);
        setTotalPrice(Number(quantity) * Number(product?.itemPrice));
        console.log("totalprice ", totalPrice);
    }   

    const AddToCartButton = async () => {
        console.log("add cart button")
        if(product?.id) addItem(product.id, String(quantity));
    }

    // return (
    //     <Box  maxW="1400px" mx="auto" px={4} py={6}>
    //         <HStack>
    //             <Box>
    //                 <Text>
    //                     {product?.itemName}
    //                 </Text>
    //                 <Text>
    //                     Description: {product?.itemDescription}
    //                 </Text>
    //                 <Text>
    //                     Price: {product?.itemPrice}
    //                 </Text>
    //                 <Text>
    //                     Weight: {product?.itemWeight}
    //                 </Text>
    //                 <Text>
    //                     Brand: {product?.itemBrand}
    //                 </Text>
    //             </Box>
    //             <Card>
    //                 <Flex
    //                 direction={{ base: 'column', md: 'row' }}
    //                 align="flex-start"
    //                 >
    //                     <VStack>
    //                         <NumberInput defaultValue={1} min={1} max={product?.availableStock} onChange={changeQuantity}>
    //                             <NumberInputField />
    //                             <NumberInputStepper>
    //                                 <NumberIncrementStepper />
    //                                 <NumberDecrementStepper />
    //                             </NumberInputStepper>
    //                         </NumberInput>
    //                         <Text>Subtotal : {totalPrice.toFixed(2)}</Text>
    //                         <HStack spacing={100}>
    //                             <Button colorScheme="blue" onClick={AddToCartButton}>Add to Cart</Button>
    //                             <Button colorScheme="blue">Buy Now</Button>
    //                         </HStack>
    //                     </VStack>
    //                 </Flex>
    //             </Card>
    //         </HStack>
    //     </Box>
    // );

    return (
        <Box maxW="1400px" mx="auto" px={4} py={8}>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 8, lg: 12 }}>
 
                {/* Left: Image */}
                <Box>
                    <AspectRatio ratio={1} borderRadius="xl" overflow="hidden" bg="gray.50">
                        <Image
                            src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
                            alt={product?.itemName ?? "Product image"}
                            objectFit="cover"
                        />
                    </AspectRatio>
                </Box>
 
                {/* Right: Info + purchase */}
                <VStack align="stretch" spacing={5}>
                    <Box>
                        {product?.itemBrand && (
                            <Text fontSize="sm" fontWeight={600} color="blue.600" mb={1}>
                                {product.itemBrand}
                            </Text>
                        )}
                        <Heading size="lg" fontWeight={700} letterSpacing="-0.02em">
                            {product?.itemName ?? "—"}
                        </Heading>
                    </Box>
 
                    <Text fontSize="3xl" fontWeight={800} color="gray.800">
                        {product?.itemPrice ? `€${product.itemPrice}` : "—"}
                    </Text>
 
                    <HStack spacing={3}>
                        {product?.itemWeight && (
                            <Badge borderRadius="full" px={3} py={1} colorScheme="gray" fontWeight={500}>
                                {product.itemWeight}
                            </Badge>
                        )}
                        {typeof product?.availableStock === "number" && (
                            <Badge
                                borderRadius="full"
                                px={3}
                                py={1}
                                colorScheme={product.availableStock > 0 ? "green" : "red"}
                                fontWeight={500}
                            >
                                {product.availableStock > 0 ? `${product.availableStock} in stock` : "Out of stock"}
                            </Badge>
                        )}
                    </HStack>
 
                    <Divider />
 
                    <Box>
                        <Text fontSize="sm" fontWeight={700} textTransform="uppercase" letterSpacing="wide" color="gray.500" mb={2}>
                            Description
                        </Text>
                        <Text fontSize="sm" color="gray.600" lineHeight="tall">
                            {product?.itemDescription ?? "No description available."}
                        </Text>
                    </Box>
 
                    <Divider />
 
                    {/* Purchase card */}
                    <Card borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
                        <CardBody p={5}>
                            <Stack spacing={4}>
                                <Flex align="center" justify="space-between">
                                    <Text fontSize="sm" fontWeight={600} color="gray.700">
                                        Quantity
                                    </Text>
                                    <NumberInput
                                        defaultValue={1}
                                        min={1}
                                        max={product?.availableStock}
                                        onChange={changeQuantity}
                                        size="sm"
                                        maxW="120px"
                                    >
                                        <NumberInputField borderRadius="md" />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </Flex>
 
                                <Flex align="center" justify="space-between">
                                    <Text fontSize="sm" fontWeight={600} color="gray.700">
                                        Subtotal
                                    </Text>
                                    <Text fontSize="xl" fontWeight={700} color="blue.600">
                                        €{totalPrice.toFixed(2)}
                                    </Text>
                                </Flex>
 
                                <HStack spacing={3} pt={1}>
                                    <Button
                                        colorScheme="blue"
                                        variant="outline"
                                        flex={1}
                                        borderRadius="md"
                                        onClick={AddToCartButton}
                                    >
                                        Add to Cart
                                    </Button>
                                    <Button
                                        colorScheme="blue"
                                        flex={1}
                                        borderRadius="md"
                                    >
                                        Buy Now
                                    </Button>
                                </HStack>
                            </Stack>
                        </CardBody>
                    </Card>
                </VStack>
            </SimpleGrid>
        </Box>
    );
}

export default ProductDetailPage;