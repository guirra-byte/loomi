import rabbitmqClient from '@/core/libs/rabbitmq/client';
import { makeOrderCreated } from './make-order-created';

async function orderCreatedConsumer() {
  console.log('[order-created] consumer is running...');
  const { channel } = await rabbitmqClient;
  channel.assertQueue('order.created', { durable: true });
  channel.consume('order.created', async (message) => {
    if (message) {
      const { orderId } = JSON.parse(message.content.toString());
      const orderCreatedUseCase = makeOrderCreated();
      await orderCreatedUseCase.execute(orderId);
      channel.ack(message);
    }
  });
}

orderCreatedConsumer();