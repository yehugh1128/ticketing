import { Listener, Subjects, TicketCreatedEvent } from "@yhticketing/common"
import { Message } from "node-nats-streaming";

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = 'payment-service';
    onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
        console.log(`Event received subject: ${this.subject}`);
        msg.ack();
    }
}