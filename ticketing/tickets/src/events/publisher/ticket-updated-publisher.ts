import { Publisher, Subjects, TicketUpdatedEvent } from "@yhticketing/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}