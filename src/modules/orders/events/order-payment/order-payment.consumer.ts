import rabbitmqClient from '@/core/libs/rabbitmq/client';
import { makeOrderPayment } from './make-order-payment';

async function orderPaymentConsumer() {
  console.log('[order-payment] consumer is running...');
  const { channel } = await rabbitmqClient;
  channel.assertQueue('order.payment', { durable: true });
  channel.consume('order.payment', async (message) => {
    if (message) {
      const { orderId } = JSON.parse(message.content.toString());

      const orderPaymentUseCase = makeOrderPayment();
      await orderPaymentUseCase.execute(orderId as string);
      channel.ack(message);
    }
  });
}

orderPaymentConsumer();