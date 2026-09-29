import {
    Box,
    HStack,
    Spinner,
    VStack,
    Stack
} from "@chakra-ui/react";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import { useCartContext } from "../provider/CartProvider";
// import { useAuth } from "../provider/AuthProvider";

//todo custom hook fetch cart

const CartPage = () => {
    const {cart, isLoading} =  useCartContext();

    if (isLoading) return <Spinner></Spinner>

    if (!cart) return <Box>Loading...</Box>

    return (
        <HStack align="flex-start" spacing={6} p={6}>
            <VStack flex={1} align="stretch" spacing={3}>
            {cart?.items.map((item) => (
                <CartItem product={item} key={item.cartItemId} />
            ))}
            </VStack>
            <CartSummary cart={cart} key={cart?.id}/>
        </HStack>
    );
}

export default CartPage;