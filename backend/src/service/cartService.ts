import e from "express";
import { DI } from "..";
import { CartItem, Order, OrderItem, Address } from "../entity";

export class cartService {

    static validateQuantity(data: any) {
        if (!data.quantity) throw new Error("Quantity is required");
        if (isNaN(data.quantity)) throw new Error("Quantity must be a number");
        if (data.quantity <= 0) throw new Error("Quantity must be greater than 0");
        if (data.quantity === null) throw new Error("Quantity is required");
    }

    static async getAllItemsInCart(id: string) {
        // Return all items in the cart
        const user = await DI.userRepository.findOne(id, { populate: ["cart.items.item"] });
    }

    static async checkout(id: string) {
        const user = await DI.userRepository.findOne(id, { populate: ["cart.items.item"] });

        // Check if the user exists
        if (!user) throw new Error("User not found");

        // Check if the cart is empty
        if (user.cart.items.count() === 0) throw new Error("Cart is empty");

        let totalPrice = 0;
        user.cart.items.getItems().forEach((cartItem: CartItem) => {
            totalPrice += cartItem.item.itemPrice * cartItem.quantity;
        });

        const address = new Address();
        address.street = "1234 Main St";
        address.houseNumber = "123";
        address.city = "Los Angeles";
        address.country = "USA";
        address.postalCode = "90007";

        // Create an order
        const order = new Order(totalPrice);
        // Add items to the order
        user.cart.items.getItems().forEach((cartItem: CartItem) => {
            order.items.add(new OrderItem(cartItem.item, cartItem.quantity));
        });
        order.user = user;
        order.orderStatus = "pending";
        order.paymentMethod = "cash";
        order.address = address;
        user.orders.add(order);
        
        user.cart.items.removeAll();
        user.cart.totalPrice -= totalPrice;
        await DI.userRepository.flush();
        return ({message: "Checkout successful", totalPrice});
    }

    static async addItemToCart(userId: string, itemId: string, data: any) {
        const existingItem = await DI.itemRepository.findOne(itemId);
        if (!existingItem) throw new Error( "Item not found" );

        const user = await DI.userRepository.findOne( userId, { populate: ["cart.items"] });

        // check if item price is a number
        this.validateQuantity(data);

        // const cart = await DI.cartRepository.findOne({ id: user.cart.id });

        if (!user) throw new Error ( "User not found" ); 
        const cart = user.cart;
        const items = cart.items;

        // if the item is not in the cart, add the item
        if (!items.getItems().find((cartItem: CartItem) => cartItem.item.id === itemId)) {
            const cartItem = new CartItem(existingItem, data.quantity);
            items.add(cartItem);
            cart.totalPrice += existingItem.itemPrice * Number(data.quantity);
        } else {
            // if the item is in the cart, add the quantity
            items.getItems().forEach((cartItem: CartItem) => {
                if (cartItem.item.id === itemId) {
                    cartItem.quantity += Number(data.quantity);
                    cart.totalPrice += existingItem.itemPrice * Number(data.quantity);
                }
            });
        }
        await DI.userRepository.flush();
        return user.cart;
    }

    static async deleteItemFromCart(userId: string, itemId: string, data: any) {
        const user = await DI.userRepository.findOne({ id: userId }, { populate: ["cart.items.item"] });

        if (!user) throw new Error ("User not found" );

        // check if item price is a number
        this.validateQuantity(data);

        user.cart.items.getItems().forEach((cartItem: CartItem) => {
            // if the item is in the cart and the quantity is greater than the quantity to be deleted, subtract the quantity
            if (cartItem.item.id === itemId && cartItem.quantity > data.quantity) {
                cartItem.quantity -= Number(data.quantity);
                user.cart.totalPrice -= Number(cartItem.item.itemPrice) * Number(data.quantity);

            // if the item is in the cart and the quantity is less than the quantity to be deleted, remove the item
            }else if (cartItem.item.id === data.id && cartItem.quantity <= data.quantity) {
                user.cart.items.remove(cartItem);
                user.cart.totalPrice -= cartItem.item.itemPrice * cartItem.quantity;
            }
        });
        
        // res.status(200).send(user.cart);
        await DI.userRepository.flush();
        return user.cart;
    }
}