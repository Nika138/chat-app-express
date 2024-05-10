import express, { Express, Request, Response } from "express";
import { myDataSource } from "./config.js";
import { AuthController } from "./controllers/auth.controller.js";
import { configDotenv } from "dotenv";

configDotenv();

myDataSource
  .initialize()
  .then(() => {
    console.log(`Database has been initialized`);
  })
  .catch((err) => {
    console.error("Error during Database initialization", err);
  });

const app: Express = express();

const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/signup", AuthController.signUp);
app.post("/signin", AuthController.signIn);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
