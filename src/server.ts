import appInstance from "./app";

appInstance.listen({ port: 3000 }, (err: Error | null, address: string) => {
  if (err) {
    appInstance.log.error(err);
    process.exit(1);
  }

  appInstance.log.info(`server listening on ${address}`);
});