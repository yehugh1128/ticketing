import { OrderCreatedListener } from "../listeners/order-created-listener";
import { OrderStatus, OrderCreatedEvent } from "@yhticketing/common";
import { Order } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";
import mongoose, { set } from "mongoose";
import { Message } from "node-nats-streaming";

const setup = () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'dsafsadf',
        expiresAt: 'dsafadsf',
        ticket: {
            id: 'test',
            price: 100
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { data, msg, listener };
}

it('添加订单信息', async () => {
    const { data, msg, listener } = setup();
    await listener.onMessage(data,msg);
    const order = await Order.findById(data.id);
    expect(order!.price).toEqual(data.ticket.price);
});

it('接收成功执行ack', async () => {
    const { data, msg, listener } = setup();
    await listener.onMessage(data,msg);
    expect(msg.ack).toHaveBeenCalled();
});