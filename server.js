import express from "express";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import tokenRoute from "./routes/tokenRoute.js";

import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
// import schedule from "node-schedule";
// import { sendUpcomingTaskNotifications } from "./utils/notification.js";

const port = process.env.PORT || 5000;

connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/payments", paymentRoutes);
app.use("/token", tokenRoute);

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.use(notFound);
app.use(errorHandler);

// const job = schedule.scheduleJob("8 * * * *", async () => {
//   // Runs once every day
//   try {
//     await sendUpcomingTaskNotifications();
//     console.log("Sent upcoming task notifications");
//   } catch (error) {
//     console.error("Error sending upcoming task notifications:", error);
//   }
// });

// const job = schedule.scheduleJob("0 8 * * *", async () => {
//   // Runs once a day at 8:00 AM
//   try {
//     await sendUpcomingTaskNotifications();
//     console.log("Sent upcoming task notifications");
//   } catch (error) {
//     console.error("Error sending upcoming task notifications:", error);
//   }
// });

app.listen(port, () => console.log(`Server started on port ${port}`));
