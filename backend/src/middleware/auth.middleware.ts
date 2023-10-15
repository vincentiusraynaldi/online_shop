import bcrypt from 'bcrypt';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { NextFunction, Request, Response, RequestHandler } from "express";

import { DI } from '../index';

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const BCRYPT_SALT = 10;

const JWT_SECRET = process.env.JWT_SECRET;

const JWT_OPTIONS: SignOptions = {
    expiresIn: '1h', // 1 hour or 3600 seconds
    algorithm: 'HS256',
    issuer: 'https://localhost:3000',
};

type JwtUserData = {
    id: string;
    email: string;
    username: string;
    role: string;
};

export type JwtToken = JwtUserData & JwtPayload;

const hashPassword = (password: string) => bcrypt.hash(password, BCRYPT_SALT);

const comparePasswordwithHash = async (password: string, hash: string) =>
{
    try {
        return bcrypt.compare(password, hash);
    } catch {
        return false;
    }
};

const generateToken = (payload: JwtPayload) => {
    if (JWT_SECRET) {
        return jwt.sign(payload, JWT_SECRET, JWT_OPTIONS);
    } else {
        return null;
    }
};

const verifyToken = (token: string) => {
    if (JWT_SECRET) {
        return jwt.verify(token, JWT_SECRET) as JwtToken;
    } else {
        return null;
    }
};

const prepareAuthentication = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const AuthHeader = req.get('Authorization');
    if (AuthHeader) {
        try{
            const token = verifyToken(AuthHeader);
        if (token) {
            req.user = await DI.userRepository.findOne({id :token.id});
            req.token = token;
        } else {
            req.user = null;
            req.token = null;
        }
        } catch (err) {
            console.log(err);
        }
    } else {
        req.user = null;
        req.token = null;
    }
    next();
};


const verifyAccess: RequestHandler = (req, res, next) => {
    if(!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
    } else {
        next();
    }
}
 
export const Auth = {
    hashPassword,
    comparePasswordwithHash,
    generateToken,
    verifyToken,
    prepareAuthentication,
    verifyAccess,
}

