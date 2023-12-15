import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
//路由
import { currentUserRoute } from './routes/current-user';
import { signupRouter } from './routes/signup';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
//公用库
import { NotFoundError, errorHandle } from '@yhticketing/common';
const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    secure: process.env.NODE_ENV !== 'test',
    signed: false
}));

app.use(currentUserRoute);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);

app.all('*', () => {
    throw new NotFoundError();
});

app.use(errorHandle);

export { app };