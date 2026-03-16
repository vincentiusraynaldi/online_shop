//content: title of the product, image of the product, price(figure out when there is discount price tag and the discount percentage)
//add to cart button
//when being clicked (the item) anywhere except the add to cart button, it will redirect it to the detailed version(product detail)

import { 
    Card, 
    CardHeader, 
    CardBody, 
    CardFooter, 
    Button, 
    Text, 
    Image, 
    Stack, 
    Heading, 
    Divider, 
    ButtonGroup, 
    Flex
} from '@chakra-ui/react'

const ProductCard = ({product} : any) => {
    // console.log("card masuk")
    // console.log("product", product);
    // console.log("product name", product.itemName);
    // console.log("product description", product.itemDescription);
    // console.log("product price", product.itemPrice);

    return(
        <Card w="full">
            <CardBody>
                <Image
                src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
                alt='Green double couch with wooden legs'
                borderRadius='lg'
                />
                <Stack mt='6' spacing='3'>
                <Heading size='md'>{product.itemName}</Heading>
                {/* <Text>
                    {product.itemDescription}
                </Text> */}
                <Text color='blue.600' fontSize='2xl'>
                    {product.itemPrice} Euro
                </Text>
                </Stack>
            </CardBody>
            {/* <Divider /> */}
            <CardFooter>
                <Flex gap='2' w="full" wrap="wrap">
                    <Button variant='solid' colorScheme='blue'>
                        Buy now
                    </Button>
                    <Button variant='ghost' colorScheme='blue'>
                        Add to cart
                    </Button>
                </Flex>
            </CardFooter>
        </Card>
    );
};

export default ProductCard;