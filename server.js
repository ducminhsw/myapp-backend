const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();

const socketServer = require('./socketServer');
const mongoConnector = require('./database/mongo-access');

const port = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/v1/auth', require('./routes/authRoute'));
app.use('/api/v1/admin', require('./routes/adminRoute'));
app.use('/api/v1/user', require('./routes/userRoute'));
app.use('/api/v1/myself', require('./routes/myselfRoute'));
app.use('/api/v1/friend', require('./routes/friendRoute'));
app.use('/api/v1/conversation', require('./routes/conversationRoute'));
app.use('/api/v1/videocall', require('./routes/videoCallRoute'));
app.use('/api/v1/group', require('./routes/groupRoute'));

const server = http.createServer(app);
socketServer.registerSocketServer(server);
mongoConnector.mongooseConnector(server, port);