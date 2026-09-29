import { 
    Box,
    Card,
    Divider,
    HStack,
    VStack,
    Text,
    Image,
    Badge,
    Icon,
    Spinner
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useOrder } from "../../hooks/useOrder";
import { useSearchParams } from "react-router-dom";

const OrderDetail = () => {
    const {id} = useParams<{id : string}>();
    const [searchParams] = useSearchParams();
    const isConfirmation = searchParams.get("confirmed") === "true";
    const { order, isLoading, fetchOrderById } = useOrder();
    const itemCount = order?.items.reduce((sum: number, item: any) => sum + item.quantity, 0);

    useEffect(()=>{
        if (id){
            fetchOrderById(id)
            console.log(order)
        }
    }, [id])

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" p={12}>
                <Spinner size="xl" />
            </Box>
        );
    }

    if(!order){
        return <Box p={6}>Order not found.</Box>;
    }

    return (
        <VStack maxW="640px" mx="auto" p={6} spacing={6} align="stretch">
            {isConfirmation ? (
                <VStack spacing={2} py={4}>
                    <Icon as={CheckCircleIcon} boxSize={12} color="green.400" />
                    <Text fontSize="2xl" fontWeight="600">Order placed!</Text>
                </VStack>
            ) : (
                <Text fontSize="xl" fontWeight="600">Order #{order.id.slice(0, 8)}</Text>
            )}

            
            {/* Items */}
            <Card p={5}>
                <Text fontWeight="500" mb={4}>
                    Items ({itemCount})
                </Text>
                <VStack align="stretch" spacing={3}>
                    {order.items.map((orderItem: any) => (
                        <HStack key={orderItem.id} justify="space-between" align="center">
                            <HStack spacing={3}>
                                <Box
                                    w="56px"
                                    h="56px"
                                    borderRadius="md"
                                    bg="gray.100"
                                    overflow="hidden"
                                    flexShrink={0}
                                >
                                    {orderItem.item.imageUrl && (
                                        <Image
                                            src={orderItem.item.imageUrl}
                                            alt={orderItem.item.itemName}
                                            w="100%"
                                            h="100%"
                                            objectFit="cover"
                                        />
                                    )}
                                </Box>
                                <VStack align="flex-start" spacing={0}>
                                    <Text fontSize="sm" fontWeight="500">
                                        {orderItem.item.itemName}
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                        Qty {orderItem.quantity}
                                    </Text>
                                </VStack>
                            </HStack>
                            <Text fontSize="sm">
                                {(Number(orderItem.item.itemPrice) * Number(orderItem.quantity)).toFixed(2)} €
                            </Text>
                        </HStack>
                    ))}
                </VStack>

                <Divider my={4} />

                <HStack justify="space-between">
                    <Text fontWeight="500">Total</Text>
                    <Text fontWeight="500" fontSize="lg">
                        {Number(order.totalPrice).toFixed(2)} €
                    </Text>
                </HStack>
            </Card>

            {/* Delivery address */}
            <Card p={5}>
                <Text fontWeight="500" mb={3}>Delivery address</Text>
                <VStack align="stretch" spacing={1}>
                    <Text fontSize="sm">{order.address.fullName}</Text>
                    <Text fontSize="sm" color="gray.600">
                        {order.address.street} {order.address.houseNumber}, {order.address.city}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                        {order.address.postalCode}, {order.address.country}
                    </Text>
                </VStack>
            </Card>

            {/* Order status */}
            <Card p={5}>
                <VStack align="stretch" spacing={3}>
                    <HStack justify="space-between">
                        <Text fontWeight="500">Order status</Text>
                        <Badge
                            colorScheme={
                                order.orderStatus === "delivered" ? "green" :
                                order.orderStatus === "shipped" ? "blue" :
                                order.orderStatus === "processing" ? "orange" :
                                "yellow"
                            }
                            textTransform="capitalize"
                        >
                            {order.orderStatus}
                        </Badge>
                    </HStack>
                    <HStack justify="space-between">
                        <Text fontSize="sm" color="gray.500">Payment method</Text>
                        <Text fontSize="sm" textTransform="capitalize">{order.paymentMethod}</Text>
                    </HStack>
                </VStack>
            </Card>
        </VStack>
    );
};

export default OrderDetail;