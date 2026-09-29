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
    Input,
    InputGroup,
    InputRightElement,
    IconButton,
    Button,
    VStack,
    Alert,
    AlertIcon,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useAuth } from "../../provider/AuthProvider";

type ChangePasswordModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

type FormState = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

const initialForm: FormState = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
};

const ChangePasswordModal = ({ isOpen, onClose }: ChangePasswordModalProps) => {
    const {
        actions: { changePassword },
    } = useAuth();

    const [form, setForm] = useState<FormState>(initialForm);
    const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPasswords, setShowPasswords] = useState(false);

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

        if (!form.currentPassword) nextErrors.currentPassword = "Current password is required";
        if (!form.newPassword) nextErrors.newPassword = "New password is required";
        else if (form.newPassword.length < 8) nextErrors.newPassword = "Must be at least 8 characters";

        if (form.currentPassword && form.newPassword && form.currentPassword === form.newPassword) {
            nextErrors.newPassword = "New password must be different from current password";
        }

        if (!form.confirmPassword) nextErrors.confirmPassword = "Please confirm your new password";
        else if (form.newPassword && form.confirmPassword !== form.newPassword) {
            nextErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setFormError(null);
        setIsSubmitting(true);
        try {
            const result = await changePassword(form);
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
                <ModalHeader>Change Password</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4} align="stretch">
                        {formError && (
                            <Alert status="error" borderRadius="md" fontSize="sm">
                                <AlertIcon />
                                {formError}
                            </Alert>
                        )}
                        <FormControl isInvalid={!!errors.currentPassword}>
                            <FormLabel fontSize="sm">Current Password</FormLabel>
                            <InputGroup>
                                <Input
                                    type={showPasswords ? "text" : "password"}
                                    value={form.currentPassword}
                                    onChange={update("currentPassword")}
                                    autoComplete="current-password"
                                />
                                <InputRightElement>
                                    <IconButton
                                        aria-label={showPasswords ? "Hide passwords" : "Show passwords"}
                                        icon={showPasswords ? <ViewOffIcon /> : <ViewIcon />}
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowPasswords((v) => !v)}
                                    />
                                </InputRightElement>
                            </InputGroup>
                            <FormErrorMessage>{errors.currentPassword}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.newPassword}>
                            <FormLabel fontSize="sm">New Password</FormLabel>
                            <Input
                                type={showPasswords ? "text" : "password"}
                                value={form.newPassword}
                                onChange={update("newPassword")}
                                autoComplete="new-password"
                            />
                            <FormErrorMessage>{errors.newPassword}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.confirmPassword}>
                            <FormLabel fontSize="sm">Confirm New Password</FormLabel>
                            <Input
                                type={showPasswords ? "text" : "password"}
                                value={form.confirmPassword}
                                onChange={update("confirmPassword")}
                                autoComplete="new-password"
                            />
                            <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
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
                        Update Password
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ChangePasswordModal;