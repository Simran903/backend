import dotenv from 'dotenv';
import logger from '../logger.js'
import morgan from "morgan";
import express from "express";
import connectDB from "./db/index.js";

dotenv.config({
  path: './env'
})
const app = express()
const port = process.env.PORT || 8000;
app.use(express.json());

const morganFormat = ":method :url :status :response-time ms";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

app.listen(port, () => {
  console.log("Working");
})

connectDB()