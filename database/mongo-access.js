const mongoose = require('mongoose');

const mongooseConnector = async () => {
    await mongoose.connect(process.env.MONGO_DB_URL)
        .then(() => {
            console.log("Mongoose connected");
        }).catch((err) => {
            console.log("Mongoose connection broke", err);
            throw new Error(err);
        })
}

module.exports = { mongooseConnector };