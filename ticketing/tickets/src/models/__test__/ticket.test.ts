import { Ticket } from "../ticket";

it('测试版本号冲突', async () => {
    const ticket = Ticket.build({
        title: 'test',
        price: 10,
        userId: '123'
    });

    await ticket.save();

    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    firstInstance?.set({ price: 20 });
    await firstInstance?.save();

    secondInstance?.set({ price: 30 });

    try {
        await secondInstance?.save();
    }
    catch (err) {
        return;
    }
});

it('测试版本号是否会每次更新都自增', async () => {
    const ticket = Ticket.build({
        title: 'test',
        price: 10,
        userId: '123'
    });
    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);
});