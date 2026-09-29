import { useState } from "react";
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
    FormHelperText,
    Input,
    Button,
    VStack,
    Alert,
    AlertIcon,
    Text,
} from "@chakra-ui/react";
import { useAuth } from "../../provider/AuthProvider";

type ChangeEmailModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

type FormState = {
    newEmail: string;
    currentPassword: string;
};

const initialForm: FormState = {
    newEmail: "",
    currentPassword: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ChangeEmailModal = ({ isOpen, onClose }: ChangeEmailModalProps) => {
    const {
        user: User,
        actions: { changeEmail },
    } = useAuth();

    const [form, setForm] = useState<FormState>(initialForm);
    const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const reset = () => {
        setForm(initialForm);
        setErrors({});
        setFormError(null);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const update = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const validate = () => {
        const nextErrors: typeof errors = {};

        if (!form.newEmail.trim()) nextErrors.newEmail = "New email is required";
        else if (!EMAIL_REGEX.test(form.newEmail.trim())) nextErrors.newEmail = "Enter a valid email address";
        else if (form.newEmail.trim().toLowerCase() === User?.email?.toLowerCase()) {
            nextErrors.newEmail = "This is already your current email";
        }

        if (!form.currentPassword) nextErrors.currentPassword = "Password is required to confirm this change";

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setFormError(null);
        setIsSubmitting(true);
        try {
            const result = await changeEmail(form);
            if (result.success) {
                handleClose();
            } else {
                setFormError(result.message);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} isCentered size="md">
            <ModalOverlay />
            <ModalContent borderRadius="xl">
                <ModalHeader>Change Email</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4} align="stretch">
                        <Text fontSize="sm" color="gray.500">
                            Current email: <Text as="span" fontWeight={600}>{User?.email}</Text>
                        </Text>

                        {formError && (
                            <Alert status="error" borderRadius="md" fontSize="sm">
                                <AlertIcon />
                                {formError}
                            </Alert>
                        )}

                        <FormControl isInvalid={!!errors.newEmail}>
                            <FormLabel fontSize="sm">New Email</FormLabel>
                            <Input
                                type="email"
                                value={form.newEmail}
                                onChange={update("newEmail")}
                                placeholder="you@example.com"
                                autoComplete="email"
                            />
                            <FormErrorMessage>{errors.newEmail}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.currentPassword}>
                            <FormLabel fontSize="sm">Current Password</FormLabel>
                            <Input
                                type="password"
                                value={form.currentPassword}
                                onChange={update("currentPassword")}
                                autoComplete="current-password"
                            />
                            <FormHelperText fontSize="xs">
                                We ask for your password to confirm it's really you.
                            </FormHelperText>
                            <FormErrorMessage>{errors.currentPassword}</FormErrorMessage>
                        </FormControl>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={handleClose} isDisabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        colorScheme="blue"
                        borderRadius="full"
                        onClick={handleSubmit}
                        isLoading={isSubmitting}
                    >
                        Update Email
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ChangeEmailModal;