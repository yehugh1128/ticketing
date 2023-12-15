import { Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
    subject: Subjects;
    data: any;
}

export abstract class Publisher<T extends Event> {
    abstract subject: T['subject'];
    protected client;

    constructor(client: Stan) {
        this.client = client;
    }

    publish(data: T['data']): Promise<void> {
        return new Promise((resolve, rejects) => {
            this.client.publish(this.subject, JSON.stringify(data), (err) => {
                console.log(`Event publish to subject: ${this.subject}`);
                console.log(`${this.subject} data: ${data}`);
                if (err) {
                    rejects(err);
                }
                resolve();
            });
        });
    }
}