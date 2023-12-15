import { Publisher, PaymentCreatedEvent, Subjects } from "@yhticketing/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}