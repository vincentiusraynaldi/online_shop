import { Category } from '../entity/category';

export type CreateItemDTO = {
    itemName: string;
    itemDescription: string;
    itemPrice: number;
    itemWeight: number;
    itemBrand: string;
    categories: Category[];
    availableStock: number;
    // itemCategory: string;
    // itemImage: string[];
};

export type ItemDTO = {
    id: string;
    itemName: string;
    itemDescription: string;
    itemPrice: number;
    itemWeight: number;
    itemBrand: string;
    categories: Category[];
    // itemCategory: string;
    // itemImage: string[];
    createdAt: Date;
    updatedAt: Date;
};