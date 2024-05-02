import { DI } from "..";

export class orderService {
    static async getOrders(userId: string) {
        const user = await DI.userRepository.findOne({ id: userId }, { populate: ["orders.items.item", "orders.address"] });

        if (!user) throw new Error("User not found");

        return user.orders;
    }

    static async getOrder(userId: string, orderId: string) {
        const user = await DI.userRepository.findOne({ id: userId }, { populate: ["orders.items", "orders.address"] });

        if (!user) throw new Error("User not found");

        const order = user.orders.getItems().find((order) => order.id === orderId);

        if (!order) throw new Error("Order not found");

        return order;
    }
}