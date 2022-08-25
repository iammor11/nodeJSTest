require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

const app = express();

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.CLUSTER_URL}/${process.env.COLLECTION_NAME}?retryWrites=true&w=majority`)

mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.once('open', () => {
    console.log("Connected to mongoDB")
})

db.on('error', () => {
    console.log("Get errors while connected to mongoDB");
})

app.use(cors({
    credentials: true
}))

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/category');

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", '*');
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
})

app.use('/api', authRoutes);
app.use('/api/category', categoryRoutes);

app.use((req, res, next) => {
    const error = new Error("Not Found");
    res.status(404);
    next(error)
})

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log("Server has started on port " + port)
})