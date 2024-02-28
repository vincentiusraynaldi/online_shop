import  { User as userInfo }  from "../entities";
import { JwtToken } from "../middleware/auth.middleware";

declare global {
    namespace Express {
        interface Request {
            user:  userInfo | null;
            token: JwtToken | null;
        }
    }
}