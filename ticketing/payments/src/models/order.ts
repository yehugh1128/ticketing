import { OrderStatus } from "@yhticketing/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttr {
    id: string;
    version: number;
    price: number;
    status: OrderStatus;
    userId: string;
}

interface OrderDoc extends mongoose.Document {
    price: number;
    status: OrderStatus;
    userId: string;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attr: OrderAttr): OrderDoc;
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret){
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

orderSchema.statics.build = (attr: OrderAttr) => {
    return new Order({
        _id: attr.id,
        version: attr.version,
        price: attr.price,
        status: attr.status,
        userId: attr.userId
    });
}

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order }