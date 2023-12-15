import express, { Request, Response} from 'express';
import { Order } from '../models/order';
import { BadRequestError, NotAuthorizedError, NotFoundError } from '@yhticketing/common';
import mongoose from 'mongoose';
const router = express.Router();

router.get('/api/orders/:id', async (req: Request, res: Response) => {
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValidId){
        throw new BadRequestError({message: 'invalid order id'});
    }
    const order = await Order.findById(req.params.id);
    if (!order) {
        throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id){
        throw new NotAuthorizedError();
    }
    res.send(order);
});

export { router as showOrderRouter };