import {
    Box,
    Flex,
    Text,
    Button,
    Card,
    CardBody,
    Tooltip,
    useDisclosure,
} from "@chakra-ui/react";
import { useAuth } from "../../provider/AuthProvider";
import ChangePasswordModal from "./ChangePasswordModal";

const UserChangePassword = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user: User } = useAuth();

    const isGoogleAccount = !!User?.isGoogle;

    return (
        <>
            <Card borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
                <CardBody p={6}>
                    <Text fontSize="sm" fontWeight={700} textTransform="uppercase" letterSpacing="wide" color="gray.500" mb={4}>
                        Security
                    </Text>
                    <Flex justify="space-between" align="center">
                        <Box>
                            <Text fontSize="sm" fontWeight={500}>Password</Text>
                            {isGoogleAccount && (
                                <Text fontSize="xs" color="gray.400" mt={0.5}>
                                    Signed in with Google — no password to change here.
                                </Text>
                            )}
                        </Box>
                        <Tooltip
                            label="Your account uses Google Sign-In, so there's no password to manage."
                            isDisabled={!isGoogleAccount}
                        >
                            <Button
                                size="sm"
                                variant="outline"
                                colorScheme="blue"
                                borderRadius="full"
                                onClick={onOpen}
                                isDisabled={isGoogleAccount}
                            >
                                Change Password
                            </Button>
                        </Tooltip>
                    </Flex>
                </CardBody>
            </Card>

            <ChangePasswordModal isOpen={isOpen} onClose={onClose} />
        </>
    );
};

export default UserChangePassword;