import request from 'supertest';
import { app } from '../../app';

it('注册成功返回201状态码', async () => {
    return request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@qq.com',
        password: '123123'
    })
    .expect(201);
});

it('邮箱格式错误，返回400状态码', async () => {
    return request(app)
    .post('/api/users/signup')
    .send({
        email: 'test',
        password: '123123'
    })
    .expect(400);
});

it('密码长度错误，返回400状态码', async () => {
    return request(app)
    .post('/api/users/signup')
    .send({
        email:'test@qq.com',
        password: '123'
    })
    .expect(400);
});

it('检查注册成功后是否有设置Cookie', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@qq.com',
            password: '123123'
        })
        .expect(201);
    
    expect(response.get('Set-Cookie')).toBeDefined();
});