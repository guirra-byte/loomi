import appInstance from "./app";
import "./modules/orders/events/order-created/order-created.consumer";
import "./modules/orders/events/order-payment/order-payment.consumer";

appInstance.listen({ port: 3000 }, (err: Error | null, address: string) => {
  if (err) {
    appInstance.log.error(err);
    process.exit(1);
  }

  appInstance.log.info(`server listening on ${address}`);
});