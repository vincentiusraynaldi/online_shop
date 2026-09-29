// import { 
//     useDisclosure, 
//     Button,
//     Modal, 
//     ModalOverlay, 
//     ModalContent, 
//     ModalHeader,
//     ModalCloseButton,
//     ModalBody,
//     ModalFooter,
// } from "@chakra-ui/react";
// import { useAddress } from "../../hooks/useAddress";

// const AddressModal = () => {
//     const {addresses, fetchAddress, createAddress, removeAddress, isLoading } = useAddress();
    
//     // fullName: "John Doe"
//     //     "street": "hi",
//     // "houseNumber": "34",
//     // "city": "sby",
//     // "country": "indo",
//     // "postalCode": "34355"

//     const {isOpen, onOpen, onClose } = useDisclosure();

//     const handleOpen = () => {
//         fetchAddress();
//         onOpen();
//     }

//     return (
//         <>
//             <Button onClick={handleOpen}>Open Modal</Button>

//             <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
//                 <ModalOverlay />
//                 <ModalContent>
//                 <ModalHeader>Modal Title</ModalHeader>
//                 <ModalCloseButton />
//                 <ModalBody>
//                 </ModalBody>

//                 <ModalFooter>
//                     <Button colorScheme='blue' mr={3} onClick={onClose}>
//                     Close
//                     </Button>
//                     <Button variant='ghost'>Secondary Action</Button>
//                 </ModalFooter>
//                 </ModalContent>
//             </Modal>
//         </>
//     )
// }

// export default AddressModal;

import {
    useDisclosure,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    VStack,
    HStack,
    Card,
    Text,
    Radio,
    RadioGroup,
    FormControl,
    FormLabel,
    Input,
    Spinner,
    Box,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAddress } from "../../hooks/useAddress";
import { Address, CreateAddressPayload } from "../../entity/Address";

interface AddressModalProps {
    selectedAddressId: string | null;
    onSelectAddress: (address: Address) => void;
}

const emptyForm: CreateAddressPayload = {
    fullName: "",
    street: "",
    houseNumber: "",
    city: "",
    country: "",
    postalCode: "",
};

const AddressModal = ({ selectedAddressId, onSelectAddress }: AddressModalProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { addresses, isLoading, createAddress, fetchAddress } = useAddress();

    const [view, setView] = useState<"list" | "form">("list");
    const [form, setForm] = useState<CreateAddressPayload>(emptyForm);
    const [tempSelectedId, setTempSelectedId] = useState<string | null>(selectedAddressId);
    const [isSaving, setIsSaving] = useState(false);

    const handleOpen = () => {
        setTempSelectedId(selectedAddressId);
        setView("list");
        fetchAddress();
        onOpen();
    };

    const handleFormChange = (field: keyof CreateAddressPayload, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSaveNewAddress = async () => {
        setIsSaving(true);
        const created = await createAddress(form);
        setIsSaving(false);

        if (created) {
            setTempSelectedId(created.id);
            setForm(emptyForm);
            setView("list");
        }
    };

    const handleConfirm = () => {
        const selected = addresses.find((a) => a.id === tempSelectedId);
        if (selected) {
            onSelectAddress(selected);
        }
        onClose();
    };

    const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

    return (
        <>
            <Card p={4} w="320px">
                <Text fontSize="sm" color="gray.500" mb={1}>
                    Delivery address
                </Text>
                {selectedAddress ? (
                    <VStack align="stretch" spacing={1}>
                        <Text fontWeight="500">{selectedAddress.fullName}</Text>
                        <Text fontSize="sm" color="gray.600">
                            {selectedAddress.street} {selectedAddress.houseNumber}, {selectedAddress.city}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                            {selectedAddress.postalCode}, {selectedAddress.country}
                        </Text>
                    </VStack>
                ) : (
                    <Text fontSize="sm" color="gray.400">No address selected</Text>
                )}
                <Button size="sm" variant="outline" mt={3} onClick={handleOpen}>
                    {selectedAddress ? "Change address" : "Select address"}
                </Button>
            </Card>

            <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} size="md">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {view === "list" ? "Select delivery address" : "Add new address"}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {view === "list" ? (
                            isLoading ? (
                                <Spinner />
                            ) : (
                                <RadioGroup value={tempSelectedId ?? ""} onChange={setTempSelectedId}>
                                    <VStack align="stretch" spacing={3}>
                                        {addresses.length === 0 && (
                                            <Text fontSize="sm" color="gray.400">
                                                No saved addresses yet.
                                            </Text>
                                        )}
                                        {addresses.map((address) => (
                                            <Card
                                                key={address.id}
                                                p={3}
                                                borderWidth={1}
                                                borderColor={tempSelectedId === address.id ? "blue.400" : "gray.200"}
                                                cursor="pointer"
                                                onClick={() => setTempSelectedId(address.id)}
                                            >
                                                <HStack align="flex-start" spacing={3}>
                                                    <Radio value={address.id} mt={1} />
                                                    <VStack align="stretch" spacing={0}>
                                                        <Text fontWeight="500">{address.fullName}</Text>
                                                        <Text fontSize="sm" color="gray.600">
                                                            {address.street} {address.houseNumber}, {address.city}
                                                        </Text>
                                                        <Text fontSize="sm" color="gray.600">
                                                            {address.postalCode}, {address.country}
                                                        </Text>
                                                    </VStack>
                                                </HStack>
                                            </Card>
                                        ))}
                                    </VStack>
                                </RadioGroup>
                            )
                        ) : (
                            <VStack spacing={3}>
                                <FormControl isRequired>
                                    <FormLabel>Full name</FormLabel>
                                    <Input
                                        value={form.fullName}
                                        onChange={(e) => handleFormChange("fullName", e.target.value)}
                                    />
                                </FormControl>
                                <HStack w="100%">
                                    <FormControl isRequired>
                                        <FormLabel>Street</FormLabel>
                                        <Input
                                            value={form.street}
                                            onChange={(e) => handleFormChange("street", e.target.value)}
                                        />
                                    </FormControl>
                                    <FormControl isRequired>
                                        <FormLabel>House no.</FormLabel>
                                        <Input
                                            value={form.houseNumber}
                                            onChange={(e) => handleFormChange("houseNumber", e.target.value)}
                                        />
                                    </FormControl>
                                </HStack>
                                <HStack w="100%">
                                    <FormControl isRequired>
                                        <FormLabel>City</FormLabel>
                                        <Input
                                            value={form.city}
                                            onChange={(e) => handleFormChange("city", e.target.value)}
                                        />
                                    </FormControl>
                                    <FormControl isRequired>
                                        <FormLabel>Postal code</FormLabel>
                                        <Input
                                            value={form.postalCode}
                                            onChange={(e) => handleFormChange("postalCode", e.target.value)}
                                        />
                                    </FormControl>
                                </HStack>
                                <FormControl isRequired>
                                    <FormLabel>Country</FormLabel>
                                    <Input
                                        value={form.country}
                                        onChange={(e) => handleFormChange("country", e.target.value)}
                                    />
                                </FormControl>
                            </VStack>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        {view === "list" ? (
                            <>
                                <Button variant="ghost" mr={3} onClick={() => setView("form")}>
                                    + Add new address
                                </Button>
                                <Box flex={1} />
                                <Button variant="ghost" mr={3} onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button
                                    colorScheme="blue"
                                    onClick={handleConfirm}
                                    isDisabled={!tempSelectedId}
                                >
                                    Confirm
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="ghost" mr={3} onClick={() => setView("list")}>
                                    Back
                                </Button>
                                <Button
                                    colorScheme="blue"
                                    onClick={handleSaveNewAddress}
                                    isLoading={isSaving}
                                >
                                    Save address
                                </Button>
                            </>
                        )}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default AddressModal;