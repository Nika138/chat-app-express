import express from "express";
import { myDataSource } from "./config.js";
import { AuthController } from "./controllers/auth.controller.js";
import { configDotenv } from "dotenv";
import path from "path";
import http from "http";
import { WebSocketServer } from "ws";
import cors from "cors";
configDotenv();
myDataSource
    .initialize()
    .then(() => {
    console.log(`Database has been initialized`);
})
    .catch((err) => {
    console.error("Error during Database initialization", err);
});
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server: server });
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(process.cwd(), "src/views")));
app.get("/", (req, res) => {
    res.sendFile("home/home.html", {
        root: path.join(process.cwd(), "src/views"),
    });
});
app.get("/signup", (req, res) => {
    res.sendFile("signup/signup.html", {
        root: path.join(process.cwd(), "src/views"),
    });
});
app.get("/login", (req, res) => {
    res.sendFile("login/login.html", {
        root: path.join(process.cwd(), "src/views"),
    });
});
app.post("/signup", AuthController.signUp);
app.post("/signin", AuthController.signIn);
app.post("/forgot-password", AuthController.forgotPassword);
wss.on("connection", function connection(ws) {
    console.log("Client connected");
    ws.send("Welcome");
    ws.on("close", function close() {
        console.log("Client disconnected");
    });
});
wss.on("error", function (error) {
    console.error("WebSocket server error:", error);
});
server.on("upgrade", function (request, socket, head) {
    wss.handleUpgrade(request, socket, head, function (ws) {
        wss.emit("connection", ws, request);
    });
});
console.log("WebSocket server is running");
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
