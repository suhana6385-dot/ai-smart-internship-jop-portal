import express, { Application, Request, Response } from "express";
import "express-async-errors";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import mainRouter from "./routes";
import { notFound, errorHandler } from "./middlewares/error.middleware";

const app: Application = express();

// Security & parsing middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Static files (uploaded resumes, profile images, company logos)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Server is healthy", timestamp: new Date() });
});

// API routes
app.use("/api/v1", mainRouter);

// 404 + error handler (must be last)
app.use(notFound);
app.use(errorHandler);

export default app;
