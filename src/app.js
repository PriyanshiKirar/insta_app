import express from "express";
import morgan from "morgan";
import userRoute from "./routes/userRoute.js";
import CookieParser from "cookie-parser";

const app = express();
// for which rout is hit and take time also how much
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(CookieParser());

app.use("/users", userRoute);

export default app;
