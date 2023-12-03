const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();

const socketServer = require('./socketIO/socketServer');
const mongoConnector = require('./database/mongo-access');

const port = process.env.PORT;

const app = express();

app.use(express.json());
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
};

app.use(cors(corsOptions));

app.use('/api/v1/auth', require('./routes/authRoute'));
app.use('/api/v1/admin', require('./routes/adminRoute'));
app.use('/api/v1/user', require('./routes/userRoute'));
app.use('/api/v1/myself', require('./routes/myselfRoute'));
app.use('/api/v1/friend', require('./routes/friendRoute'));
app.use('/api/v1/conversation', require('./routes/conversationRoute'));
app.use('/api/v1/server', require('./routes/serverRoute'));
app.use('/api/v1/channel', require('./routes/channelRoute'));

const server = http.createServer(app);
socketServer.registerSocketServer(server);
mongoConnector.mongooseConnector(server, port);