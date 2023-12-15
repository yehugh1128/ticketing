import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import 'express-async-errors';
//公库
import { NotFoundError, errorHandle, currentUser } from '@yhticketing/common';
//路由
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTickersRouter } from './routes';
import { updateTicketRouter } from './routes/update';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    secure: process.env.NODE_ENV !== 'test',
    signed: false
}));
app.use(currentUser);
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTickersRouter);
app.use(updateTicketRouter);

app.all('*', () => {
    throw new NotFoundError();
});

app.use(errorHandle);

export { app };