import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import 'dotenv/config';
import './db/index.js'
import teacherRouter from './routes/teacher.routes.js';
import studentRouter from './routes/student.routes.js';
import classesRouter from './routes/classes.routes.js';
import cors from 'cors'

const port = process.env.PORT || 3000;
const app = express();
const httpServer = createServer(app);


const io = new Server(httpServer, {
    cors:{
        origin:"*",
    }
});

app.get('/',(req,res)=>{
    res.send("Server is running");
});

app.use(cors(
    {
        origin:"*",
    }
))
app.use(express.json());
app.use('/teacher',teacherRouter);
app.use('/student',studentRouter);
app.use('/classes',classesRouter);



io.on("connection", (socket) => {
  console.log(`a user connected with socket id ${socket.id}`);
    socket.on("disconnect", () => {
        console.log(`user disconnected with socket id ${socket.id}`);
    });
});

httpServer.listen(port,(req,res)=>{
    console.log(`Server is running on port ${port}`);
});