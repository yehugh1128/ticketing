import mongoose from "mongoose";
import request from 'supertest';
import { app } from "../app";
import { Ticket } from "../models/ticket";
import { Order, OrderStatus } from "../models/order";
import { natsWrapper } from "../nats-wrapper";

it('如果ticketId不存在，返回404', async () => {
    const ticketId = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId })
        .expect(404);
});

it('如果ticketId已经被预订了，返回400', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        id,
        title: 'test',
        price: 100
    });
    await ticket.save();

    const order = Order.build({
        userId: 'asdfasdfsf',
        status: OrderStatus.Created,
        expiresAt: new Date(),
        ticket
    });

    await order.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            ticketId: ticket.id
        })
        .expect(400);

});

it('成功创建订单', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        id,
        title: 'adsfadsf',
        price: 100
    });
    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId: ticket.id })
        .expect(201);
});
it('emits an order create event', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        id,
        title: 'adsfadsf',
        price: 100
    });
    await ticket.save();
    console.log(ticket.id);
    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId: ticket.id })
        .expect(201);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});