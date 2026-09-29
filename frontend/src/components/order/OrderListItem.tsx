import { Card, HStack, VStack, Text, Badge } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Order } from "../../entity/Order";

const statusColor = (status: string) => {
    switch (status) {
        case "delivered": return "green";
        case "shipped": return "blue";
        case "processing": return "orange";
        default: return "yellow";
    }
};

interface OrderListItemProps {
    order: Order;
}

const OrderListItem = ({ order }: OrderListItemProps) => {
    const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <Link to={`/users/orders/${order.id}`}>
            <Card p={5} _hover={{ borderColor: "blue.300" }} borderWidth={1} borderColor="gray.200">
                <HStack justify="space-between" align="flex-start">
                    <VStack align="flex-start" spacing={1}>
                        <Text fontWeight="500">Order #{order.id.slice(0, 8)}</Text>
                        {order.createdAt && (
                            <Text fontSize="sm" color="gray.500">
                                {new Date(order.createdAt).toLocaleDateString()}
                            </Text>
                        )}
                        <Text fontSize="sm" color="gray.500">
                            {itemCount} {itemCount === 1 ? "item" : "items"}
                        </Text>
                    </VStack>

                    <VStack align="flex-end" spacing={1}>
                        <Badge colorScheme={statusColor(order.orderStatus)} textTransform="capitalize">
                            {order.orderStatus}
                        </Badge>
                        <Text fontWeight="500">
                            {Number(order.totalPrice).toFixed(2)} €
                        </Text>
                    </VStack>
                </HStack>
            </Card>
        </Link>
    );
};

export default OrderListItem;