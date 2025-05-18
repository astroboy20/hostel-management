import express, { NextFunction, Request, Response } from "express"
import mongoose from "mongoose"
import cors from "cors"
import bodyParser from "body-parser"
import { config } from "./config"
import { router } from "./routes/routes"




const app = express()
//middleware
app.use(cors())
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'GET,POST,PUT,PATCH,DELETE'
        );
        res.sendStatus(204);
        return;
    }
    next();
});

//database connection
if (!config.MONGODB_URI) {
    console.error("MONGODB_URI is not defined in config.");
    process.exit(1);
}
mongoose.connect(config.MONGODB_URI)
    .then(() => console.log("Connected to database"))
    .catch((error) => {
        console.log("Failed to connect to db", error);
        process.exit(1);
    });

//routes
app.use("/api", router)


app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`)
})