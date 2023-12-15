import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Order, OrderStatus } from './order';

interface TicketAttr {
    id: string;
    title: string;
    price: number;
}

export interface TicketDoc extends mongoose.Document {
    version: number;
    title: string;
    price: number;
    isReserved(): Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attr: TicketAttr): TicketDoc;
    findByEvent(event: { id: string, version: number }): Promise<TicketDoc | null>
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});
ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

//不使用mongoose-update-if-current插件并业务version不是按1递增时，用以下版本代替
/*ticketSchema.pre('save', function(next){
    this.$where = {
        version: this.get('version') -1
    }
    next();
});*/

ticketSchema.statics.build = (attr: TicketAttr) => {
    return new Ticket({
        _id: attr.id,
        title: attr.title,
        price: attr.price
    });
}
ticketSchema.statics.findByEvent = (event: { id: string, version: number }) => {
    return Ticket.findOne({
        _id: event.id,
        version: event.version - 1
    });
}
ticketSchema.methods.isReserved = async function () {
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete,
                OrderStatus.Created
            ]
        }
    });

    return !!existingOrder;
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };