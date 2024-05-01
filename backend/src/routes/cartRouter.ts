import { Router } from "express";
import { DI } from "..";
import passport from "passport";
import { cartController } from "../controller/cartController";

const router = Router({mergeParams: true});

const authenticateJWT = passport.authenticate("jwt", {session: false});

// show all items in cart
router.get("/", authenticateJWT, cartController.getAllItemsInCart);

// select item in cart

// checkout selected item in cart
router.post("/checkout", authenticateJWT, );

// add item to cart
router.post("/:itemId", authenticateJWT, cartController.addItemToCart);

// delete item in cart
router.delete("/:id", authenticateJWT, cartController.deleteItemFromCart); 

// test stripe
router.post("/stripe", authenticateJWT, async (req, res) => {
    try {
        const charge = await DI.stripe.charges.create({
            amount: 1000,
            currency: "usd",
            source: "tok_visa",
            description: 'Charge for ' + req.body.amount +' amount',
        });
        // Process the charge and handle the response as needed
        console.log(charge);
        res.status(200).send({ message: "Payment successful", charge });
    }
    catch (e: any) {
        return res.status(400).send({message: e.message});
    }
});

// router.get("/", authenticateJWT, async (req, res) => {
//     try{
//         const user = await DI.userRepository.findOne({ id: req.user.id },{ populate: ["cart.items"] });
        
//         if (!user) return res.status(404).send({ message: "User not found" });

//         const cart = user.cart;

//         res.send(cart);
//     }
//     catch(e:any){
//         return res.status(400).send({ message: e.message });
//     }
// });

// router.post("/checkout", authenticateJWT, async (req, res) => {
//     try {
//         const user = await DI.userRepository.findOne({ id: req.user.id }, { populate: ["cart.items.item", "addresses"] });

//         if (!user) return res.status(404).send({ message: "User not found" });

//         let total = user.cart.totalPrice;
//         // res.send({message: "Checkout successful", userCart: user.cart, items: user.cart.items});
//         user.cart.items.getItems().forEach((cartItem: CartItem) => {
//             total += cartItem.item.itemPrice * cartItem.quantity;
//         });

//         const address = new Address();
//         address.street = "1234 Main St";
//         address.houseNumber = "123";
//         address.city = "Los Angeles";
//         address.country = "USA";
//         address.postalCode = "90007";

//         // if (typeof total !== "number") return res.status(400).send({ message: "Total must be a number" });
//         // else res.status(200).send({ message: "total is a number", user.cart.totalPrice });


//         const order = new Order(total);
//         order.totalPrice = total;
//         // res.send({message: "Checkout successful", orderTotal: order.totalPrice, total: total});
//         user.cart.items.getItems().forEach((cartItem: CartItem) => {
//             order.items.add(new OrderItem(cartItem.item, cartItem.quantity));
//         });
//         order.user = user;
//         order.orderStatus = "pending";
//         order.paymentMethod = "cash";
//         order.address = address;
//         order.totalPrice = total;
//         user.orders.add(order);
        
//         user.cart.items.removeAll();
//         user.cart.totalPrice -= total;
//         await DI.userRepository.flush();
//         res.send({message: "Checkout successful", total});
//         // res.status(200).send(user);
//     }
//     catch (e: any) {
//         return res.status(400).send({message: e.message});
//     }
// });

//router.post("/:itemId", authenticateJWT, async (req, res) => {
    //     try{
    //         const existingItem = await DI.itemRepository.findOne(req.params.itemId);
    //         if (!existingItem) return res.status(404).send({ message: "Item not found" });
    
    //         const user = await DI.userRepository.findOne({ id: req.user.id },{ populate: ["cart.items"] });
    
    //         // check if item price is a number
    //         if (isNaN(req.body.quantity)) return res.status(400).send({ message: "Quantity must be a number" });
    
    //         // const cart = await DI.cartRepository.findOne({ id: user.cart.id });
    
    //         if (!user) return res.status(404).send({ message: "User not found" }); 
    //         const cart = user.cart;
    //         const items = cart.items;
    
    //         // if the item is not in the cart, add the item
    //         if (!items.getItems().find((cartItem: CartItem) => cartItem.item.id === req.params.itemId)) {
    //             const cartItem = new CartItem(existingItem, req.body.quantity);
    //             items.add(cartItem);
    //             cart.totalPrice += existingItem.itemPrice * Number(req.body.quantity);
    //         } else {
    //             // if the item is in the cart, add the quantity
    //             items.getItems().forEach((cartItem: CartItem) => {
    //                 if (cartItem.item.id === req.params.itemId) {
    //                     cartItem.quantity += Number(req.body.quantity);
    //                     cart.totalPrice += existingItem.itemPrice * Number(req.body.quantity);
    //                 }
    //             });
    //         }
    //         await DI.userRepository.flush();
    //         res.send(user.cart);
    //     }
    //     catch(e:any){
    //         return res.status(400).send({ message: e.message });
    //     }
    // });

    // router.delete("/:id", authenticateJWT, async (req, res) => {
//     try {
//         const user = await DI.userRepository.findOne({ id: req.user.id }, { populate: ["cart.items.item"] });

//         if (!user) return res.status(404).send({ message: "User not found" });

//         // check if item price is a number
//         if (isNaN(req.body.quantity)) return res.status(400).send({ message: "Quantity must be a number" });
        
//         user.cart.items.getItems().forEach((cartItem: CartItem) => {

//             // if the item is in the cart and the quantity is greater than the quantity to be deleted, subtract the quantity
//             if (cartItem.item.id === req.params.id && cartItem.quantity > req.body.quantity) {
//                 cartItem.quantity -= Number(req.body.quantity);
//                 user.cart.totalPrice -= Number(cartItem.item.itemPrice) * Number(req.body.quantity);

//             // if the item is in the cart and the quantity is less than the quantity to be deleted, remove the item
//             }else if (cartItem.item.id === req.params.id && cartItem.quantity <= req.body.quantity) {
//                 user.cart.items.remove(cartItem);
//                 user.cart.totalPrice -= cartItem.item.itemPrice * cartItem.quantity;
//             }
//         });
        
//         // res.status(200).send(user.cart);
//         await DI.userRepository.flush();
//         res.status(200).json(user.cart);
//     }
//     catch (e: any) {
//         return res.status(400).send({message: e.message});
//     }
// });



export const cartRouter = router;