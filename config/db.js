const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useCreateIndex : true,
            useNewUrlParser : true,
            useUnifiedTopology : true,
            useFindAndModify : true
        });
        console.log("MongoDB connection established...");
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB;