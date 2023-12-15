import { app } from "./app";
import mongooes from 'mongoose';
import { DatabaseConnectionError } from "@yhticketing/common";
import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listener/order-created-listener";
import { OrderCancelledListener } from "./events/listener/order-cancelled-listener";

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }

    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }

    if (!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID must be defined');
    }

    if (!process.env.NATS_URL) {
        throw new Error('NATS_URL must be defined');
    }

    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error('NATS_CLUSTER_ID must be defined');
    }
    try {
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);

        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed');
            process.exit();
        });
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        //添加监听事件
        new OrderCreatedListener(natsWrapper.client).listen();
        new OrderCancelledListener(natsWrapper.client).listen();

        await mongooes.connect(process.env.MONGO_URI);
        console.log('connect to mongodb');
    }
    catch {
        throw new DatabaseConnectionError();
    }
    app.listen(3000, () => {
        console.log('Listening on 3000');
    });
}

start();