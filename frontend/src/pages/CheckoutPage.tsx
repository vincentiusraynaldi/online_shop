import {
    Box,
    HStack,
    Spinner,
    VStack
} from "@chakra-ui/react";
import { useCartContext } from "../provider/CartProvider";
import { useState } from "react";
import { Address } from "../entity/Address";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import AddressModal from "../components/address/AddressModal";

const CheckoutPage = () => {
    const {cart, isLoading} = useCartContext();
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

    if (isLoading) return <Spinner></Spinner>

    if (!cart) return <Box>Loading...</Box>

    return (
        <HStack align="flex-start" spacing={6} p={6}>
            <VStack flex={1} align="stretch" spacing={3}>
            {cart?.items.map((item) => (
                <CartItem product={item} key={item.cartItemId}  readOnly ={true}/>
            ))}
            </VStack>
            <VStack>
                <AddressModal
                    selectedAddressId={selectedAddress?.id ?? null}
                    onSelectAddress={setSelectedAddress}
                />
                <CartSummary cart={cart} key={cart?.id} isCart={true} selectedAddressId={selectedAddress?.id ?? null}/>
            </VStack>
        </HStack>
    );
}

export default CheckoutPage;