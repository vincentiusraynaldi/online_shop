import { Category } from "./Category"

export interface Product {
        id: string,
        itemName: string,
        itemDescription: string,
        itemPrice: number,
        itemWeight: number,
        itemBrand: string,
        availableStock: number,
        categories: Category[]
}