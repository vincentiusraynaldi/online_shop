//content: title of the product, image of the product, price(figure out when there is discount price tag and the discount percentage)
//add to cart button
//when being clicked (the item) anywhere except the add to cart button, it will redirect it to the detailed version(product detail)

import { Card, Button } from "@chakra-ui/react";

const ProductCard = () => {

    return(
        <div>
            <h3>itemName</h3>
            <Button>Add to cart</Button>
        </div>
    );
};

export default ProductCard;