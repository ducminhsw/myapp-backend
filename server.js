const express = require('express');
require('dotenv').config();

const port = process.env.PORT;

const app = express();

app.use(express.json());

app.use('/api/v1/admin', require('./routes/adminRoute'));
app.use('/api/v1/user', require('./routes/userRoute'));
app.use('/api/v1/friend', require('./routes/friendRoute'));
app.use('/api/v1/conversation', require('./routes/conversationRoute'));
app.use('/api/v1/videocall', require('./routes/videoCallRoute'));
app.use('/api/v1/group', require('./routes/groupRoute'));

app.listen(port, () => {
    console.log("Server listening on port:", port);
})