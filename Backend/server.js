import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import { router } from "./APIs/RestFullApis.js";
import { connect } from "mongoose";

dotenv.config();
const app = express();
app.use(cors());
// app.use(cors({
//   origin: "https://pavanparitala09.github.io/To-Do-App/"
// }));
//body parser to conver into js obj
app.use(express.json());

//connect db
const connectdb = async () => {
  try {
    //connect to db
    await connect(process.env.MONGO_DB_URL);
    console.log("db connected");
    //assign port and start server
    app.listen(process.env.PORT, () => {
      console.log("Server is running on", process.env.PORT);
    });
  } catch (err) {
    console.log("error occured during db connection :", err.message);
  }
};
//call the function
connectdb();

//send to api page
app.use("/", router);

//if route not found
app.use((req, res, next) => {
  res.status(404).json({ message: `${req.url} is an invalid URL` });
});

//error handeling middle ware
function errorHandler(err, req, res, next) {
  res.json({ message: "error occured", reason: err.message });
}

app.use(errorHandler);
