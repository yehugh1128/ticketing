import { Publisher, TicketCreatedEvent, Subjects } from "@yhticketing/common";

export class TicketCreatePublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}