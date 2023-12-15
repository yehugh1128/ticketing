import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import 'express-async-errors';
//公库
import { NotFoundError, errorHandle, currentUser } from '@yhticketing/common';
//路由
import { createChargeRouter } from './routes/new';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    secure: process.env.NODE_ENV !== 'test',
    signed: false
}));

app.use(currentUser);

app.use(createChargeRouter);

app.all('*', () => {
    throw new NotFoundError();
});

app.use(errorHandle);

export { app };