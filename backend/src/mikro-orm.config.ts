// import { Options } from '@mikro-orm/core';
import { defineConfig, PostgreSqlDriver, Options } from '@mikro-orm/postgresql';
import { SeedManager } from '@mikro-orm/seeder';
import { 
    Order, 
    Item, 
    User, 
    Category, 
    Cart, 
    Address, 
    Wishlist,
    CartItem,
    OrderItem 
} from './entity';
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, '../.env.backend') });

const options: Options = {
    driver: PostgreSqlDriver,
//     type: 'postgresql',
    extensions: [SeedManager],
    entities: [Item, User, Order, Category, Cart, Address, Wishlist, CartItem, OrderItem],
    // host: 'localhost' ||  'database', //'database' is from the docker container name for the postgresql image
    host: 'localhost', //'database' is from the docker container name for the postgresql image
    dbName: process.env.POSTGRES_DB,
    // dbName: 'online_shop_DB',
    password: process.env.POSTGRES_PASSWORD,
    // password: 'online_shop123',
    user: process.env.POSTGRES_USER,
    // user: 'online_shop',
    debug: true,
    port: 5432,
    seeder: {
        path: './src/seeder', // path to the folder with seeders js file
        // path: '../dist/seeders', // path to the folder with seeders js file for production (not yet tested)
        pathTs: './src/seeder', // path to the folder with TS seeders (if used, you should put path to compiled files in `path`)
        defaultSeeder: 'DatabaseSeeder', // default seeder class name
        glob: '!(*.d).{js,ts}', // how to match seeder files (all .js and .ts files, but not .d.ts)
        emit: 'ts', // seeder generation mode
        fileName: (className: string) => className, // seeder file naming convention
    },
};

// export default defineConfig({
//     driver: PostgreSqlDriver,
//     extensions: [SeedManager],
//     entities: [Item, User, Order, Category, Cart, Address, Wishlist, CartItem, OrderItem],
//     // host: 'localhost' ||  'database', //'database' is from the docker container name for the postgresql image
//     host: 'localhost', //'database' is from the docker container name for the postgresql image
//     dbName: process.env.POSTGRES_DB,
//     // dbName: 'online_shop_DB',
//     password: process.env.POSTGRES_PASSWORD,
//     // password: 'online_shop123',
//     user: process.env.POSTGRES_USER,
//     // user: 'online_shop',
//     debug: true,
//     port: 5432,
//     seeder: {
//         path: './src/seeder', // path to the folder with seeders js file
//         // path: '../dist/seeders', // path to the folder with seeders js file for production (not yet tested)
//         pathTs: './src/seeder', // path to the folder with TS seeders (if used, you should put path to compiled files in `path`)
//         defaultSeeder: 'DatabaseSeeder', // default seeder class name
//         glob: '!(*.d).{js,ts}', // how to match seeder files (all .js and .ts files, but not .d.ts)
//         emit: 'ts', // seeder generation mode
//         fileName: (className: string) => className, // seeder file naming convention
//     },
// });

export default options;