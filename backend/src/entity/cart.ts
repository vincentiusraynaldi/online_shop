import { Embeddable, Entity, OneToMany } from "@mikro-orm/core";
import { Item } from "./";

@Embeddable()
export class Cart {
    // Add properties here
    items = new Set<Item>();
}