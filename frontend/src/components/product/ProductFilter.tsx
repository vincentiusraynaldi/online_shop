import { useSearchParams } from "react-router-dom";
import { 
    Card, 
    CardBody,
    Checkbox, 
    Button,
    Input,
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
import { Category } from "../../entity/Category";

type ProductFilterProps = {
    categories: Category[];
    brands: string[];
};

const ProductFilter = ({categories, brands} : ProductFilterProps) => {
// const ProductFilter = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const handleStock = () => {
        console.log("handle stock");
        // const params = new URLSearchParams(searchParams);
        

        // setSearchParams(searchParams);
    }

    const deleteFilter = () => {
        setMinPrice("");
        setMaxPrice("");
        setSearchParams({});
    }

    const handlePriceButton = (value: [string, string]) => {
        setMinPrice(value[0]);
        setMaxPrice(value[1]);

        const params = new URLSearchParams(searchParams);
        params.set("minPrice", value[0]);
        params.set("maxPrice", value[1]);
        setSearchParams(params);
    }

    const handleMinPrice = (event: React.ChangeEvent<HTMLInputElement>) => {
        const nextValue = event.target.value;
        setMinPrice(nextValue);
    }

    const handleMaxPrice = (event: React.ChangeEvent<HTMLInputElement>) => {
        const nextValue = event.target.value;
        setMaxPrice(nextValue);
    }


    const handleBrandClick = (value: string) => {
        const params = new URLSearchParams(searchParams);

        // params.set("brand", value);
        if(params.getAll('brand').includes(value)){
            params.delete('brand');
        }else{
            params.set('brand', value);
        }
        setSearchParams(params);
    }

    const handleCategoryClick = (value : Category) => {
        const params = new URLSearchParams(searchParams);

        const existing = params.getAll("categories");

        if(existing.includes(value.categoryName)){
            params.delete("categories");
            existing.filter(name => name !== value.categoryName).forEach(name => params.append("categories", name));
        }else{
            params.append("categories", value.categoryName);
        }

        setSearchParams(params);
    }

    const selectedCategories = searchParams.getAll("categories");
    const selectedBrand = searchParams.getAll("brand");

    return (
        <>
            <Card>
                <CardBody>
                    <Accordion allowMultiple>
                        <AccordionItem>
                            <AccordionButton>
                                <Box as='span' flex='1' textAlign='left' fontWeight={700}>
                                    Category
                                </Box>
                                <AccordionIcon/>
                            </AccordionButton>
                            <AccordionPanel>
                                {/* {categories.map(cat => (
                                    <Button
                                    key={cat.id}
                                    onClick={() => handleCategoryClick(cat)}
                                    >
                                    {cat.categoryName}
                                    </Button>
                                ))} */}
                                {categories.map(cat => (
                                    <Button
                                        key={cat.id}
                                        onClick={() => handleCategoryClick(cat)}
                                        colorScheme={selectedCategories.includes(cat.categoryName) ? "blue" : "gray"} // active state
                                        variant={selectedCategories.includes(cat.categoryName) ? "solid" : "outline"}
                                    >
                                        {cat.categoryName}
                                    </Button>
                                ))}
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
                                        <InputLeftAddon>EURO</InputLeftAddon>
                                        <Input type="number" placeholder="minimal price" onChange={handleMinPrice} value={minPrice}></Input>
                                    </InputGroup>
                                    
                                    <InputGroup>
                                        <InputLeftAddon>EURO</InputLeftAddon>
                                        <Input type="number" placeholder="maximal price" onChange={handleMaxPrice} value={maxPrice}></Input>
                                    </InputGroup>
                                <Button onClick={() => handlePriceButton(["0", "50"])}>0 - 50</Button>
                                <Button onClick={() => handlePriceButton(["50", "100"])}>50 - 100</Button>
                                <Button onClick={() => handlePriceButton(["100", "200"])}>100 - 200</Button>
                                <br></br>
                                <Button onClick={() => handlePriceButton([minPrice, maxPrice])}>Submit</Button>
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
                                {brands.map(b => (
                                    <Button
                                    onClick={() => handleBrandClick(b)}
                                    colorScheme={selectedBrand.includes(b) ? "blue" : "gray"} // active state
                                    variant={selectedBrand.includes(b) ? "solid" : "outline"}
                                    >
                                    {b}
                                    </Button>
                                ))}
                            </AccordionPanel>
                        </AccordionItem>

                        {/* <AccordionItem>
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
                        </AccordionItem> */}
                    </Accordion>
                    <Button onClick={()=>deleteFilter()}>Delete Filter</Button>
                </CardBody>
            </Card>
        </>
    )
}

export default ProductFilter;