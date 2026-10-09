import { DI, initializeORM } from "./di"
import { app } from "./app";

export const initializeServer = async () => {
    initializeORM();
    
    // DI.server = app.listen(4000,"0.0.0.0", () => {
    DI.server = app.listen(4000, () => {
        console.log('Server running on port 4000');
        }
    );
}

initializeServer();