import { useParams } from "react-router-dom";
import OrderDetail from "../components/order/OrderDetail";
import { useOrder } from "../hooks/useOrder";
import { Box, Spinner } from "@chakra-ui/react";
import { useEffect } from "react";


const OrderConfirmatinPage = () => {
    const {id} = useParams<{id : string}>();
    const { order, isLoading, fetchOrderById } = useOrder();

    useEffect(()=>{
        if (id){
            fetchOrderById(id)
        }
    }, [])

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
        <>
            <OrderDetail></OrderDetail>
        </>
    )
}

export default OrderConfirmatinPage;