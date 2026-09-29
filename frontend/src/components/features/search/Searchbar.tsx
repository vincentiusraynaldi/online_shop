import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Input,
  InputLeftElement,
  InputGroup,
  InputRightElement,
  IconButton,
  List,
  ListItem,
  Text,
  Icon
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAllProducts } from "../../../hooks/useAllProducts";

const Searchbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const { products } = useAllProducts();

  const suggestions =
    searchTerm.trim() === ""
      ? []
      : (products ?? [])
          .filter((p) =>
            p.itemName.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .slice(0, 6);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setShowSuggestions(true);
  };

  const runSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);

    if (term !== "") {
      params.set("name", term);
    } else {
      params.delete("name");
    }

    setSearchParams(params);
    setShowSuggestions(false);
    navigate(`/search?${params}`);
  };

  const handleSearch = () => runSearch(searchTerm);

  const handleSuggestionClick = (name: string) => {
    setSearchTerm(name);
    runSearch(name);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    } else if (event.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // return (
  //   <Box position="relative" ref={containerRef} w="100%">
  //     <InputGroup>
  //       <Input
  //         placeholder="Search products..."
  //         bg="white"
  //         color="gray.800"
  //         borderRadius="md"
  //         _placeholder={{ color: "gray.400" }}
  //         onChange={handleInputChange}
  //         onKeyDown={handleKeyDown}
  //         onFocus={() => searchTerm && setShowSuggestions(true)}
  //         value={searchTerm}
  //       />
  //       <InputRightElement>
  //         <IconButton
  //           aria-label="Search"
  //           icon={<SearchIcon />}
  //           size="sm"
  //           variant="ghost"
  //           color="gray.500"
  //           onClick={handleSearch}
  //         />
  //       </InputRightElement>
  //     </InputGroup>

  //     {showSuggestions && suggestions.length > 0 && (
  //       <List
  //         position="absolute"
  //         top="calc(100% + 4px)"
  //         left={0}
  //         right={0}
  //         bg="white"
  //         color="gray.800"
  //         borderRadius="md"
  //         boxShadow="lg"
  //         border="1px solid"
  //         borderColor="gray.200"
  //         zIndex={20}
  //         overflow="hidden"
  //       >
  //         {suggestions.map((product) => (
  //           <ListItem
  //             key={product.id}
  //             px={4}
  //             py={2}
  //             cursor="pointer"
  //             _hover={{ bg: "gray.50" }}
  //             onClick={() => handleSuggestionClick(product.itemName)}
  //           >
  //             <Text fontSize="sm" fontWeight="medium">
  //               {product.itemName}
  //             </Text>
  //           </ListItem>
  //         ))}
  //       </List>
  //     )}
  //   </Box>
  // );

  return (
    <Box position="relative" ref={containerRef} w="100%">
      <InputGroup size="sm">
        {/* <InputLeftElement pointerEvents="none">
          <Icon as={SearchIcon} color="gray.400" boxSize={3.5} />
        </InputLeftElement> */}
        <Input
          placeholder="Search products..."
          bg="gray.50"
          color="gray.800"
          borderRadius="full"
          border="1px solid"
          borderColor="gray.200"
          _placeholder={{ color: "gray.400" }}
          _hover={{ borderColor: "gray.300" }}
          _focus={{
            bg: "white",
            borderColor: "blue.400",
            boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
          }}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => searchTerm && setShowSuggestions(true)}
          value={searchTerm}
        />
        <InputRightElement>
          <IconButton
            aria-label="Search"
            icon={<SearchIcon boxSize={3} />}
            size="xs"
            variant="ghost"
            borderRadius="full"
            color="gray.500"
            _hover={{ color: "blue.600", bg: "blue.50" }}
            onClick={handleSearch}
          />
        </InputRightElement>
      </InputGroup>
 
      {showSuggestions && suggestions.length > 0 && (
        <List
          position="absolute"
          top="calc(100% + 6px)"
          left={0}
          right={0}
          bg="white"
          color="gray.800"
          borderRadius="lg"
          boxShadow="lg"
          border="1px solid"
          borderColor="gray.100"
          zIndex={20}
          overflow="hidden"
          py={1}
        >
          {suggestions.map((product) => (
            <ListItem
              key={product.id}
              px={4}
              py={2}
              cursor="pointer"
              _hover={{ bg: "blue.50" }}
              transition="background 0.1s ease"
              onClick={() => handleSuggestionClick(product.itemName)}
            >
              <Text fontSize="sm" fontWeight={500} noOfLines={1}>
                {product.itemName}
              </Text>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default Searchbar;