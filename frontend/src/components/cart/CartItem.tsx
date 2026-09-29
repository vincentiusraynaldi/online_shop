import {
  Box,
  Card,
  HStack,
  VStack,
  Text,
  IconButton,
  Image,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
// import { useCart } from "../../hooks/useCart";
import { useCartContext } from "../../provider/CartProvider";

const CartItem = ({ product, readOnly = false }: any) => {
  const unitPrice = product.item.itemPrice;
  const totalPrice = (unitPrice * product.quantity).toFixed(2);
  const {addItem, removeItem, fetchCart} = useCartContext();

  const increment = async () => {
    await addItem(product.item.id, "1");
    // await fetchCart();
  };

  const decrement = async () => {
    // if (product.quantity <= 1) return;
    await removeItem(product.item.id, "1");
    // await fetchCart();
  }

  const deleteItem =  async () => {
    await removeItem(product.item.id, String(product.quantity));
    // await fetchCart();
  }


  return (
    <Card p={5} mb={3}>
      <HStack align="flex-start" spacing={4}>

        {/* Image */}
        <Box
          w="96px"
          h="96px"
          borderRadius="md"
          bg="gray.100"
          border="1px solid"
          borderColor="gray.200"
          flexShrink={0}
          overflow="hidden"
        >
          {product.item.imageUrl ? (
            <Image
              src={product.item.imageUrl}
              alt={product.item.itemName}
              w="100%"
              h="100%"
              objectFit="cover"
            />
          ) : (
            <Box w="100%" h="100%" display="flex" alignItems="center" justifyContent="center">
              <Text fontSize="xs" color="gray.400">No image</Text>
            </Box>
          )}
        </Box>

        {/* Content */}
        <VStack align="stretch" flex={1} spacing={2}>

          {/* Name + delete */}
          <HStack justify="space-between" align="flex-start">
            <Text fontWeight="500" fontSize="md" lineHeight="short">
              {product.item.itemName}
            </Text>
            {!readOnly && <IconButton
              aria-label="Remove item"
              icon={<DeleteIcon />}
              size="sm"
              variant="ghost"
              colorScheme="gray"
              onClick={deleteItem}
            />}
          </HStack>

          {/* Quantity + Price */}
          <HStack justify="space-between" align="center" mt={2}>

            {/* Stepper */}
            <HStack
              spacing={0}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              overflow="hidden"
            >
              {!readOnly && <Box
                as="button"
                w="32px"
                h="32px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="lg"
                color="gray.500"
                _hover={{ bg: "gray.100" }}
                onClick={decrement}
              >
                −
              </Box>}
              <Box
                w="32px"
                h="32px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="sm"
                fontWeight="500"
                borderLeft="1px solid"
                borderRight="1px solid"
                borderColor="gray.200"
              >
                {product.quantity}
              </Box>
              {!readOnly && <Box
                as="button"
                w="32px"
                h="32px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="lg"
                color="gray.500"
                _hover={{ bg: "gray.100" }}
                onClick={increment}
              >
                +
              </Box>}
            </HStack>

            {/* Price */}
            <VStack align="flex-end" spacing={0}>
              <Text fontSize="lg" fontWeight="500">
                {totalPrice} €
              </Text>
              {product.quantity > 1 && (
                <Text fontSize="xs" color="gray.400">
                  {unitPrice.toFixed(2)} € each
                </Text>
              )}
            </VStack>
          </HStack>
        </VStack>
      </HStack>
    </Card>
  );
};

export default CartItem;