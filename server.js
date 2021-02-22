const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

const customerRoutes = require("./routes/customerRoutes");

const app = express();

dotenv.config();
const Port = process.env.PORT || 2000;


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin : [
        "http://localhost:3000"
    ],
    credentials : true,
}))

connectDB();




app.use('/api/user', userRoutes);
app.use('/api/customer', customerRoutes);

app.listen(Port, () => {
    console.log(`Server running on port http://localhost:${Port}`);
});