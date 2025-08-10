import { EntityManager } from "@mikro-orm/postgresql";
import { Seeder } from "@mikro-orm/seeder";
import { Category } from "../entity";

export class CategorySeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        const now = new Date();
        const categories = [
            { categoryName: 'Electronics', createdAt: now, updatedAt: now },
            { categoryName: 'Handphone', createdAt: now, updatedAt: now },
            { categoryName: 'Laptop', createdAt: now, updatedAt: now },
            { categoryName: 'Clothing', createdAt: now, updatedAt: now },
            { categoryName: 'Shoes', createdAt: now, updatedAt: now },
        ];

        for (const categoryData of categories) {
            // Check if category already exists to avoid duplicates
            const existing = await em.findOne(Category, { categoryName: categoryData.categoryName });
            
            if (!existing) {
                const category = em.create(Category, categoryData);
                em.persist(category);
            }
        }
        
        await em.flush(); // Save all changes to database
    }
}