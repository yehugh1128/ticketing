import { TicketUpdatedEvent } from "@yhticketing/common";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose, { set } from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
    const listener = new TicketUpdatedListener(natsWrapper.client);
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'testtitle',
        price: 50
    });
    await ticket.save();
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        title: 'test',
        price: 20,
        version: ticket.version + 1,
        userId: '123'
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { data, msg, listener, ticket };
};

it('完成更新操作', async () => {
    const { data, msg, ticket, listener } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});

it('失败时不会触发', async () => {
    const { data, msg, listener } = await setup();
    data.version = 100;
    try {
        await listener.onMessage(data, msg);
    } catch (err) { }

    expect(msg.ack).not.toHaveBeenCalled();
});