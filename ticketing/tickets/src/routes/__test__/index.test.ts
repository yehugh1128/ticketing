import request from 'supertest';
import { app } from '../../app';

const createTicket = () => {
    return request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'testtitle',
            price: 10
        })
        .expect(201);
}

it('获取所有记录', async () => {
    await createTicket();
    await createTicket();

    const response = await request(app)
        .get('/api/tickets')
        .set('Cookie', global.signin())
        .send()
        .expect(200);
    expect(response.body.length).toEqual(2);
});