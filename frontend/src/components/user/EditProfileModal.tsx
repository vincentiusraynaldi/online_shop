import { useEffect, useState } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Button,
    VStack,
    Alert,
    AlertIcon,
} from "@chakra-ui/react";
import { useAuth } from "../../provider/AuthProvider";

type EditProfileModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const EditProfileModal = ({ isOpen, onClose }: EditProfileModalProps) => {
    const {
        user: User,
        actions: { editProfile },
    } = useAuth();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [errors, setErrors] = useState<{ firstName?: string; lastName?: string }>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // pre-fill whenever the modal opens with current values
    useEffect(() => {
        if (isOpen && User) {
            setFirstName(User.firstName ?? "");
            setLastName(User.lastName ?? "");
            setErrors({});
            setFormError(null);
        }
    }, [isOpen, User]);

    const validate = () => {
        const nextErrors: typeof errors = {};
        if (!firstName.trim()) nextErrors.firstName = "First name is required";
        if (!lastName.trim()) nextErrors.lastName = "Last name is required";
        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setFormError(null);
        setIsSubmitting(true);
        try {
            const result = await editProfile({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: User?.email ?? "",
            });
            if (result.success) {
                onClose();
            } else {
                setFormError(result.message);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
            <ModalOverlay />
            <ModalContent borderRadius="xl">
                <ModalHeader>Edit Profile</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4} align="stretch">
                        {formError && (
                            <Alert status="error" borderRadius="md" fontSize="sm">
                                <AlertIcon />
                                {formError}
                            </Alert>
                        )}
                        <FormControl isInvalid={!!errors.firstName}>
                            <FormLabel fontSize="sm">First Name</FormLabel>
                            <Input
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="First name"
                            />
                            <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.lastName}>
                            <FormLabel fontSize="sm">Last Name</FormLabel>
                            <Input
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Last name"
                            />
                            <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                        </FormControl>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose} isDisabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        colorScheme="blue"
                        borderRadius="full"
                        onClick={handleSubmit}
                        isLoading={isSubmitting}
                    >
                        Save Changes
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditProfileModal;