import {
    Box
} from "@chakra-ui/react";
import Item from "../components/cart/item";
import Summary from "../components/cart/summary";
import { useCart } from "../hooks/useCart";
// import { useAuth } from "../provider/AuthProvider";

//todo custom hook fetch cart

const CartPage = () => {
    // const {user: User} = useAuth();
    const {cart} =  useCart();

    console.log("cart: ", cart);

    //todo
    return(
        <Box>
            <Item/>
            <Summary/>
        </Box>
    )
}

export default CartPage;