// import UserChangePassword from "../components/user/UserChangePassword";
// import UserDeleteAccount from "../components/user/UserDeleteAccount";
// import { useAuth } from "../provider/AuthProvider";
// import {
//     Box,
//     Flex,
//     VStack,
//     HStack,
//     Text,
//     Heading,
//     Avatar,
//     Badge,
//     Button,
//     Divider,
//     Card,
//     CardBody,
//     SimpleGrid,
//     Code,
//     Accordion,
//     AccordionItem,
//     AccordionButton,
//     AccordionPanel,
//     AccordionIcon,
// } from "@chakra-ui/react";

// export function UserProfilePage() {
//     const {
//         user: User,
//         actions: {
//             editProfile
//         }
//     } = useAuth();

//     return (
//         <Box maxW="3xl" mx="auto" px={4} py={10}>
//             <Heading size="lg" mb={8} letterSpacing="-0.02em">
//                 Account
//             </Heading>

//             {User ? (
//                 <VStack spacing={6} align="stretch">
//                     {/* Profile summary card */}
//                     <Card borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
//                         <CardBody p={6}>
//                             <Flex
//                                 direction={{ base: "column", sm: "row" }}
//                                 align={{ base: "flex-start", sm: "center" }}
//                                 justify="space-between"
//                                 gap={4}
//                             >
//                                 <HStack spacing={4}>
//                                     <Avatar
//                                         size="xl"
//                                         name={`${User.firstName ?? ""} ${User.lastName ?? ""}`}
//                                         // src={User.avatar}
//                                         bg="blue.500"
//                                         color="white"
//                                     />
//                                     <VStack align="flex-start" spacing={1}>
//                                         <Heading size="md" fontWeight={700}>
//                                             {User.firstName ?? "—"} {User.lastName ?? ""}
//                                         </Heading>
//                                         <Text fontSize="sm" color="gray.500">
//                                             {User.email ?? "—"}
//                                         </Text>
//                                         {/* <Badge
//                                             colorScheme="green"
//                                             borderRadius="full"
//                                             px={2}
//                                             fontSize="xs"
//                                             fontWeight={600}
//                                         >
//                                             Verified
//                                         </Badge> */}
//                                     </VStack>
//                                 </HStack>

//                                     {/* //todo navigate to editprofile page
//                                     // todo make a change email page or think the flow for the change email page 
//                                     // */}
//                                 <Button
//                                     colorScheme="blue"
//                                     borderRadius="full"
//                                     size="sm"
//                                     onClick={() => editProfile}
//                                 >
//                                     Edit Profile
//                                 </Button>
//                             </Flex>
//                         </CardBody>
//                     </Card>

//                     {/* Personal info */}
//                     <Card borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
//                         <CardBody p={6}>
//                             <Text fontSize="sm" fontWeight={700} textTransform="uppercase" letterSpacing="wide" color="gray.500" mb={4}>
//                                 Personal Information
//                             </Text>
//                             <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
//                                 <Box>
//                                     <Text fontSize="xs" color="gray.400" mb={0.5}>First Name</Text>
//                                     <Text fontSize="sm" fontWeight={500}>{User.firstName ?? "—"}</Text>
//                                 </Box>
//                                 <Box>
//                                     <Text fontSize="xs" color="gray.400" mb={0.5}>Last Name</Text>
//                                     <Text fontSize="sm" fontWeight={500}>{User.lastName ?? "—"}</Text>
//                                 </Box>
//                                 <Box>
//                                     <Text fontSize="xs" color="gray.400" mb={0.5}>Email</Text>
//                                     <Text fontSize="sm" fontWeight={500}>{User.email ?? "—"}</Text>
//                                 </Box>
//                                 {/* <Box>
//                                     <Text fontSize="xs" color="gray.400" mb={0.5}>User ID</Text>
//                                     <Text fontSize="sm" fontWeight={500} color="gray.500">{User.id ?? "—"}</Text>
//                                 </Box> */}
//                             </SimpleGrid>
//                         </CardBody>
//                     </Card>

//                     {/* Security */}
//                     <UserChangePassword/>
                    

//                     {/* Danger zone */}
//                     <UserDeleteAccount/>

//                     {/* Raw data - dev only, tucked away */}
//                     <Accordion allowToggle>
//                         <AccordionItem border="none">
//                             <AccordionButton px={0} _hover={{ bg: "transparent" }}>
//                                 <Text fontSize="xs" color="gray.400" flex="1" textAlign="left">
//                                     Developer: raw user data
//                                 </Text>
//                                 <AccordionIcon color="gray.300" />
//                             </AccordionButton>
//                             <AccordionPanel px={0}>
//                                 <Code
//                                     as="pre"
//                                     display="block"
//                                     whiteSpace="pre-wrap"
//                                     bg="gray.50"
//                                     p={4}
//                                     borderRadius="md"
//                                     fontSize="xs"
//                                     color="gray.600"
//                                 >
//                                     {JSON.stringify(User, null, 2)}
//                                 </Code>
//                             </AccordionPanel>
//                         </AccordionItem>
//                     </Accordion>
//                 </VStack>
//             ) : (
//                 <Box
//                     py={16}
//                     textAlign="center"
//                     border="1px dashed"
//                     borderColor="gray.200"
//                     borderRadius="xl"
//                     bg="gray.50"
//                 >
//                     <Text color="gray.500" fontSize="sm">
//                         No user data available.
//                     </Text>
//                 </Box>
//             )}
//         </Box>
//     );
// }

// export default UserProfilePage;


import UserChangePassword from "../components/user/UserChangePassword";
import UserChangeEmail from "../components/user/UserChangeEmail";
import UserDeleteAccount from "../components/user/UserDeleteAccount";
import EditProfileModal from "../components/user/EditProfileModal";
import { useAuth } from "../provider/AuthProvider";
import {
    Box,
    Flex,
    VStack,
    HStack,
    Text,
    Heading,
    Avatar,
    Button,
    Card,
    CardBody,
    SimpleGrid,
    Code,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    useDisclosure,
} from "@chakra-ui/react";

export function UserProfilePage() {
    const { user: User } = useAuth();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

    return (
        <Box maxW="3xl" mx="auto" px={4} py={10}>
            <Heading size="lg" mb={8} letterSpacing="-0.02em">
                Account
            </Heading>

            {User ? (
                <VStack spacing={6} align="stretch">
                    {/* Profile summary card */}
                    <Card borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
                        <CardBody p={6}>
                            <Flex
                                direction={{ base: "column", sm: "row" }}
                                align={{ base: "flex-start", sm: "center" }}
                                justify="space-between"
                                gap={4}
                            >
                                <HStack spacing={4}>
                                    <Avatar
                                        size="xl"
                                        name={`${User.firstName ?? ""} ${User.lastName ?? ""}`}
                                        bg="blue.500"
                                        color="white"
                                    />
                                    <VStack align="flex-start" spacing={1}>
                                        <Heading size="md" fontWeight={700}>
                                            {User.firstName ?? "—"} {User.lastName ?? ""}
                                        </Heading>
                                        <Text fontSize="sm" color="gray.500">
                                            {User.email ?? "—"}
                                        </Text>
                                    </VStack>
                                </HStack>

                                <Button
                                    colorScheme="blue"
                                    borderRadius="full"
                                    size="sm"
                                    onClick={onEditOpen}
                                >
                                    Edit Profile
                                </Button>
                            </Flex>
                        </CardBody>
                    </Card>

                    {/* Personal info */}
                    <Card borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
                        <CardBody p={6}>
                            <Text fontSize="sm" fontWeight={700} textTransform="uppercase" letterSpacing="wide" color="gray.500" mb={4}>
                                Personal Information
                            </Text>
                            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
                                <Box>
                                    <Text fontSize="xs" color="gray.400" mb={0.5}>First Name</Text>
                                    <Text fontSize="sm" fontWeight={500}>{User.firstName ?? "—"}</Text>
                                </Box>
                                <Box>
                                    <Text fontSize="xs" color="gray.400" mb={0.5}>Last Name</Text>
                                    <Text fontSize="sm" fontWeight={500}>{User.lastName ?? "—"}</Text>
                                </Box>
                                <Box>
                                    <Text fontSize="xs" color="gray.400" mb={0.5}>Email</Text>
                                    <Text fontSize="sm" fontWeight={500}>{User.email ?? "—"}</Text>
                                </Box>
                            </SimpleGrid>
                        </CardBody>
                    </Card>

                    {/* Security */}
                    <UserChangePassword />

                    {/* Email */}
                    <UserChangeEmail />

                    {/* Danger zone */}
                    <UserDeleteAccount />

                    {/* Raw data - dev only, tucked away */}
                    <Accordion allowToggle>
                        <AccordionItem border="none">
                            <AccordionButton px={0} _hover={{ bg: "transparent" }}>
                                <Text fontSize="xs" color="gray.400" flex="1" textAlign="left">
                                    Developer: raw user data
                                </Text>
                                <AccordionIcon color="gray.300" />
                            </AccordionButton>
                            <AccordionPanel px={0}>
                                <Code
                                    as="pre"
                                    display="block"
                                    whiteSpace="pre-wrap"
                                    bg="gray.50"
                                    p={4}
                                    borderRadius="md"
                                    fontSize="xs"
                                    color="gray.600"
                                >
                                    {JSON.stringify(User, null, 2)}
                                </Code>
                            </AccordionPanel>
                        </AccordionItem>
                    </Accordion>
                </VStack>
            ) : (
                <Box
                    py={16}
                    textAlign="center"
                    border="1px dashed"
                    borderColor="gray.200"
                    borderRadius="xl"
                    bg="gray.50"
                >
                    <Text color="gray.500" fontSize="sm">
                        No user data available.
                    </Text>
                </Box>
            )}

            <EditProfileModal isOpen={isEditOpen} onClose={onEditClose} />
        </Box>
    );
}

export default UserProfilePage;