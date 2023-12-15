import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
    var signin: () => string[]
}

jest.mock('../nats-wrapper.ts');

let mongo: any;
beforeAll(async () => {
    process.env.JWT_KEY = 'abcdefg';
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    try{
        await mongoose.connect(mongoUri);
    }
    catch(err){
        console.log('errorOF:', err);
    }
});

beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});


global.signin = () => {
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    };
    const token = jwt.sign(payload, process.env.JWT_KEY!);
    const session = { jwt: token };
    const sessionJSON = JSON.stringify(session);
    const sessionBase64 = Buffer.from(sessionJSON).toString('base64');
    return [`country=; city=""; traffic_target=gd; pvisitor=2b92b806-ed86-493f-89a9-dec53ab28f8b; caf_ipaddr=10.119.144.22; session=${sessionBase64}`];
}