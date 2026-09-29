import { Box, VStack, Text, Spinner } from "@chakra-ui/react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useOrder } from "../hooks/useOrder";
import OrderListItem from "../components/order/OrderListItem";

const OrderListPage = () => {
    const { orders, isLoading, fetchOrders } = useOrder();

    useEffect(() => {
        fetchOrders();
    }, []);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" p={12}>
                <Spinner size="xl" />
            </Box>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <VStack p={12} spacing={3}>
                <Text color="gray.500">You haven't placed any orders yet.</Text>
                <Link to="/">
                    <Text color="blue.500" fontSize="sm">Start shopping</Text>
                </Link>
            </VStack>
        );
    }

    return (
        <VStack maxW="640px" mx="auto" p={6} spacing={4} align="stretch">
            <Text fontSize="xl" fontWeight="600">Your orders</Text>

            {orders.map((order) => (
                <OrderListItem order={order} key={order.id} />
            ))}
        </VStack>
    );
};

export default OrderListPage;