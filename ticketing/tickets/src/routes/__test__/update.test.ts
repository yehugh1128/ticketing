import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

const id = new mongoose.Types.ObjectId().toHexString();

const createTicket = async (cookie: any) => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'testtitle',
            price: 10
        });
    return response;
}

it('如果提交的ID不存在，返回404', async () => {
    await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
        title: 'testtitle',
        price: 10
    })
    .expect(404);
});

it('如果用户未通过授权，返回401', async () => {
    await request(app)
    .put(`/api/tickets/${id}`)
    .send({
        title: 'testtitle',
        price: 10
    })
    .expect(401);
});

it('如果票不属于用户所有，返回401', async () => {
    const response = await createTicket(global.signin());
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'testtitle2',
            price: 200
        })
        .expect(401);
});

it('如果提交了错误的标题或价格，返回400', async () => {
    const cookie = global.signin();
    const response = await createTicket(cookie);
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 100
        })
        .expect(400);
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'testse',
            price: 0
        })
        .expect(400);
});

it('提交正确的价格及标题完成更新', async () => {
    const cookie = global.signin();
    const response = await createTicket(cookie);
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'testtitle2',
            price: 100
        })
        .expect(200);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send();

    expect(ticketResponse.body.title).toEqual('testtitle2');
    expect(ticketResponse.body.price).toEqual(100);
});