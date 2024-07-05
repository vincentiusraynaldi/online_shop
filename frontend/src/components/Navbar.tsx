import { Box, Flex, Link, Heading } from "@chakra-ui/react";
import Searchbar from "./Searchbar";
import { useAuth } from "../provider/AuthProvider";

// TODO: differentiate navbar when user is logged in or not

const Navbar = () => {

  const {
    isLoggedIn,
    actions: { logout }
  } = useAuth()

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
        { isLoggedIn ?
          (<Link href="#"px={4} onClick={logout}>Logout</Link>)
          : 
          (<Link href="/auth/login"px={4}>Login</Link>)
        } 
      </Flex>
    </Flex>
  );
};

export default Navbar;