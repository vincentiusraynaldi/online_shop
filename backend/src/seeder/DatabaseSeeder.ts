import { Seeder } from "@mikro-orm/seeder";
import { EntityManager } from "@mikro-orm/core";
import { CategorySeeder } from "./CategorySeeder";
import { ItemSeeder } from "./ItemSeeder";


export class DatabaseSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        // const  = em.create()
        return this.call(em, [
            CategorySeeder,
            ItemSeeder
        ])
    }
}