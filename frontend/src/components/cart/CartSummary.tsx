import { Box, Button, Card, Divider, HStack, Text, VStack, useToast } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useCartContext } from "../../provider/CartProvider";

const CartSummary = ({ cart, isCart = false, selectedAddressId }: any) => {
  const {checkout} = useCartContext();
  const navigate = useNavigate();
  const toast = useToast();
  if (!cart) return null;

  const subtotal = cart.items.reduce(
    (sum: number, item: any) => sum + item.item.itemPrice * item.quantity,
    0
  );
  const itemCount = cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);

  const handleBuyNow = async () => {
    if(!selectedAddressId){
           toast({
            title: "Address required",
            description: "Please select a delivery address before checking out.",
            status: "warning",
            duration: 4000,
            isClosable: true,
        });
        return;
    }

    const orderId = await checkout(selectedAddressId)
    if (orderId) {
        navigate(`/users/orders/${orderId}?confirmed=true`);
        toast({
            title: "Order placed!",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    } else {
      toast({
            title: "Checkout failed",
            description: "Something went wrong, please try again.",
            status: "error",
            duration: 4000,
            isClosable: true,
        });
    }
  }

  return (
    <Card p={6} w="320px" position="sticky" top={4}>
      <VStack align="stretch" spacing={4}>

        <Text fontSize="lg" fontWeight="500">
          Order summary
        </Text>

        <Divider />

        <VStack align="stretch" spacing={2}>
          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.500">
              Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
            </Text>
            <Text fontSize="sm">{subtotal.toFixed(2)} €</Text>
          </HStack>

          {/* <HStack justify="space-between">
            <Text fontSize="sm" color="gray.500">Shipping</Text>
            <Text fontSize="sm">{shipping.toFixed(2)} €</Text>
          </HStack> */}
        </VStack>

        <Divider />

        <HStack justify="space-between">
          <Text fontWeight="500">Total</Text>
          <Text fontWeight="500" fontSize="xl">{subtotal.toFixed(2)} €</Text>
        </HStack>

        {!isCart ? 
        <Link to={`/users/checkout`}>
          <Button colorScheme="blue" size="md" w="100%" borderRadius="md">
            Proceed to checkout
          </Button>
        </Link>

        :
        <VStack >
          <Link to={`/users/cart`} style={{width : "100%"}}>
            <Button colorScheme="blue" size="md" w="100%" borderRadius="md" variant={"outline"}>
              Back to Cart
            </Button>
          </Link>
          <Button colorScheme="blue" size="md" w="100%" borderRadius="md" onClick={handleBuyNow}>
            Buy now
          </Button>
        </VStack>
        }

        {/* <Text fontSize="xs" color="gray.400" textAlign="center">
          Taxes calculated at checkout
        </Text> */}

      </VStack>
    </Card>
  );
};

export default CartSummary;