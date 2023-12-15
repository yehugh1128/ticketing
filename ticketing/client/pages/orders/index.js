const OrderIndex = ({orders}) => {
    return <table className="table">
        <thead>
            <tr>
                <th>
                    Ticket
                </th>
                <th>
                    Status
                </th>
            </tr>
        </thead>
        <tbody>
            {orders.map((order) => {
                return <tr key={order.id}><td>{order.ticket.title}</td><td>{order.status}</td></tr>
            })}
        </tbody>
    </table>
}

OrderIndex.getInitialProps = async (context, client) => {
    const { data } = await client.get('/api/orders');
    return { orders: data };
}

export default OrderIndex;