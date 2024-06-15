import { Box, Flex, Link, Heading } from "@chakra-ui/react";
import Searchbar from "./Searchbar";

const Navbar = () => {
  return (
    <Flex as="nav" align="center" justify="space-between" wrap="wrap" padding={6} bg="blue.500" color="white">
      <Heading as="h1" size="lg" textTransform="uppercase">
        My Shop
      </Heading>
      <Box>
        <Searchbar />
      </Box>
      <Flex align="center" justify="space-between" wrap="wrap" px={4}>
        <Link href="#" px={4}>Home</Link>
        <Link href="#" px={4}>About</Link>
        <Link href="#"px={4}>Contact</Link>
        <Link href="#"px={4}>Login</Link>
      </Flex>
    </Flex>
  );
};

export default Navbar;