import { Listener, Subjects, OrderCancelledEvent } from "@yhticketing/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName: string = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);

        if (!ticket) {
            throw new Error('Ticket not found!');
        }

        ticket.set({orderId: undefined});
        await ticket.save();

        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            userId: ticket.userId,
            orderId: ticket.orderId!,
            title: ticket.title,
            price: ticket.price,
            version: ticket.version
        });

        msg.ack();
    }
}