// import { Box, Flex, Link, Heading } from "@chakra-ui/react";
// import Searchbar from "../features/search/Searchbar";
// import { useAuth } from "../../provider/AuthProvider";

// // TODO: differentiate navbar when user is logged in or not

// const Navbar = () => {

//   const {
//     isLoggedIn,
//     actions: { logout }
//   } = useAuth()

//   return (
//     <Flex as="nav" align="center" justify="space-between" wrap="wrap" padding={6} bg="blue.500" color="white">
//       <Heading as="h1" size="lg" textTransform="uppercase">
//         My Shop
//       </Heading>
//       <Box>
//         <Searchbar />
//       </Box>
//       <Flex align="center" justify="space-between" wrap="wrap" px={4}>
//         <Link href="/home" px={4}>Home</Link>
//         <Link href="#" px={4}>About</Link>
//         <Link href="#"px={4}>Contact</Link>
//         <Link href="/users/cart"px={4}>Cart</Link>
//         { isLoggedIn ?
//           (<Link href="#"px={4} onClick={logout}>Logout</Link>)
//           : 
//           (<Link href="/auth/login"px={4}>Login</Link>)
//         } 
//       </Flex>
//     </Flex>
//   );
// };

// export default Navbar;


import {
  Box,
  Flex,
  HStack,
  Link,
  Button,
  Heading,
  IconButton,
  useDisclosure,
  Stack,
  Collapse,
  Icon
} from "@chakra-ui/react";
import { FiShoppingCart } from "react-icons/fi";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import Searchbar from "../features/search/Searchbar";
import { useAuth } from "../../provider/AuthProvider";
import { Link as RouterLink } from "react-router-dom";

const NAV_LINKS = [
  { label: "Cart", href: "/users/cart" },
];

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const {
    isLoggedIn,
    actions: { logout },
  } = useAuth();

  return (
    <Box
      borderBottom="1px solid"
      borderColor="gray.100"
      bg="white"
      position="sticky"
      top={0}
      zIndex={30}
      boxShadow="0 1px 2px rgba(0,0,0,0.03)"
    >
      <Flex
        align="center"
        justify="space-between"
        maxW="7xl"
        mx="auto"
        px={{ base: 4, md: 8 }}
        py={3.5}
        gap={4}
      >
        {/* Left: Logo + mobile toggle */}
        <Flex align="center" flex={{ base: 1, md: "auto" }} gap={1}>
          <IconButton
            display={{ base: "flex", md: "none" }}
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant="ghost"
            aria-label="Toggle Navigation"
            mr={1}
          />
 
          <Link as={RouterLink} to="/home" _hover={{ textDecoration: "none" }}>
            <Heading
              as="h1"
              size="md"
              color="blue.600"
              letterSpacing="-0.02em"
              fontWeight={800}
              ml={{ base: 1, md: 0 }}
            >
              My Shop
            </Heading>
          </Link>
        </Flex>
 
        {/* Center: Search (desktop only) */}
        <Box display={{ base: "none", md: "block" }} flex={1} maxW="420px">
          <Searchbar />
        </Box>
 
        {/* Right: Auth + Cart */}
        <HStack spacing={2} flex={{ base: 1, md: "auto" }} justify="flex-end">
 
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              as="a"
              href={link.href}
              fontSize="sm"
              fontWeight={600}
              letterSpacing="0.01em"
              color="gray.600"
              px={2}
              py={2}
              borderRadius="md"
              _hover={{ color: "blue.600", bg: "blue.50", textDecoration: "none" }}
              transition="all 0.15s ease"
            >
              {link.label}
            </Link>
          ))}
 
          {isLoggedIn ? (
            <Button
              fontSize="sm"
              fontWeight={600}
              variant="outline"
              colorScheme="blue"
              borderRadius="full"
              size="sm"
              onClick={logout}
            >
              Logout
            </Button>
          ) : (
            <Link
              as="a"
              href="/auth/login"
              fontSize="sm"
              fontWeight={600}
              display={{ base: "none", md: "inline-flex" }}
              color="white"
              bg="blue.600"
              px={4}
              py={2}
              borderRadius="full"
              _hover={{ textDecoration: "none", bg: "blue.700" }}
              transition="background 0.15s ease"
            >
              Sign In
            </Link>
          )}
        </HStack>
      </Flex>
 
      {/* Mobile menu */}
      <Collapse in={isOpen} animateOpacity>
        <Stack
          p={4}
          display={{ md: "none" }}
          spacing={4}
          borderTop="1px solid"
          borderColor="gray.100"
        >
          <Box>
            <Searchbar />
          </Box>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              as="a"
              href={link.href}
              fontSize="sm"
              fontWeight={600}
              letterSpacing="0.01em"
              color="gray.600"
              px={2}
              py={2}
              borderRadius="md"
              _hover={{ color: "blue.600", bg: "blue.50", textDecoration: "none" }}
              transition="all 0.15s ease"
            >
              {link.label}
            </Link>
          ))}
          {isLoggedIn ? (
            <Button size="sm" variant="outline" colorScheme="blue" borderRadius="full" onClick={logout}>
              Logout
            </Button>
          ) : (
            <Button
              as={Link}
              href="/auth/login"
              size="sm"
              colorScheme="blue"
              borderRadius="full"
              _hover={{ textDecoration: "none" }}
            >
              Get Started
            </Button>
          )}
        </Stack>
      </Collapse>
    </Box>
  );
};

export default Navbar;