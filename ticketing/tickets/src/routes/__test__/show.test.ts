import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it('路由不存在，返回404', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    request(app)
        .get(`/api/tickets/${id}`)
        .send()
        .expect(404);
});

it('返回查询数据', async () => {
    const title = 'testtitle';
    const price = 10;

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({ price, title })
        .expect(201);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send()
        .expect(200);

    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);

});