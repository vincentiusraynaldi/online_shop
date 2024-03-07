import  { User as userInfo }  from "../entities";
import { JwtToken } from "../middleware/auth.middleware";
import { User as PassportUser} from 'passport';

// declare global {
//     namespace Express {
//         export interface Request {
//             user:  userInfo & PassportUser | any;
//             token: JwtToken | null;
//         }
//     }
// }

declare module 'express-serve-static-core' {
    interface Request {
        user: userInfo & PassportUser | any;
        token: JwtToken | null;
    }
}