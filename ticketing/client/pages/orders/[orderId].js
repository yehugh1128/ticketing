import { useEffect, useState } from "react";
import StripeCheckout from 'react-stripe-checkout';
import Router from "next/router";
import useRequest from "../../hooks/use-request";
const OrderShow = ({order, currentUser}) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const { doRequest, displayError } = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: () => Router.push('/orders')
    });
    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000));
        }
        findTimeLeft();
        const timeId = setInterval(findTimeLeft, 1000);
        //当离开或停止显示此组件时执行下面函数
        return () => {
            clearInterval(timeId);
        }
    }, []);
    if (timeLeft <= 0) {
        return (<div>Order expired</div>);
    }
    return (
        <div>
            Time left to pay: {timeLeft} seconds
            <StripeCheckout 
                token={({id})=>doRequest({token: id})}
                amount={order.ticket.price * 100}
                email={currentUser.email}
                stripeKey="pk_test_51OMpR1HqWN9TbtpWpYgvdD6c6ruzv7eZ0dqME53pyqLy39oQehVNKAgIbC89FkKPgTgcegmw3QyaSrJUzqBs3gO900vFX2WakE"
            />
            {displayError()}
        </div>
    );
}

OrderShow.getInitialProps = async (context, client) => {
    const {orderId} = context.query;
    const {data} = await client.get(`/api/orders/${orderId}`);
    return {order: data};
}
export default OrderShow;