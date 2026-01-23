import express from "express";
import bookingRouter from "./Routes/bookingRoute.ts";
import { sequelize } from "./Config/dbConfig.ts";
import { db } from "./Models/index.ts";
import employeeRouter from "./Routes/employeeRoute.ts";
import userRouter from "./Routes/userRoute.ts";

const app = express();

app.use(express.json());

app.get("/api", (req: any, res: any) => res.send("API is running"));

app.listen(4000, () =>
  sequelize
    .sync({ alter: true })
    .then(() => console.log("Server is running on PORT 4000"))
    .catch((err: any) => console.log(err)),
);
