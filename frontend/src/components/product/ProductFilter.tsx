import { useSearchParams } from "react-router-dom";
import { 
    Card, 
    CardBody, 
    Text, 
    Checkbox, 
    Button, 
    VStack,
    Input,
    RangeSlider,
    RangeSliderTrack,
    RangeSliderFilledTrack,
    RangeSliderThumb,
    HStack,
    NumberInput,
    NumberInputField,
    ButtonGroup,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    InputGroup,
    InputLeftAddon
} from "@chakra-ui/react";
import { useState } from "react";

const ProductFilter = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const handleNameChange = () => {
        setSearchParams()
    }

    const handleStock = () => {
        console.log("handle stock");
        // const params = new URLSearchParams(searchParams);
        

        // setSearchParams(searchParams);
    }

    // const minMaxPrice = (value : any) => {
    //     // console.log("value ", value)
    //     if (value){
    //         setMinPrice(value[0])
    //         setMaxPrice(value[1])
    //     }
    // }

    const updateFilter = (key: string, value: string) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);

            if (value !== "") {
                next.set(key, value);
            } else {
                next.delete(key);
            }

            return next;
        });
    }

    const updateFilters = (updates: Record<string, string>) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);

            Object.entries(updates).forEach(([key, value]) => {
                if (value !== "") {
                    next.set(key, value);
                } else {
                    next.delete(key);
                }
            });

            return next;
        });
    }

    const deleteFilter = () => {
        setSearchParams({});
    }

    const handlePriceButton = (value: [string, string]) => {
        setMinPrice(value[0]);
        setMaxPrice(value[1]);

        updateFilters({
            minPrice: value[0],
            maxPrice: value[1],
        });
    }

    const handleMinPrice = (event: React.ChangeEvent<HTMLInputElement>) => {
        const nextValue = event.target.value;
        setMinPrice(nextValue);
        updateFilter("minPrice", nextValue);
        // console.log("min price input:", nextValue);
        // setSearchParams({ minPrice: {minPrice}})
    }

    const handleMaxPrice = (event: React.ChangeEvent<HTMLInputElement>) => {
        const nextValue = event.target.value;
        setMaxPrice(nextValue);
        updateFilter("maxPrice", nextValue);
        // console.log("max price input:", nextValue);
    }

    return (
        <>
            <Card>
                <CardBody>
                    {/* <VStack> */}
                        {/* <Text>View a summary of all your customers over the last month.</Text> */}
                        {/* <Button defaultChecked onClick={() => handleStock()}>Search</Button> */}
                    {/* </VStack> */}
                    <Accordion allowMultiple>
                        <AccordionItem>
                            <AccordionButton>
                                <Box as='span' flex='1' textAlign='left' fontWeight={700}>
                                    Category
                                </Box>
                                <AccordionIcon/>
                            </AccordionButton>
                            <AccordionPanel>
                                category panel
                            </AccordionPanel>
                        </AccordionItem>

                        <AccordionItem>
                            
                            <AccordionButton>
                                <Box as='span' flex='1' textAlign='left' fontWeight={700}>
                                    Price
                                </Box>
                                <AccordionIcon/>
                            </AccordionButton>
                            
                            <AccordionPanel>
                                    <InputGroup>
                                        <InputLeftAddon>RP</InputLeftAddon>
                                        <Input type="number" placeholder="minimal price" onChange={handleMinPrice} value={minPrice}></Input>
                                        {/* <NumberInput> */}
                                        {/* <NumberInputField size={3} maxW={16} defaultValue={15} min={10} placeholder="min price"/> */}
                                        {/* <NumberInputField placeholder="min price"/> */}
                                        {/* </NumberInput> */}
                                    </InputGroup>
                                    
                                    <InputGroup>
                                        <InputLeftAddon>RP</InputLeftAddon>
                                        <Input type="number" placeholder="maximal price" onChange={handleMaxPrice} value={maxPrice}></Input>
                                    </InputGroup>
                                    {/* <NumberInput > */}
                                        {/* <NumberInputField size={3} maxW={16} defaultValue={15} min={10} placeholder="max price"/> */}
                                        {/* <NumberInputField size={3} defaultValue={15} min={10} placeholder="max price"/> */}
                                    {/* </NumberInput> */}
                                <Button onClick={() => handlePriceButton(["0", "50"])}>0 - 50</Button>
                                <Button onClick={() => handlePriceButton(["50", "100"])}>50 - 100</Button>
                                <Button onClick={() => handlePriceButton(["100", "200"])}>100 - 200</Button>
                            </AccordionPanel>
                        </AccordionItem>

                        <AccordionItem>
                            <AccordionButton>
                                <Box as='span' flex='1' textAlign='left' fontWeight={700}>
                                    Brand
                                </Box>
                                <AccordionIcon/>
                            </AccordionButton>

                            <AccordionPanel>
                                brand panel
                            </AccordionPanel>
                        </AccordionItem>

                        <AccordionItem>
                            <AccordionButton>
                                <Box as='span' flex='1' textAlign='left' fontWeight={700}>
                                    Others
                                </Box>
                                <AccordionIcon/>
                            </AccordionButton>

                            <AccordionPanel>
                                <Checkbox defaultChecked onChange={() => handleStock()}>PreOrder</Checkbox>
                                <Checkbox defaultChecked onChange={() => handleStock()}>Ready Stock</Checkbox>
                            </AccordionPanel>
                        </AccordionItem>
                    </Accordion>
                </CardBody>
            </Card>
        </>
    )
}

export default ProductFilter;