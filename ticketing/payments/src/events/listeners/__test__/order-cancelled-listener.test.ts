import { OrderCancelledListener } from "../listeners/order-cancelled-listener";
import { OrderCancelledEvent, OrderStatus } from "@yhticketing/common";
import { Order } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 100,
        status: OrderStatus.Created,
        userId: 'sadfdasf'
    });

    await order.save();

    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: 1,
        ticket: {
            id: 'test'
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, msg, data, order };
}

it('更新订单状态为取消', async () => {
    const { listener, msg, data, order } = await setup();
    await listener.onMessage(data, msg);
    const updateOrder = await Order.findById(order.id);

    expect(updateOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('act 消息', async () => {
    const { listener, msg, data } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});