import request from 'supertest';
import { app } from '../app';
import { Ticket } from '../models/ticket';
import mongoose from 'mongoose';

it('通过订单号获取订单信息', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        id,
        title: 'test',
        price: 10
    });
    await ticket.save();
    const user = global.signin();
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({
            ticketId: ticket.id
        })
        .expect(201);
    const { body: fetchOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);

    expect(fetchOrder.id).toEqual(order.id);
});