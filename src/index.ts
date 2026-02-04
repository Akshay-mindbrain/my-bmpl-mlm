import "module-alias/register";
import "reflect-metadata";
import { createServer } from "./server";
import config from "./config";
import logger from "./logger";
import dotenv from "dotenv";
dotenv.config();
const server = createServer();

server.listen(config.port, () => {
  logger.info(process.env.PORT);
  console.log(`api running on ${config.port}`);
});
