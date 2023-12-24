import { User } from "../entities";
import { JwtToken } from "../middleware/auth.middleware";

declare global {
    namespace Express {
        interface Request {
            user: User | null;
            token: JwtToken | null;
        }
    }
}