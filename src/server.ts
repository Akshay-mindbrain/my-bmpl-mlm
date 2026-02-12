import express, { Request, Response } from "express";
import cors from "cors";
import config from "./config";
import v1 from "./api/v1";
import morganMiddleware from "./middleware/morgan-middleware";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

export const createServer = () => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morganMiddleware)
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use(cors());

  app.use(cookieParser());
  app.use(helmet());
  app.use(rateLimit());

  app.get("/health", (req: Request, res: Response) => {
    res.json({ ok: true, environment: config.env });
  });

  app.use("/v1", v1);

  return app;
};
