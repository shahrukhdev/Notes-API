import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtUserPayload } from "../types/jwt.js";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {

    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized.",
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtUserPayload;

        req.user = decoded;

        next();

    } catch(error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });
    }

};