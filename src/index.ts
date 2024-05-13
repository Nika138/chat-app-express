import express, { Express, Request, Response } from "express";
import { myDataSource } from "./config.js";
import { AuthController } from "./controllers/auth.controller.js";
import { configDotenv } from "dotenv";
import path from "path";

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

app.use(express.static(path.join(process.cwd(), "src/views")));

app.get("/", (req: Request, res: Response) => {
  res.sendFile("home/home.html", {
    root: path.join(process.cwd(), "src/views"),
  });
});

app.get("/signup", (req: Request, res: Response) => {
  res.sendFile("signup/signup.html", {
    root: path.join(process.cwd(), "src/views"),
  });
});

app.get("/login", (req: Request, res: Response) => {
  res.sendFile("login/login.html", {
    root: path.join(process.cwd(), "src/views"),
  });
});

app.post("/signup", AuthController.signUp);
app.post("/signin", AuthController.signIn);
app.post("/forgot-password", AuthController.forgotPassword);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
