const express = require('express');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { createEmailTransport } = require('./libs/nodemailer/connectTransport')
require('dotenv').config();
const base_url = '/api/v1/';

const socketServer = require('./socketIO/socketServer');
const mongoConnector = require('./database/mongo-access');

const port = process.env.PORT;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(`${base_url}auth`, require('./routes/authRoute'));
app.use(`${base_url}admin`, require('./routes/adminRoute'));
app.use(`${base_url}self`, require('./routes/selfRoute'));
app.use(`${base_url}friend`, require('./routes/friendRoute'));
app.use(`${base_url}conversation`, require('./routes/conversationRoute'));
app.use(`${base_url}server`, require('./routes/serverRoute'));
app.use(`${base_url}channel`, require('./routes/channelRoute'));

const options = {
    key: fs.readFileSync('./ssl/key.pem', 'utf-8'),
    cert: fs.readFileSync('./ssl/cert.pem', 'utf-8')
}

createEmailTransport();
const server = http.createServer(app);
socketServer.registerSocketServer(server);
mongoConnector.mongooseConnector(server, port);