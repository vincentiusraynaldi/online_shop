import { 
    Card,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    HStack,
    Box
} from "@chakra-ui/react";

const Item = () =>{

    return (
        <Card>
            <HStack>
                <Box>
                    item image
                </Box>
                <Box>
                    item name
                    <NumberInput defaultValue={1} min={1}>
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                    </NumberInputStepper>
            </NumberInput>
                </Box>
            </HStack>
        </Card>
    );
}

export default Item;