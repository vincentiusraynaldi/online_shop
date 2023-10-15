import {
    Entity,
    Property,
}
from "@mikro-orm/core";
import { BaseEntity } from "./baseEntity";
import { object, string, number } from "yup";

@Entity()
export class Order extends BaseEntity {
    
    constructor() {
        super();
    }
}