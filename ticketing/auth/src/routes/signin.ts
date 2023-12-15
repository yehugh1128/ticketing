import express, { Request, Response } from "express";
import { body } from 'express-validator';
import { validateRequest } from "@yhticketing/common";
import { Password } from "../services/password";
import { User } from "../models/user";
import { BadRequestError } from "@yhticketing/common";
import jwt from 'jsonwebtoken';

const route = express.Router();

route.post('/api/users/signin', [
    body('email')
        .isEmail()
        .withMessage('邮箱格式错误'),
    body('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('密码长度在4-20个字符之间')
], validateRequest, async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        throw new BadRequestError({ message: '验证失败', field: 'email' });
    }
    const passwordMatch = await Password.compare(existingUser.password, password);
    if (!passwordMatch) {
        throw new BadRequestError({ message: '验证失败', field: 'password' });
    }
    const userJwt = jwt.sign({ id: existingUser.id, email: existingUser.email }, process.env.JWT_KEY!);
    req.session = {
        jwt: userJwt
    };
    res.status(200).send(existingUser);
});

export { route as signinRouter };