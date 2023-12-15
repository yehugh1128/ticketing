import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@yhticketing/common';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

// jest.mock('../../stripe');

it('订单不存在 ，返回404', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'test',
            orderId: new mongoose.Types.ObjectId().toHexString()
        })
        .expect(404);
});

it('订单不属于当前用户，返回401', async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        price: 10,
        status: OrderStatus.Created,
        version: 0
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'test',
            orderId: order.id
        })
        .expect(401);
});

it('订单已取消，返回400', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const orderId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: orderId,
        userId,
        price: 10,
        status: OrderStatus.Cancelled,
        version: 0
    });
    await order.save();
    
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(order.userId))
        .send({
            token: 'test',
            orderId
        })
        .expect(400);
});

it('成功支付，返回201', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const orderId = new mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random() * 100000);
    const order = Order.build({
        id: orderId,
        userId,
        price,
        status: OrderStatus.Created,
        version: 0
    });
    await order.save();
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            token: 'tok_visa',
            orderId
        })
        .expect(201);
    const stripeCharges = await stripe.charges.list({limit: 50});
    const stripeCharge = stripeCharges.data.find((charge)=>{
        return charge.amount === price * 100;
    })
    expect(stripeCharge).toBeDefined();

    const payment = await Payment.findOne({
        orderId,
        stripeId: stripeCharge!.id
    });

    expect(payment).not.toBeNull();
});