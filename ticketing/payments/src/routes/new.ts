import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@yhticketing/common';
import { Order } from '../models/order';
import { stripe } from '../stripe';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post('/api/payments', requireAuth, [
    body('orderId')
        .not()
        .isEmpty(),
    body('token')
        .not()
        .isEmpty()
], validateRequest, async (req: Request, res: Response) => { 
    const { orderId, token } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
        throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
        throw new BadRequestError({message: '订单已取消'});
    }
    console.log('stripe key:',process.env.STRIPE_KEY);
    const charge = await stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100,
        source: token
    })

    const payment = Payment.build({
        orderId,
        stripeId: charge.id
    })
    await payment.save();

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId
    });

    res.status(201).send({id: payment.id});
});

export { router as createChargeRouter };