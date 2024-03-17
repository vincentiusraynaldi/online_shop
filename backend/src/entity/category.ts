// import { Property } from "@mikro-orm/core";
// import { BaseEntity } from "./baseEntity";
// import { Entity, OneToMany } from "@mikro-orm/core";

// @Entity()
// class Category extends BaseEntity{
//     @Property()
//     categoryName: string;

//     @OneToMany(() => Item, item => item.category)
//     items: Item[];

//     constructor(categoryName: string) {
//         super();
//         this.categoryName = categoryName;
//     }
// }

// export default Category;

//todo: must think wether make an category entity or just using it as an attribute in item entity