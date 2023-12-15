import { Subjects, TicketUpdatedEvent, Listener } from "@yhticketing/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName: string = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const { id, title, price, version } = data;
        const ticket = await Ticket.findByEvent({ id, version });
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        ticket.set({ title, price });//第二版，不使用mongoose-update-if-current插件更新version时，ticket.set({title,price,version})带上version
        await ticket.save();

        msg.ack();
    }
}