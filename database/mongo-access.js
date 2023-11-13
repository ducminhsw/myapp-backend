const mongoose = require('mongoose');

const mongooseConnector = (server, port) => {
    mongoose.connect(process.env.MONGO_DB_URL)
        .then(() => {
            console.log("Mongoose connected");
            server.listen(port, () => {
                console.log("Server listening on port:", port);
            })
        }).catch((err) => {
            console.log("Broken mongoose connection", err);
            throw new Error(err);
        })
}

module.exports = { mongooseConnector };