import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import bodyParser from "body-parser"
import { config } from "./config"
import { router } from "./routes/routes"



const app = express()
//middleware
app.use(cors())
app.use(bodyParser.json())

//database connection
if (!config.MONGODB_URI) {
    console.error("MONGODB_URI is not defined in config.");
    process.exit(1);
}
mongoose.connect(config.MONGODB_URI)
    .then(() => console.log("Connected to database"))
    .catch((error) => {
        console.log("Failed to connect to db", error, config.MONGODB_URI);
        process.exit(1);
    });

//routes
app.use("/api", router)

app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`)
})