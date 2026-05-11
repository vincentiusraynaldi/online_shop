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
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberDecrementStepper,
    NumberIncrementStepper,
    VStack
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

    return (
        <Box  maxW="1400px" mx="auto" px={4} py={6}>
            <HStack>
                <Box>
                    <Text>
                        {product?.itemName}
                    </Text>
                    <Text>
                        Description: {product?.itemDescription}
                    </Text>
                    <Text>
                        Price: {product?.itemPrice}
                    </Text>
                    <Text>
                        Weight: {product?.itemWeight}
                    </Text>
                    <Text>
                        Brand: {product?.itemBrand}
                    </Text>
                </Box>
                <Card>
                    <Flex
                    direction={{ base: 'column', md: 'row' }}
                    align="flex-start"
                    >
                        <VStack>
                            <NumberInput defaultValue={1} min={1} max={product?.availableStock} onChange={changeQuantity}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            <Text>Subtotal : {totalPrice.toFixed(2)}</Text>
                            <HStack spacing={100}>
                                <Button colorScheme="blue" onClick={AddToCartButton}>Add to Cart</Button>
                                <Button colorScheme="blue">Buy Now</Button>
                            </HStack>
                        </VStack>
                    </Flex>
                </Card>
            </HStack>
        </Box>
    );
}

export default ProductDetailPage;