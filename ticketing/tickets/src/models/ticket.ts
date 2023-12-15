import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TicketAttr {
    title: string;
    price: number;
    userId: string;
}

interface TickersDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
    version: number;
    orderId?: string;
}

interface TicketModel extends mongoose.Model<TickersDoc> {
    build(atrr: TicketAttr): TickersDoc;
}

const TicketSchame = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    orderId: {
        type: String,
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret.__v;
            delete ret._id;
        }
    }

});

TicketSchame.set('versionKey', 'version');
TicketSchame.plugin(updateIfCurrentPlugin);
TicketSchame.statics.build = (attrs: TicketAttr) => {
    return new Ticket(attrs);
}

const Ticket = mongoose.model<TickersDoc, TicketModel>('Ticket', TicketSchame);

export { Ticket };