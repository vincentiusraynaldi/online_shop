import {
    Card,
    CardBody,
    Text,
    Flex,
    Box,
    Button
} from "@chakra-ui/react"
import { useAuth } from "../../provider/AuthProvider";

const UserDeleteAccount = () => {
    const {
            user: User,
            actions: {
                deleteAccount
            }
        } = useAuth();

    return(
        <Card borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="red.100">
            <CardBody p={6}>
                <Text fontSize="sm" fontWeight={700} textTransform="uppercase" letterSpacing="wide" color="red.500" mb={4}>
                    Danger Zone
                </Text>
                <Flex justify="space-between" align="center">
                    <Box>
                        <Text fontSize="sm" fontWeight={500}>Delete account</Text>
                        <Text fontSize="xs" color="gray.400">This action is permanent and cannot be undone.</Text>
                    </Box>
                    <Button size="sm" variant="outline" colorScheme="red" borderRadius="full" onClick={deleteAccount}>
                        Delete Account
                    </Button>
                </Flex>
            </CardBody>
        </Card>
)
    
}

export default UserDeleteAccount;