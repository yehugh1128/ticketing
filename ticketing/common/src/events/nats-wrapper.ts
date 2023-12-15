import nats, { Stan } from 'node-nats-streaming';

export class NatsWrapper {
    private _client?: Stan;
    get client() {
        if (!this._client) {
            throw new Error('NATS not connected!')
        }
        return this._client;
    }

    connect(clusterId: string, clientId: string, url: string) {
        this._client = nats.connect(clusterId, clientId, { url });
        return new Promise<void>((resolve, rejects) => {
            this.client.on('connect', () => {
                console.log('connected to NATS');
                resolve();
            });
            this.client.on('error', () => {
                rejects();
            });
        });
    }
}

// export const natsWrapper = new NatsWrapper();