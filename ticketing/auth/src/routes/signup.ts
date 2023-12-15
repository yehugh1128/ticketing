import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '@yhticketing/common';
import { User } from '../models/user';
import { BadRequestError } from '@yhticketing/common';
import jwt from 'jsonwebtoken';

const route = express.Router();

route.post('/api/users/signup', [
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

    if (existingUser) {
        throw new BadRequestError({message:'邮箱已被注册过',field:'email'});
    }

    const user = User.build({ email, password });

    //Generate JWT
    const userJwt = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY!);

    //Store it on session object
    req.session = {
        jwt: userJwt
    };

    await user.save();
    res.status(201).send(user);
});

export { route as signupRouter };