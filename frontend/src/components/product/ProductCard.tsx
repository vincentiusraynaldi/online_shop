//content: title of the product, image of the product, price(figure out when there is discount price tag and the discount percentage)
//add to cart button
//when being clicked (the item) anywhere except the add to cart button, it will redirect it to the detailed version(product detail)

import { 
    Card, 
    CardBody, 
    CardFooter, 
    Button, 
    Text, 
    Image, 
    Stack, 
    Heading, 
    Flex,
    AspectRatio
} from '@chakra-ui/react'
import { useCart } from '../../hooks/useCart';
import React from 'react';

const ProductCard = ({product} : any) => {
    const {addItem} = useCart();

    const AddToCartButton = async (e : React.MouseEvent) => {
        e.preventDefault();  // stops the Link navigation
        e.stopPropagation(); // stops the click from bubbling up
        console.log("add cart button")
        if(product.id) addItem(product.id, "1");
    }

    // return(
    //     <Card w="full">
    //         <CardBody>
    //             <Image
    //             src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
    //             alt='Green double couch with wooden legs'
    //             borderRadius='lg'
    //             />
    //             <Stack mt='6' spacing='3'>
    //             <Heading size='md'>{product.itemName}</Heading>
    //             {/* <Text>
    //                 {product.itemDescription}
    //             </Text> */}
    //             <Text color='blue.600' fontSize='2xl'>
    //                 {product.itemPrice} Euro
    //             </Text>
    //             </Stack>
    //         </CardBody>
    //         {/* <Divider /> */}
    //         <CardFooter>
    //             <Flex gap='2' w="full" wrap="wrap">
    //                 <Button variant='solid' colorScheme='blue'>
    //                     Buy now
    //                 </Button>
    //                 <Button variant='ghost' colorScheme='blue' onClick={AddToCartButton}>
    //                     Add to cart
    //                 </Button>
    //             </Flex>
    //         </CardFooter>
    //     </Card>
    // );


    return(
        <Card
            w="full"
            h="full"
            borderRadius="xl"
            overflow="hidden"
            border="1px solid"
            borderColor="gray.100"
            boxShadow="sm"
            transition="all 0.15s ease"
            _hover={{ boxShadow: "md", transform: "translateY(-2px)", borderColor: "gray.200" }}
        >
            <CardBody p={0}>
                <AspectRatio ratio={1}>
                    <Image
                    src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
                    alt='Green double couch with wooden legs'
                    objectFit="cover"
                    />
                </AspectRatio>
                <Stack p={4} spacing={1}>
                    <Heading
                        size='sm'
                        fontWeight={600}
                        noOfLines={2}
                        color="gray.800"
                    >
                        {product.itemName}
                    </Heading>
                    {/* <Text>
                        {product.itemDescription}
                    </Text> */}
                    <Text color='blue.600' fontSize='xl' fontWeight={700} mt={1}>
                        {product.itemPrice} €
                    </Text>
                </Stack>
            </CardBody>
            {/* <Divider /> */}
            <CardFooter pt={0} pb={4} px={4}>
                <Flex gap={2} w="full">
                    <Button
                        variant='solid'
                        colorScheme='blue'
                        size="sm"
                        flex={1}
                        borderRadius="md"
                    >
                        Buy now
                    </Button>
                    <Button
                        variant='outline'
                        colorScheme='blue'
                        size="sm"
                        flex={1}
                        borderRadius="md"
                        onClick={AddToCartButton}
                    >
                        Add to cart
                    </Button>
                </Flex>
            </CardFooter>
        </Card>
    );
};

export default ProductCard;