import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import http from "http";  

// Routes
import AuthRoute from './routes/AuthRoute.js';
import UserRoute from './routes/UserRoute.js';
import PostRoute from './routes/PostRoute.js';
import UploadRoute from './routes/UploadRoute.js';
import ChatRoute from './routes/ChatRoute.js';
import MessageRoute from './routes/MessageRoute.js';

// Socket.IO Setup
import { setupSocket } from './socket/socket.js'; 

dotenv.config();
const app = express();
const server = http.createServer(app); 
const io = setupSocket(server); 

// Middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(express.static('public'));
app.use('/images', express.static('images'));

// MongoDB Connection
const CONNECTION = process.env.MONGODB_CONNECTION;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    server.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));

// Routes
app.use('/auth', AuthRoute);
app.use('/user', UserRoute);
app.use('/posts', PostRoute);
app.use('/upload', UploadRoute);
app.use('/chat', ChatRoute);
app.use('/message', MessageRoute);


