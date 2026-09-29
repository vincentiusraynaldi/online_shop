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
import ChangeEmailModal from "./ChangeEmailModal";

const UserChangeEmail = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user: User } = useAuth();

    const isGoogleAccount = !!User?.isGoogle;

    return (
        <>
            <Card borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
                <CardBody p={6}>
                    <Text fontSize="sm" fontWeight={700} textTransform="uppercase" letterSpacing="wide" color="gray.500" mb={4}>
                        Email Address
                    </Text>
                    <Flex justify="space-between" align="center">
                        <Box>
                            <Text fontSize="sm" fontWeight={500}>{User?.email ?? "—"}</Text>
                            {isGoogleAccount && (
                                <Text fontSize="xs" color="gray.400" mt={0.5}>
                                    Managed by your Google account.
                                </Text>
                            )}
                        </Box>
                        <Tooltip
                            label="Your email is managed by Google Sign-In and can't be changed here."
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
                                Change Email
                            </Button>
                        </Tooltip>
                    </Flex>
                </CardBody>
            </Card>

            <ChangeEmailModal isOpen={isOpen} onClose={onClose} />
        </>
    );
};

export default UserChangeEmail;