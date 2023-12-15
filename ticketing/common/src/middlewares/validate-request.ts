import { Request, Response, NextFunction } from "express";
import { ReqeustValidationError } from "../errors/request-validation-error";
import { validationResult } from "express-validator";
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ReqeustValidationError(errors.array());
    }
    next();
}